import React from "react";
import { Routes, Route } from "react-router-dom"; // Import Routes and Route
import Homepage from "./pages/Homepage";
import Navbar from "./components/Navbar";
import { BrowserRouter } from "react-router-dom";
import Pricing from "./pages/Pricing";
import Features from "./pages/Features";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
const App = () => {
  
  return (
    <div className="bg-[#1f1f1f] w-full min-h-screen text-white flex flex-col ">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/features" element={<Features />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
