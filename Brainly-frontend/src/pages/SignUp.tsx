import { FormEvent, useState } from "react";
import axios from "axios";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Brain } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isUserExist, setIsUserExist] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmitForm = async (e: FormEvent) => {
    e.preventDefault(); // prevent from reloading the page

    console.log("email : ", email, "password : ", password);
    // making api call to the backend

    // data for sending to the backend
    const Data = {
      username: email,
      password,
    };

    // backend request using axios
    try {
      await axios.post(
        `${import.meta.env.VITE_backendUrl}/api/v1/signup`,
        Data
      );
    } catch (e: any) {
      console.log(e.status);
      if (e.status === 403) {
        setIsUserExist(true);
        return;
      }
    }

    navigate("/signin");

    setEmail("");
    setPassword("");
  };
  return (
    <div className="flex justify-center items-center min-h-screen  font-satoshi   ">
      <Card className="w-[350px]">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="h-6 w-6 text-purple-600" />
            <CardTitle className="text-2xl">Sign up</CardTitle>
          </div>
          <CardDescription className=" text-left text-gray-700">
            Create an account to start organizing your second brain
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmitForm} method="post">
          <CardContent className="grid gap-4">
            <div className="grid gap-2 text-left   ">
              <label htmlFor="email">Email</label>
              <Input
                className={`${
                  isUserExist
                    ? "border-2 border-red-700"
                    : "focus-visible:border-none"
                } focus-visible:border-none`}
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2 text-left ">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {isUserExist && (
              <div>
                <p className=" text-sm text-neutral-500  ">
                  User Exist with this username !
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button
              className="w-full bg-purple-600 hover:bg-purple-700"
              type="submit"
            >
              Sign Up
            </Button>
            {/* {error && <p className="text-red-500 mt-2">{error}</p>} */}
            <p className="mt-2 text-sm text-center text-gray-600">
              Already have an account?{" "}
              <Link to="/signin" className="text-purple-600 hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SignUp;
