import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const StartFree = () => {
  const navigate = useNavigate();

  return (
    <Button 
      onClick={() => navigate("/login")}
      className="cursor-pointer bg-gradient-to-r from-sky-300 to-sky-500 hover:from-blue-300 hover:to-blue-500 transition-colors duration-500 ease-in-out px-5 rounded-full hover:scale-105"
    >
      Start Free
    </Button>
  );
};

export default StartFree;
