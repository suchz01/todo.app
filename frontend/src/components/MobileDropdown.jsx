import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuSub,
} from "@/components/ui/dropdown-menu";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { Github } from 'lucide-react';
const MobileDropdown = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="md:hidden">
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="space-y-2 min-w-48">
      <DropdownMenuItem>
              <a
                href="https://github.com/suchz01/todo.app"
                target="blank"
                className="hover:text-white transition"
              >
                <div className="flex items-center">
                  <Github className=""/>Github</div>
              </a>
            </DropdownMenuItem>
        <DropdownMenuItem>
          <button onClick={() => navigate("/features")} className="w-full text-left">
            Features
          </button>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <button onClick={() => navigate("/pricing")} className="w-full text-left">
            Pricing
          </button>
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Resources</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>
              <a
                href="https://tailwindcss.com/"
                target="_blank"
                className="block p-1"
              >
                Tailwind CSS
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <a
                href="https://ui.shadcn.com/"
                target="_blank"
                className="block p-1"
              >
                ShadCn
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <a
                href="https://react.dev/"
                target="_blank"
                className="block p-1"
              >
                React Docs
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <a
                href="https://www.reactbits.dev/"
                target="_blank"
                className="block p-1"
              >
                reactbits.dev
              </a>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        {user && (
          <>
            <DropdownMenuItem>
              <button onClick={() => navigate("/dashboard")} className="w-full text-left">
                Dashboard
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button onClick={() => navigate("/profile")} className="w-full text-left">
                Profile
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem className="bg-red-500 text-white ">
              <button onClick={() =>logout()} className="w-full text-left">
                Logout
              </button>
            </DropdownMenuItem>
          </>
        )}
        {!user && (
          <>
            <DropdownMenuItem className="bg-green-500 text-white ">
              <button onClick={() => navigate("/login")} className="w-full text-left">
                Login
              </button>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MobileDropdown;
