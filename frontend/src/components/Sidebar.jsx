import React,{useEffect, useState} from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useUser } from '../context/UserContext';
import {
  CheckCircle,
  Circle,
  CalendarDays,
  Clock,
  Flag,
  X,
  LogOut
} from "lucide-react";
import { isToday, isBefore, startOfDay } from "date-fns";
import { useNavigate } from "react-router-dom";

const priorityOptions = [
  {
    value: "priority-low",
    label: "Low",
    icon: <Flag className="mr-2 h-4 w-4 text-blue-400" />,
  },
  {
    value: "priority-normal",
    label: "Normal",
    icon: <Flag className="mr-2 h-4 w-4 text-green-400" />,
  },
  {
    value: "priority-high",
    label: "High",
    icon: <Flag className="mr-2 h-4 w-4 text-orange-400" />,
  },
  {
    value: "priority-urgent",
    label: "Urgent",
    icon: <Flag className="mr-2 h-4 w-4 text-red-400" />,
  },
];

const getFilterCount = (todos, filter) => {
  if (!Array.isArray(todos)) return 0;

  switch (filter) {
    case "today":
      return todos.filter((t) => {
        if (!t.completed && t.dueDate) {
          const dueDate = new Date(t.dueDate);
          if (isToday(dueDate)) {
            if (t.dueTime) {
              const [hours, minutes] = t.dueTime.split(":");
              const dueDateTime = new Date(
                dueDate.setHours(parseInt(hours), parseInt(minutes))
              );
              return dueDateTime >= new Date();
            }
            return true;
          }
        }
        return false;
      }).length;
    case "upcoming":
      return todos.filter(
        (t) =>
          !t.completed &&
          t.dueDate &&
          !isToday(new Date(t.dueDate)) &&
          !isBefore(new Date(t.dueDate), startOfDay(new Date()))
      ).length;
    case "overdue":
      return todos.filter((t) => {
        if (!t.completed && t.dueDate) {
          const dueDate = new Date(t.dueDate);
          if (t.dueTime) {
            const [hours, minutes] = t.dueTime.split(":");
            const dueDateTime = new Date(
              dueDate.setHours(parseInt(hours), parseInt(minutes))
            );
            return dueDateTime < new Date();
          }
          return isBefore(dueDate, startOfDay(new Date()));
        }
        return false;
      }).length;
    case "no-date":
      return todos.filter((t) => !t.completed && !t.dueDate).length;
    case "completed":
      return todos.filter((t) => t.completed).length;
    default:
      if (filter.startsWith("priority-")) {
        return todos.filter(
          (t) => !t.completed && t.priority === filter.replace("priority-", "")
        ).length;
      }
      return 0;
  }
};

const mainFilters = [
  {
    id: "today",
    label: "Today",
    icon: <Circle className="mr-2 h-4 w-4" />,
  },
  {
    id: "upcoming",
    label: "Upcoming",
    icon: <CalendarDays className="mr-2 h-4 w-4" />,
  },
  {
    id: "overdue",
    label: "Overdue",
    icon: <Clock className="mr-2 h-4 w-4 text-red-400" />,
  },
  {
    id: "no-date",
    label: "No Date",
    icon: <Clock className="mr-2 h-4 w-4 opacity-50" />,
  },
];

const Sidebar = ({
  activeFilter,
  setActiveFilter,
  todos,
  sidebarOpen,
  setSidebarOpen,
}) => {
  const navigate = useNavigate();
  
    const { logout } = useUser();
  const [user, setUser] = useState("");
  const fetchUserPic = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND}/auth/profile`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // console.log(response);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching profile picture:", error);
    }
  }
  useEffect(() => {
    fetchUserPic();
  }, []);
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const renderFilterButton = (filter) => (
    <Button
      key={filter.id || filter.value}
      variant={
        activeFilter === (filter.id || filter.value) ? "default" : "ghost"
      }
      className={`w-full justify-start text-base font-medium ${
        activeFilter === (filter.id || filter.value)
          ? "bg-sky-600 hover:bg-sky-700 text-white cursor-pointer"
          : "text-gray-300 hover:bg-[#333333] hover:text-white cursor-pointer"
      }`}
      onClick={() => handleFilterChange(filter.id || filter.value)}
    >
      {filter.icon}
      {filter.label}
      <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-[#333333] text-gray-300">
        {getFilterCount(todos, filter.id || filter.value)}
      </span>
    </Button>
  );

  return (
    <>
      <div
        className={`
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          transition-transform duration-300 ease-in-out
          fixed md:relative z-20 md:z-0 
          w-72 md:w-56
          bg-[#1f1f1f] border-r border-[#333333]
          md:translate-x-0
          left-0 top-0 
        `}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center p-4 border-b border-[#333333] md:hidden">
            <h2 className="text-lg font-bold text-sky-500">Tasks</h2>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <h2 className="text-xl font-bold mb-4 text-sky-500 hidden md:block">
                Tasks
              </h2>

              <div className="space-y-1.5">
                {mainFilters.map(renderFilterButton)}

                <div className="mt-6 mb-2">
                  <h3 className="text-sm font-semibold text-gray-400 mb-2 px-2 uppercase tracking-wider">
                    By Priority
                  </h3>
                  {priorityOptions.map(renderFilterButton)}
                </div>

                {renderFilterButton({
                  id: "completed",
                  label: "Completed",
                  icon: <CheckCircle className="mr-2 h-4 w-4" />,
                })}
              </div>
            </div>
            <div className=" p-4 border-t border-[#333333]">
            <div className="flex items-center gap-3 cursor-pointer" 
                onClick={()=>navigate("/profile")}>
              <img 
                src={user.profilePicture} 
                alt="Profile" 
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{user.name}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => logout()}
                className="text-gray-400 hover:text-white hover:bg-red-600 cursor-pointer"
              >
                <LogOut />
              </Button>
            </div>
          </div>
          </div>
        </div>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;