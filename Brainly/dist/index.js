"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const zod_1 = require("zod");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const middleware_1 = require("./middlewares/middleware");
const cors_1 = __importDefault(require("cors"));
// importing the user schema
const userSchma_1 = require("./userSchma");
const generateHash_1 = require("./generateHash");
// Load enviroment varaible 
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const jwtPass = process.env.JWT_PASS;
// body parser or  middleware 
app.use(express_1.default.json());
//  cors
// app.use(cors({
//     origin: 'https://second-brain-8gsk.vercel.app',
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true, // If you're using cookies or authentication headers
// }));;
app.use((0, cors_1.default)());
app.get("/", (req, res) => {
    res.json({
        message: "this is for testing purpose ! "
    });
});
// for user registration in the db 
app.post("/api/v1/signup", async (req, res) => {
    try {
        // parsing the body accrding to schema 
        const body = userSchma_1.userSchema.parse(req.body); // it will throw the error if inputs are invalid
        const username = body.username;
        const password = body.password.toString();
        // hashing the password using bcrypt 
        const hashPassword = await bcrypt_1.default.hash(password, 10);
        // checking existing user 
        const existingUser = await db_1.userModel.findOne({ username });
        if (existingUser) {
            res.status(403).json({
                message: "User is already exist !"
            });
            return;
        }
        await db_1.userModel.create({
            username: username,
            password: hashPassword
        });
        res.json({
            message: "user is signup sucessfully !  "
        });
    }
    catch (e) {
        if (e instanceof zod_1.z.ZodError) {
            res.status(411).json({
                message: "Validation Error",
                error: e.message
            });
        }
        else {
            res.status(500).json({
                message: "Server Error",
                error: e
            });
        }
    }
});
// for user login
app.post("/api/v1/signin", async (req, res) => {
    try {
        const body = userSchma_1.userSchema.parse(req.body);
        const username = body.username;
        const password = body.password.toString();
        // checking if user exist or not 
        const existingUser = await db_1.userModel.findOne({ username });
        if (!existingUser) {
            res.status(404).json({
                message: " User Not Found !"
            });
            return;
        }
        //  checking the password 
        const storedPasswordHash = existingUser.password;
        if (!storedPasswordHash) {
            res.status(404).json({
                message: " User Not Found !",
            });
            return;
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, storedPasswordHash);
        if (isPasswordValid) {
            // generating token using jwt
            const token = jsonwebtoken_1.default.sign({
                id: existingUser._id
            }, jwtPass);
            // sending the token to user 
            res.json({
                token
            });
        }
        else {
            res.status(403).json({
                message: "Incorrect Creddetials"
            });
            return;
        }
    }
    catch (e) {
        if (e instanceof zod_1.z.ZodError) {
            res.json({
                message: "Validation Error ",
                error: e.message
            });
            return;
        }
        else {
            res.status(500).json({
                message: "Internal Error"
            });
        }
    }
});
//  storing the content in the db
app.post("/api/v1/content", middleware_1.userMiddleware, async (req, res) => {
    try {
        const body = userSchma_1.ContentSchemaZod.parse(req.body);
        await db_1.contentModel.create({
            "title": body.title,
            "link": body.link,
            "type": body.type,
            "tags": body.tags,
            "userId": body.userId
        });
        res.json({
            message: " Content uploaded successfully "
        });
    }
    catch (e) {
        if (e instanceof zod_1.z.ZodError) {
            res.status(411).json({
                message: "Invalid Format",
                error: e.message
            });
            return;
        }
        res.status(500).json({
            message: " Internal Error"
        });
    }
});
// for getting all content 
app.get("/api/v1/content", middleware_1.userMiddleware, async (req, res) => {
    const userId = req.body.userId;
    // getting the username from userid 
    const userInfo = await db_1.userModel.findOne({
        _id: userId
    });
    if (!userInfo) {
        res.status(404).json({
            message: " User Does Not Exist !"
        });
        return;
    }
    //  getting the content using user id 
    const content = await db_1.contentModel.find({
        userId: userId
    }).populate("userId", "username");
    if (content) {
        res.send({
            content,
            username: userInfo.username
        });
    }
    else {
        res.status(401).json({
            message: "invalid credentials"
        });
    }
});
// for deleting the contet
app.delete("/api/v1/content", middleware_1.userMiddleware, async (req, res) => {
    const { userId, contentId } = req.body;
    try {
        const response = await db_1.contentModel.deleteOne({ _id: contentId, userId });
        if (response.deletedCount === 1) {
            // Successfully deleted
            res.json({
                message: " Content deleted ! "
            });
        }
        else {
            res.status(404).json({
                message: "Content not found or already deleted."
            });
            return;
        }
    }
    catch (e) {
        res.status(500).json({
            message: " Internal Error"
        });
    }
});
// for storing the shara links in the db
app.post("/api/v1/brain/share", middleware_1.userMiddleware, async (req, res) => {
    try {
        const share = req.body.share;
        const userId = req.body.userId;
        // if the share is false then that means user want to delete the link
        if (!share) {
            await db_1.linkModel.deleteOne({
                userId
            });
            res.json({
                message: " Link Deleted Successfully "
            });
        }
        // checking if the link is already preseng in the link table  
        const existingLink = await db_1.linkModel.findOne({
            userId
        });
        if (existingLink) {
            res.json({
                hash: existingLink.hash
            });
        }
        //  creating a fresh link and inserting it into mongodb 
        const hash = (0, generateHash_1.generateHash)(10);
        await db_1.linkModel.create({
            hash: hash,
            userId: userId
        });
        res.json({
            hash: hash
        });
    }
    catch (e) {
        if (e instanceof zod_1.z.ZodError) {
            res.send({
                message: " Invalid Format",
                error: e.message,
            });
        }
    }
});
// for getting the shareLink from the db
app.get("/api/v1/brain/:shareLink", async (req, res) => {
    // getting hash from parameter 
    console.log("control reach here ");
    const hash = req.params.shareLink;
    try {
        // checking the hash in the link table 
        const existingLink = await db_1.linkModel.findOne({
            hash
        });
        if (existingLink) {
            // getting all content of the user 
            const userContents = await db_1.contentModel.find({
                userId: existingLink.userId
            });
            // getting the user information from the userdi
            const userInfo = await db_1.userModel.findOne({
                _id: existingLink.userId
            });
            if (userInfo) {
                res.send({
                    username: userInfo.username,
                    contents: userContents
                });
            }
        }
    }
    catch (e) {
        res.sendStatus(404).json({
            message: " Bad Request"
        });
    }
});
app.listen(PORT, () => {
    console.log("Server is listening on port ", PORT);
});
exports.default = app;
//# sourceMappingURL=index.js.map