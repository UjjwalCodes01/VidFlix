import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import LoginRight from "./pages/components/LoginRight";
import SignInRight from "./pages/components/SignInRight";
import HomePage from "./pages/HomePage";
import { Toaster } from "react-hot-toast";
import AdminPage from "./pages/AdminPage";
import VideoPage from "./pages/VideoPage";

function App() {
  return (
    <>
      <Routes>
        <Route element={<LoginPage />}>
          <Route path="/" element={<LoginRight />} />
          <Route path="/signin" element={<SignInRight />} />
        </Route>
        <Route path="/home" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/video" element={<VideoPage />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
