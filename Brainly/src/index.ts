import express from 'express';
import dotenv from 'dotenv';
import { userModel, contentModel, linkModel } from './db';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { userMiddleware } from './middlewares/middleware';
import cors from 'cors';


// importing the user schema
import { userSchema, ContentSchemaZod } from './userSchma';
import { generateHash } from './generateHash';



// Load enviroment varaible 
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const jwtPass: string = process.env.JWT_PASS!;


// body parser or  middleware 
app.use(express.json());
//  cors
app.use(cors({
    origin: 'https://second-brain-8gsk.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // If you're using cookies or authentication headers
}));;


// for user registration in the db 
app.post("/api/v1/signup", async (req, res) => {


    try {
        // parsing the body accrding to schema 
        const body = userSchema.parse(req.body);  // it will throw the error if inputs are invalid
        const username = body.username;
        const password = body.password.toString();

        // hashing the password using bcrypt 
        const hashPassword = await bcrypt.hash(password, 10);

        // checking existing user 
        const existingUser = await userModel.findOne({ username })
        if (existingUser) {
            res.status(403).json({
                message: "User is already exist !"
            })
            return;
        }
        await userModel.create({
            username: username,
            password: hashPassword
        })

        res.json({
            message: "user is signup sucessfully !  "
        })
    } catch (e) {
        if (e instanceof z.ZodError) {
            res.status(411).json({
                message: "Validation Error",
                error: e.message
            })
        } else {


            res.status(500).json({
                message: "Server Error",
                error: e
            })
        }
    }


})

// for user login
app.post("/api/v1/signin", async (req, res) => {

    try {
        const body = userSchema.parse(req.body);
        const username = body.username;
        const password = body.password.toString();


        // checking if user exist or not 
        const existingUser = await userModel.findOne({ username });
        if (!existingUser) {
            res.status(404).json({
                message: " User Not Found !"
            })
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
        const isPasswordValid = await bcrypt.compare(password, storedPasswordHash);
        if (isPasswordValid) {
            // generating token using jwt
            const token = jwt.sign({
                id: existingUser._id
            }, jwtPass);

            // sending the token to user 
            res.json({
                token
            })
        }
        else {
            res.status(403).json({
                message: "Incorrect Creddetials"
            })
            return;
        }


    } catch (e) {
        if (e instanceof z.ZodError) {
            res.json({
                message: "Validation Error ",
                error: e.message
            })
            return;
        } else {
            res.status(500).json({
                message: "Internal Error"
            })
        }

    }






})


//  storing the content in the db
app.post("/api/v1/content", userMiddleware, async (req, res) => {

    try {

        const body = ContentSchemaZod.parse(req.body);
        await contentModel.create({
            "title": body.title,
            "link": body.link,
            "type": body.type,
            "tags": body.tags,
            "userId": body.userId
        })

        res.json({
            message: " Content uploaded successfully "
        })

    } catch (e) {
        if (e instanceof z.ZodError) {
            res.status(411).json({
                message: "Invalid Format",
                error: e.message
            })
            return;
        }

        res.status(500).json({
            message: " Internal Error"
        })

    }




})


// for getting all content 
app.get("/api/v1/content", userMiddleware, async (req, res) => {

    const userId = req.body.userId;

    // getting the username from userid 
    const userInfo = await userModel.findOne({
        _id: userId
    });


    if (!userInfo) {
        res.status(404).json({
            message: " User Does Not Exist !"
        })
        return;
    }

    //  getting the content using user id 
    const content = await contentModel.find({
        userId: userId
    }).populate("userId", "username");


    if (content) {
        res.send(
            {
                content,
                username: userInfo.username
            }
        );
    } else {
        res.status(401).json({
            message: "invalid credentials"
        })
    }

})

// for deleting the contet
app.delete("/api/v1/content", userMiddleware, async (req, res) => {
    const { userId, contentId } = req.body;
    try {

        const response = await contentModel.deleteOne({ _id: contentId, userId });
        if (response.deletedCount === 1) {
            // Successfully deleted
            res.json({
                message: " Content deleted ! "
            })
        } else {
            res.status(404).json({
                message: "Content not found or already deleted."
            });
            return;
        }

    } catch (e) {
        res.status(500).json({
            message: " Internal Error"
        })
    }

})

// for storing the shara links in the db
app.post("/api/v1/brain/share", userMiddleware, async (req, res) => {

    try {
        const share = req.body.share;
        const userId = req.body.userId;
        // if the share is false then that means user want to delete the link
        if (!share) {

            await linkModel.deleteOne({
                userId
            })
            res.json({
                message: " Link Deleted Successfully "
            })

        }

        // checking if the link is already preseng in the link table  
        const existingLink = await linkModel.findOne({
            userId
        })

        if (existingLink) {

            res.json({
                hash: existingLink.hash
            })
        }

        //  creating a fresh link and inserting it into mongodb 
        const hash = generateHash(10);
        await linkModel.create({
            hash: hash,
            userId: userId
        })

        res.json({
            hash: hash
        })


    } catch (e) {
        if (e instanceof z.ZodError) {
            res.send({
                message: " Invalid Format",
                error: e.message,
            })

        }

    }

})

// for getting the shareLink from the db
app.get("/api/v1/brain/:shareLink", async (req, res) => {

    // getting hash from parameter 
    console.log("control reach here ");
    const hash = req.params.shareLink;
    try {
        // checking the hash in the link table 
        const existingLink = await linkModel.findOne({
            hash
        })

        if (existingLink) {

            // getting all content of the user 
            const userContents = await contentModel.find({
                userId: existingLink.userId

            })

            // getting the user information from the userdi
            const userInfo = await userModel.findOne({
                _id: existingLink.userId
            })

            if (userInfo) {

                res.send({
                    username: userInfo.username,
                    contents: userContents
                })
            }


        }
    } catch (e) {
        res.sendStatus(404).json({
            message: " Bad Request"
        })
    }


})


app.listen(PORT, () => {
    console.log("Server is listening on port ", PORT);
});