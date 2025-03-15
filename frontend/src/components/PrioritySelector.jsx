import React from "react";
import { Flag } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const priorityOptions = [
  { value: "low", label: "Low", color: "text-blue-400" },
  { value: "normal", label: "Normal", color: "text-green-400" },
  { value: "high", label: "High", color: "text-orange-400" },
  { value: "urgent", label: "Urgent", color: "text-red-400" },
];

const PrioritySelector = ({ value, onChange }) => {
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full bg-[#2a2a2a] border-[#444444]">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent className="bg-[#2a2a2a] border-[#444444]">
          {priorityOptions.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value} 
              className="text-white hover:bg-[#333333]"
            >
              <div className="flex items-center">
                <Flag className={cn("h-4 w-4 mr-2", option.color)} />
                {option.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default PrioritySelector; 