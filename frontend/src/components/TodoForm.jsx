import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, isValid, isBefore, startOfDay, isToday } from "date-fns";
import { CalendarIcon, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import * as chrono from "chrono-node";
import TimePicker from "./TimePicker";
import PrioritySelector from "./PrioritySelector";
import { validateAndAdjustDateTime } from '@/utils/todoFilterUtils';

const TodoForm = ({ onSubmit, initialData = null, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: null,
    dueTime: null,
    priority: "normal",
    completed: false,
  });
  
  const [dateError, setDateError] = useState("");
  const [timeError, setTimeError] = useState("");
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  useEffect(() => {
    if (initialData) {
      console.log("Initializing form with data:", initialData);
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        dueDate: initialData.dueDate ? new Date(initialData.dueDate) : null,
        dueTime: initialData.dueTime || null,
        priority: initialData.priority || "normal",
        completed: initialData.completed !== undefined ? initialData.completed : false,
      });
    }
  }, [initialData]);

  const parseNaturalLanguageDate = (text) => {
    if (!text) return null;
    
    try {
      const referenceDate = new Date();
      const parsedResults = chrono.parse(text, { referenceDate });
      
      if (parsedResults && parsedResults.length > 0) {
        const parsedDate = parsedResults[0].start.date();
        
        if (parsedDate && isValid(parsedDate)) {
          const currentDate = new Date();
          if (isBefore(parsedDate, currentDate)) {
            const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
            const containsOnlyMonth = monthNames.some(month => 
              text.toLowerCase().includes(month) && !text.match(/\d{4}/)
            );
            
            if (containsOnlyMonth) {
              parsedDate.setFullYear(currentDate.getFullYear() + 1);
            }
          }
          
          setDateError("");
          return parsedDate;
        }
      }
    } catch (error) {
      console.error("Error parsing date:", error);
    }
    
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (name === "title") {
      setTitleError("");
    }
    
    if (name === "description") {
      const charCount = value.length;
      if (charCount > 100) {
        setDescriptionError(`Description cannot exceed 100 characters (current: ${charCount})`);
      } else {
        setDescriptionError("");
      }
    }
    
    if (name === "title" || name === "description") {
      const parsedDate = parseNaturalLanguageDate(value);
      
      if (parsedDate && validateDateTime(parsedDate, format(parsedDate, 'HH:mm'))) {
        setFormData((prev) => ({ 
          ...prev, 
          [name]: value,
          dueDate: parsedDate,
          dueTime: format(parsedDate, 'HH:mm')
        }));
      }
    }
  };

  const validateDateTime = (date, time) => {
    if (!date) return true;

    const now = new Date();
    const selectedDate = new Date(date);

    if (isToday(selectedDate) && time) {
      const [hours, minutes] = time.split(':');
      const selectedDateTime = new Date(selectedDate.setHours(parseInt(hours), parseInt(minutes)));
      
      if (selectedDateTime < now) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(parseInt(hours), parseInt(minutes));
        
        setFormData(prev => ({
          ...prev,
          dueDate: tomorrow
        }));
        return true;
      }
    }
    else if (isBefore(selectedDate, startOfDay(now))) {
      setDateError("Cannot set a due date in the past");
      return false;
    }

    setDateError("");
    setTimeError("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setTitleError("Task name is required");
      return;
    }
    
    const charCount = formData.description.length;
    if (charCount > 100) {
      setDescriptionError(`Description cannot exceed 100 characters (current: ${charCount})`);
      return;
    }
    let submissionData = {
      ...formData,
      _id: initialData?._id,
      completed: initialData && initialData.completed !== undefined ? initialData.completed : formData.completed || false
    };
    console.log("Submitting form data:", submissionData);

    if (formData.dueDate && formData.dueTime) {
      const { isAdjusted } = validateAndAdjustDateTime(
        formData.dueDate,
        formData.dueTime
      );

      if (isAdjusted) {
        setDateError("Please select a future date and time for your task");
        return;
      }
    }
    onSubmit(submissionData);
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Task Name
        </label>
        <Input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Task name (e.g., Meeting tomorrow at 3pm)"
          className={cn(
            "bg-[#2a2a2a] border-[#444444] focus:border-sky-600 focus:ring-sky-600/20 text-white",
            titleError && "border-red-400"
          )}
        />
        {titleError && (
          <div className="flex items-center gap-1 mt-1 text-red-400 text-sm">
            <AlertCircle className="h-3 w-3" />
            <span>{titleError}</span>
          </div>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Description (optional)
        </label>
        <Textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description (optional)"
          className="bg-[#2a2a2a] border-[#444444] min-h-[80px] focus:border-sky-600 focus:ring-sky-600/20 text-white"
        />
        {descriptionError && (
          <div className="flex items-center gap-1 mt-1 text-red-400 text-sm">
            <AlertCircle className="h-3 w-3" />
            <span>{descriptionError}</span>
          </div>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="w-full sm:w-1/2">
          <label className="block text-sm font-medium text-gray-300 mb-1">Due Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-[#2a2a2a] border-[#444444] hover:bg-[#333333] hover:text-white",
                  !formData.dueDate && "text-gray-400"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.dueDate ? format(formData.dueDate, "PPP") : "Select date (optional)"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-[#2a2a2a] border-[#444444]" align="start">
              <Calendar
                mode="single"
                selected={formData.dueDate}
                onSelect={(date) => {
                    setFormData((prev) => ({ ...prev, dueDate: date }));
                }}
                disabled={(date) => isBefore(date, startOfDay(new Date()))}
                className="bg-[#2a2a2a] text-white "
              />
              {formData.dueDate && (
                <div className="p-2 border-t border-[#444444] bg-[#2a2a2a]">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, dueDate: null }));
                      setDateError("");
                    }}
                    className="w-full text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  >
                    Clear date
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="w-full sm:w-1/2">
          <label className="block text-sm font-medium text-gray-300 mb-1">Due Time</label>
          <TimePicker
            value={formData.dueTime}
            onChange={(time) => {
              setFormData(prev => ({ ...prev, dueTime: time }));
              if (formData.dueDate && time) {
                const { isAdjusted } = validateAndAdjustDateTime(formData.dueDate, time);
                if (!isAdjusted) {
                  setDateError("");
                }
              }
            }}
            onClear={() => {
              setFormData(prev => ({ ...prev, dueTime: null }));
              setDateError("");
            }}
            onDateChange={(date) => setFormData(prev => ({ ...prev, dueDate: date }))}
          />
        </div>
      </div>
      
      {dateError && (
        <div className="flex items-center gap-1 text-red-400 text-sm">
          <AlertCircle className="h-3 w-3" />
          <span>{dateError}</span>
        </div>
      )}
      
      {timeError && (
        <div className="flex items-center gap-1 text-red-400 text-sm">
          <AlertCircle className="h-3 w-3" />
          <span>{timeError}</span>
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Priority</label>
        <PrioritySelector
          value={formData.priority}
          onChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
        />
      </div>
      
      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button 
            type="button" 
            variant="ghost" 
            onClick={onCancel}
            className="hover:bg-[#333333] text-white hover:text-white"
          >
            Cancel
          </Button>
        )}
        <Button 
          onClick={handleSubmit}
          className="bg-sky-600 hover:bg-sky-700 text-white"
          disabled={!!dateError || !!timeError}
        >
          {initialData ? "Update Task" : "Add Task"}
        </Button>
      </div>
    </form>
  );
};

export default TodoForm; 