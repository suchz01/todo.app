import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { FaUser } from "react-icons/fa";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
const StartFree = () => {
  const { user,logout } = useUser();
  const navigate = useNavigate();
  if (user)
    return (
      <NavigationMenu>
        <NavigationMenuItem className="">
          <NavigationMenuTrigger className="bg-transparent">
            <FaUser />
          </NavigationMenuTrigger>
          <NavigationMenuContent className="">
            <ul className="min-w-30 p-1">
              <li>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="w-full px-2 py-1 rounded-md hover:bg-gray-100 transition text-left"
                >
                  Dashboard
                </button>
              </li>              
              <li>
                <button
                  onClick={() => navigate("/profile")}
                  className="w-full px-2 py-1 text-left rounded-md hover:bg-gray-100 transition"
                >
                  Profile
                </button>
              </li>              
              <li>
                <button
                  onClick={() => logout()}
                  className="w-full px-2 py-1 rounded-md hover:bg-red-600 hover:text-white transition text-left"
                >
                  Logout
                </button>
              </li>              
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenu>
    );
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
