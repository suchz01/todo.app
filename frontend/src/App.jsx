import React from "react";
import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Navbar from "./components/Navbar";
import { BrowserRouter } from "react-router-dom";
import Pricing from "./pages/Pricing";
import Features from "./pages/Features";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { UserProvider } from "./context/UserContext";
import Profile from "./pages/Profile";
import { Toaster } from "./components/ui/sonner";

const App = () => {
  return (
    <UserProvider>
      <div className="bg-[#1f1f1f] w-full min-h-screen text-white flex flex-col ">
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/features" element={<Features />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </div>
    </UserProvider>
  );
};

export default App;
