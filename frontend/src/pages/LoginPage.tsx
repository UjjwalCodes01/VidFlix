import LoginLeft from "./components/LoginLeft";
import { Outlet } from "react-router-dom";

const LoginPage = () => {
  return (
    <div className=" flex h-screen w-full bg-yellow-50">
      <LoginLeft />
      <Outlet />
    </div>
  );
};

export default LoginPage;
