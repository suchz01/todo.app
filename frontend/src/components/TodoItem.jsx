import React from 'react';
import { format, parse } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Calendar, Flag, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const colors = {
  low: { main: "text-blue-400", bg: "bg-blue-400/10" },
  normal: { main: "text-green-400", bg: "bg-green-400/10" },
  high: { main: "text-orange-400", bg: "bg-orange-400/10" },
  urgent: { main: "text-red-400", bg: "bg-red-400/10" }
};

const TodoItem = ({ todo, onToggleComplete, onDelete, onEdit }) => {
  const showDate = (date) => format(new Date(date), "MMM d, yyyy");
  const showTime = (time) => format(parse(time, 'HH:mm', new Date()), 'h:mm a');

  return (
    <div className={cn(
      "flex gap-3 p-3 rounded-lg border border-transparent",
      "hover:bg-[#333333] hover:border-[#444444] group",
      todo.completed && "opacity-60"
    )}>
      <Checkbox 
        checked={todo.completed}
        onCheckedChange={() => onToggleComplete(todo._id)}
        className="mt-1 border-gray-600 data-[state=checked]:bg-sky-600 data-[state=checked]:border-sky-600"
      />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between gap-2">
          <h3 className={cn(
            "font-medium text-sm sm:text-base line-clamp-2 text-white",
            todo.completed && "line-through text-gray-400"
          )}>
            {todo.title}
          </h3>          
          <div className="opacity-0 group-hover:opacity-100 flex gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 hover:bg-sky-900/20 hover:text-sky-400"
              onClick={() => {
                onEdit(todo);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 hover:text-red-400 hover:bg-red-400/10"
              onClick={() => onDelete(todo._id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {todo.description && (
          <p className="text-sm text-gray-300 mt-1 line-clamp-100">
            {todo.description}
          </p>
        )}
        
        <div className="flex flex-wrap gap-2 mt-2">
          {todo.dueDate && (
            <div className="flex items-center gap-1 text-xs bg-[#333333] text-gray-300 px-2 py-1 rounded-full">
              <Calendar className="h-3 w-3" />
              <span>{showDate(todo.dueDate)}</span>
            </div>
          )}
          
          {todo.dueTime && (
            <div className="flex items-center gap-1 text-xs bg-[#333333] text-gray-300 px-2 py-1 rounded-full">
              <Clock className="h-3 w-3" />
              <span>{showTime(todo.dueTime)}</span>
            </div>
          )}
          
          {todo.priority && (
            <div className={cn(
              "flex items-center gap-1 text-xs px-2 py-1 rounded-full", 
              colors[todo.priority].main,
              colors[todo.priority].bg
            )}>
              <Flag className="h-3 w-3" />
              <span className="capitalize">{todo.priority}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoItem; 