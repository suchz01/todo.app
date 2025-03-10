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
  import { Link } from "react-router-dom";
  import { Menu, X } from "lucide-react";
  import StartFree from "./StartFree";

const MobileDropdown = () => {
      const [isOpen, setIsOpen] = useState(false);
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
    <DropdownMenuTrigger className="md:hidden">
      {isOpen ? <X size={28} /> : <Menu size={28} />}
    </DropdownMenuTrigger>
    <DropdownMenuContent className="space-y-2 min-w-48">
      <DropdownMenuItem>
        <Link to="/features" className="hover:text-white transition">
          Features
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Link to="/pricing" className="hover:text-white transition">
          Pricing
        </Link>
      </DropdownMenuItem>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>Resources</DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          <DropdownMenuItem>
            <a
              href="https://tailwindcss.com/"
              target="_blank"
              className="block p-1 rounded-md hover:bg-gray-100 transition"
            >
              Tailwind CSS
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <a
              href="https://ui.shadcn.com/"
              target="_blank"
              className="block p-1 rounded-md hover:bg-gray-100 transition"
            >
              ShadCn
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <a
              href="https://react.dev/"
              target="_blank"
              className="block p-1 rounded-md hover:bg-gray-100 transition"
            >
              React Docs
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <a
              href="https://www.reactbits.dev/"
              target="_blank"
              className="block p-1 rounded-md hover:bg-gray-100 transition"
            >
              reactbits.dev
            </a>
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuSub>
      <div className="flex justify-center">
        <StartFree />
      </div>
    </DropdownMenuContent>
  </DropdownMenu>
  )
}

export default MobileDropdown