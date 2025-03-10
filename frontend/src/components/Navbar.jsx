import React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import StartFree from "./StartFree";
import MobileDropdown from "./MobileDropdown";
const Navbar = () => {

  return (
    <nav className="items-center justify-items-center flex md:grid absolute w-full z-50">
      <div className="w-5/6 flex p-10 justify-between ">
        <Link to="/" className="text-2xl">
          todo.app
        </Link>
        <NavigationMenu>
          <NavigationMenuList className="hidden md:flex space-x-6 text-gray-300">
            <NavigationMenuItem>
              <Link to="/features" className="hover:text-white transition">
                Features
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/pricing" className="hover:text-white transition">
                Pricing
              </Link>
            </NavigationMenuItem>
            <NavigationMenu>
              <NavigationMenuItem className="">
                <NavigationMenuTrigger className="bg-transparent">
                  Resources
                </NavigationMenuTrigger>
                <NavigationMenuContent className="">
                  <ul className="min-w-30 p-1">
                    <li>
                      <a
                        href="https://tailwindcss.com/"
                        target="blank"
                        className="block px-2 py-1 rounded-md hover:bg-gray-100 transition"
                      >
                        Tailwind CSS
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://ui.shadcn.com/"
                        target="blank"
                        className="block px-2 py-1 rounded-md hover:bg-gray-100 transition"
                      >
                        ShadCn
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://react.dev/"
                        target="blank"
                        className="block px-2 py-1 rounded-md hover:bg-gray-100 transition"
                      >
                        React Docs
                      </a>
                    </li>
                    <li><a
              href="https://www.reactbits.dev/"
              target="_blank"
              className="block p-1 rounded-md hover:bg-gray-100 transition"
            >
              reactbits.dev
            </a></li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenu>
            <StartFree />
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <MobileDropdown />
    </nav>
  );
};

export default Navbar;
