import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const SignInRight = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    localStorage.clear();
  }, []);

  const handleSubmit = async () => {
    if (password !== confirmpassword) {
      toast.error("Password and Confirm Password are not same");
      return navigate("/signin");
    }
    try {
      const result = await fetch("http://localhost:5000/api/users/signin", {
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
        toast.success("Account created!");
        setPassword("");
        setConfirmPassword("");
        setEmail("");
        return navigate("/home");
      } else {
        toast.error(`Error ${result.status}`);
        return navigate("/signin");
      }
    } catch (error) {
      console.log("error in signin");
    }
  };

  return (
    <div className="h-screen w-[50vw] flex justify-center text-amber-100 bg-gray-900">
      <Card className=" bg-gray-900 text-white border-none mt-6 ">
        <CardHeader className="flex items-center flex-col ">
          <CardTitle className=" text-5xl text-white "> SIGN IN </CardTitle>
          <Button className="bg-blue-500 text-white text-2xl w-[30vw] mt-3 hover:bg-blue-800 ">
            {" "}
            SignIn with Google
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
          <h1 className="text-2xl flex-row justify-end ">Confirm Password :</h1>
          <Input
            type="password"
            value={confirmpassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-2"
          />
          <div className="flex justify-center">
            <Button
              onClick={handleSubmit}
              className="bg-blue-500 flex justify-center items-center text-3xl hover:bg-blue-800 text-white w-[30vw] h-[8vh] mt-[4vh]"
            >
              Sign Up
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center items-center">
          <h1 className="flex justify-center">
            Already have an account{" "}
            <button
              onClick={() => navigate("/")}
              className="text-blue-400 flex hover:cursor-pointer ml-2"
            >
              Login
            </button>
          </h1>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignInRight;
