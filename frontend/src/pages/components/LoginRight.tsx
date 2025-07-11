import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const LoginRight = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    localStorage.clear();
  }, []);

  const handleSubmit = async () => {
    try {
      const result = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      console.log("Status:", result.status);
      const data = await result.json();
      console.log("Response data:", data);
      localStorage.setItem("token", data.token);
      localStorage.setItem("admin", data.admin);
      if (result.ok) {
        toast.success("Login Successfully!");
        return navigate("/home");
      } else {
        toast.error(`Error ${result.status}`);
        return navigate("/");
      }
    } catch (error) {
      console.log("error in login");
    }
  };
  const handlePassword = async () => {
    const pass = await fetch("http://localhost:5000/api/users/forgot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    if (pass.ok) {
      toast.success("New Password Send Successfuly");
    } else {
      toast.error("Failed to send new password");
    }
  };
  return (
    <div className="h-screen w-[50vw] flex justify-center text-amber-100 bg-gray-900">
      <Card className=" bg-gray-900 text-white border-none ">
        <CardHeader className="flex items-center flex-col ">
          <CardTitle className=" text-5xl text-white "> LOGIN </CardTitle>
          <Button className="bg-blue-500 text-white text-2xl w-[30vw] mt-2 hover:bg-blue-800 ">
            {" "}
            Login with Google
          </Button>
        </CardHeader>
        <CardContent>
          <h1 className="text-2xl flex-row justify-end ">E-Mail :</h1>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2"
          />
          <h1 className="text-2xl flex-row justify-end ">Password :</h1>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2"
          />
          <div className="flex justify-center">
            <Button
              onClick={handleSubmit}
              className="bg-blue-500 flex justify-center items-center text-3xl hover:bg-blue-800 text-white w-[30vw] h-[8vh] mt-[4vh]"
            >
              Login
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center items-center">
          <Dialog>
            <DialogTrigger className=" text-blue-400  hover:cursor-pointer">
              Forgot Password
            </DialogTrigger>
            <DialogContent className="bg-black flex justify-center items-center">
              <DialogHeader className="flex justify-center items-center">
                <DialogTitle className="text-white text-[20px] mb-4">
                  Please enter your email and OTP
                </DialogTitle>
                <DialogDescription>
                  <form>
                    <label className=" text-2xl mt-3 text-white ">
                      Email :{" "}
                    </label>
                    <Input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      className=" h-8 mt-3 w-[22vw]"
                    />
                    <Button
                      onClick={handlePassword}
                      className="bg-white mt-3 text-black hover:bg-amber-50 cursor-pointer"
                    >
                      Generate OTP
                    </Button>
                  </form>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </CardFooter>

        <h1 className="flex justify-center">
          Don't have an account{" "}
          <button
            onClick={() => navigate("/signin")}
            className="text-blue-400 flex hover:cursor-pointer ml-2"
          >
            {" "}
            Sign-up
          </button>
        </h1>
      </Card>
    </div>
  );
};

export default LoginRight;
