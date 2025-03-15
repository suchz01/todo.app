import axios from "axios";
import { toast } from "sonner";
import sound from "@/assets/delete.mp3";

const API_BASE_URL = import.meta.env.VITE_BACKEND;

export const createTodoOperations = (setTodos) => {
  return {
    handleAddTodo: async (todo) => {
      try {
        const newTodo = {
          title: todo.title,
          description: todo.description,
          dueDate: todo.dueDate ? todo.dueDate.toISOString() : null,
          dueTime: todo.dueTime,
          priority: todo.priority,
          completed: false,
        };
        const response = await axios.post(`${API_BASE_URL}/todos`, newTodo, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data) {
          setTodos((prevTodos) => [...prevTodos, response.data]);
          toast.success("Task added successfully!");
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error adding todo:", error);
        toast.error("Error adding task. Please try again.");
        return false;
      }
    },

    handleUpdateTodo: async (updatedTodo, todos) => {
      try {
        console.log("Updating todo:", updatedTodo);
        
        if (!updatedTodo._id) {
          console.error("Cannot update todo: Missing ID");
          toast.error("Error updating task: Missing ID");
          return false;
        }
        
        const originalTodo = todos.find(todo => todo._id === updatedTodo._id);
        
        const todoData = {
          title: updatedTodo.title,
          description: updatedTodo.description,
          dueDate: updatedTodo.dueDate
            ? updatedTodo.dueDate.toISOString()
            : null,
          dueTime: updatedTodo.dueTime,
          priority: updatedTodo.priority,
          completed: updatedTodo.completed !== undefined ? updatedTodo.completed : (originalTodo ? originalTodo.completed : false)
        };
        console.log("Todo data being sent:", todoData);

        const response = await axios.put(
          `${API_BASE_URL}/todos/${updatedTodo._id}`,
          todoData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        console.log("Response from server:", response.data);
        if (response.data) {
          setTodos((prevTodos) =>
            prevTodos.map((todo) =>
              todo._id === updatedTodo._id ? response.data : todo
            )
          );
          toast.success("Task updated successfully!");
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error updating todo:", error);
        toast.error("Error updating task. Please try again.");
        return false;
      }
    },

    handleDeleteTodo: async (id) => {
      try {
        await axios.delete(`${API_BASE_URL}/todos/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
        toast.success("Task deleted successfully!");
        new Audio(sound).play();
        return true;
      } catch (error) {
        console.error("Error deleting todo:", error);   
        toast.error("Error deleting task. Please try again.");
        return false;
      }
    },

    handleToggleComplete: async (id, todos) => {
      try {
        const todoToUpdate = todos.find((todo) => todo._id === id);
        const response = await axios.put(
          `${API_BASE_URL}/todos/${id}`,
          { completed: !todoToUpdate.completed },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setTodos((prevTodos) =>
          prevTodos.map((todo) => (todo._id === id ? response.data : todo))
        );
        toast.success(todoToUpdate.completed ? "Task marked as incomplete" : "Task completed!");
        new Audio(sound).play();
        return true;
      } catch (error) {
        console.error("Error toggling todo completion:", error);
        toast.error("Error updating task status. Please try again.");
        return false;
      }
    },
  };
}; 