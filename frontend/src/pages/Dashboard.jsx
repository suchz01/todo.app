import React, { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {PlusIcon,Menu,X,CalendarIcon,CheckIcon,ListIcon,AlertTriangleIcon,Flag} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import TodoList from "@/components/TodoList";
import TodoFormContainer from "@/components/TodoFormContainer";
import {getFilteredTodos,getGroupedUpcomingTodos,} from "@/utils/todoFilterUtils";
import { createTodoOperations } from "@/utils/todoOperations";

const API_BASE_URL = import.meta.env.VITE_BACKEND;

const Dashboard = () => {
  const { user, loading } = useUser();
  const [todos, setTodos] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [activeFilter, setActiveFilter] = useState("today");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const sectionIcons = {
    today: <CalendarIcon className="h-6 w-6 mr-2 text-sky-500" />,
    upcoming: <ListIcon className="h-6 w-6 mr-2 text-sky-500" />,
    overdue: <AlertTriangleIcon className="h-6 w-6 mr-2 text-red-500" />,
    completed: <CheckIcon className="h-6 w-6 mr-2 text-green-500" />,
    "no-date": <CalendarIcon className="h-6 w-6 mr-2 text-gray-500" />,
    "priority-low": <Flag className="h-6 w-6 mr-2 text-blue-500" />,
    "priority-normal": <Flag className="h-6 w-6 mr-2 text-green-500" />,
    "priority-high": <Flag className="h-6 w-6 mr-2 text-orange-500" />,
    "priority-urgent": <Flag className="h-6 w-6 mr-2 text-red-500" />,
  };
  const sectionTitles = {
    today: "Today's Tasks",
    upcoming: "Upcoming Tasks",
    overdue: "Overdue Tasks",
    completed: "Completed Tasks",
    "no-date": "Tasks Without Date",
  };
  const getSectionIcon = () => sectionIcons[activeFilter] || <></>;
  const getSectionTitle = () => {
    if (sectionTitles[activeFilter]) return sectionTitles[activeFilter];
    const priority = activeFilter.replace("priority-", "");
    return `${
      priority.charAt(0).toUpperCase() + priority.slice(1)
    } Priority Tasks`;
  };
  useEffect(() => {
    setShowAddForm(false);
    setEditingTodo(null);
  }, [activeFilter]);

  useEffect(() => {
    if (user?.userId) {
      fetchTodos();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/todos`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setTodos(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching todos:", error);
      setTodos([]);
      setIsLoading(false);
    }
  };

  const todoOperations = createTodoOperations(setTodos);

  const handleAddTaskClick = () => {
    setShowAddForm(true);
    setEditingTodo(null);
  };

  const filteredTodos = React.useMemo(() => {
    try {
      return getFilteredTodos(todos, activeFilter);
    } catch (error) {
      console.error("Error filtering todos:", error);
      return [];
    }
  }, [todos, activeFilter]);

  const groupedUpcomingTodos = React.useMemo(() => {
    try {
      return getGroupedUpcomingTodos(todos, activeFilter);
    } catch (error) {
      console.error("Error grouping upcoming todos:", error);
      return null;
    }
  }, [todos, activeFilter]);

  if (loading || isLoading) {
    return (
      <div className="pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 pt-5 md:p-10 md:pt-5 flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          todos={todos}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <div className="flex-1 overflow-auto p-2 md:p-3 transition-all duration-300 w-full">
          <div className="w-full md:w-5/6 mx-auto">
            <div className="bg-[#1f1f1f] rounded-lg p-3 md:p-4 border border-[#333333] shadow-lg h-full">
              <div className="flex items-center justify-between mb-4 mt-8 md:mt-0">
                <div className="md:hidden mr-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="bg-[#2a2a2a] border-[#444444] hover:bg-[#333333] hover:border-sky-700"
                  >
                    {sidebarOpen ? (
                      <X className="h-5 w-5" />
                    ) : (
                      <Menu className="h-5 w-5" />
                    )}
                  </Button>
                </div>

                <div className="flex items-center">
                  {getSectionIcon()}
                  <h1 className="text-3xl font-bold text-sky-500">
                    {getSectionTitle()}
                  </h1>
                </div>
                {activeFilter !== "completed" && (
                  <Button
                    onClick={() => handleAddTaskClick()}
                    className="bg-sky-600 hover:bg-sky-700 add-task-button"
                    size="sm"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Add Task
                  </Button>
                )}
              </div>
              <TodoFormContainer
                showAddForm={showAddForm}
                editingTodo={editingTodo}
                handleUpdateTodo={(todo) => todoOperations.handleUpdateTodo(todo, todos)}
                handleAddTodo={todoOperations.handleAddTodo}
                setShowAddForm={setShowAddForm}
                setEditingTodo={setEditingTodo}
              />
              <TodoList
                activeFilter={activeFilter}
                filteredTodos={filteredTodos}
                groupedUpcomingTodos={groupedUpcomingTodos}
                handleToggleComplete={(id) => todoOperations.handleToggleComplete(id, todos)}
                handleDeleteTodo={todoOperations.handleDeleteTodo}
                setEditingTodo={setEditingTodo}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
