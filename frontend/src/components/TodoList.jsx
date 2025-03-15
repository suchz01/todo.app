import React from "react";
import TodoItem from "./TodoItem";

const messages = {
  today: "No tasks for today",
  upcoming: "No upcoming tasks",
  overdue: "No overdue tasks",
  completed: "No completed tasks",
  "no-date": "No tasks without date",
};

const TodoList = ({
  activeFilter,
  filteredTodos,
  groupedUpcomingTodos,
  handleToggleComplete,
  handleDeleteTodo,
  setEditingTodo,
}) => {
  const showTodos = (todos, emptyMessage = "No tasks found") => {
    if (!todos?.length) {
      return (
        <div className="text-center py-8 text-gray-400">
          <p className="text-lg">{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className="space-y-1">
        {todos.map((todo) => (
          <TodoItem
            key={todo._id}
            todo={todo}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDeleteTodo}
            onEdit={setEditingTodo}
          />  
        ))}
      </div>
    );
  };

  const getContent = () => {
    if (activeFilter.startsWith("priority-")) {
      const priority = activeFilter.replace("priority-", "");
      return showTodos(filteredTodos, `No ${priority} priority tasks`);
    }

    if (activeFilter === "upcoming" && groupedUpcomingTodos?.length) {
      return (
        <div className="space-y-4">
          {groupedUpcomingTodos.map((group) => (
            <div key={group.dateKey} className="space-y-1">
              <h3 className="text-md font-medium text-sky-400 mb-1 border-b border-[#444444] pb-1">
                {group.label}
              </h3>
              {showTodos(group.todos)}
            </div>
          ))}
        </div>
      );
    }
    return showTodos(filteredTodos, messages[activeFilter] || "No tasks found");
  };

  return <div className="py-4">{getContent()}</div>;
};

export default TodoList;
