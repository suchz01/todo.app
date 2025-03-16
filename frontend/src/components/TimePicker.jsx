import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, parse, isValid, addHours } from "date-fns";
import { cn } from "@/lib/utils";

const quickTimeOptions = [
  { label: "Morning", value: "09:00" },
  { label: "Noon", value: "12:00" },
  { label: "Afternoon", value: "15:00" },
  { label: "Evening", value: "18:00" },
  { label: "Night", value: "21:00" }
];

const relativeTimeOptions = [
  { label: "in 1hr", hours: 1 },
  { label: "in 6hrs", hours: 6 },
  { label: "in 12hrs", hours: 12 },
  { label: "in 24hrs", hours: 24 }
];

const TimePicker = ({ value, onChange, onClear, onDateChange }) => {
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [period, setPeriod] = useState("AM");

  useEffect(() => {
    if (value) {
      try {
        const date = parse(value, 'HH:mm', new Date());
        if (isValid(date)) {
          setHours(String(parseInt(format(date, 'h'), 10)));
          setMinutes(String(parseInt(format(date, 'mm'), 10)));
          setPeriod(format(date, 'a'));
        }
      } catch (error) {
        console.error("Error parsing time:", error);
      }
    }
  }, [value]);

  const handleHoursChange = (e) => {
    const val = e.target.value;
    if (val === "" || (/^\d{1,2}$/.test(val) && parseInt(val, 10) >= 1 && parseInt(val, 10) <= 12)) {
      setHours(val);
      if (val && minutes) {
        let hour = parseInt(val, 10);
        if (period === "PM" && hour < 12) hour += 12;
        else if (period === "AM" && hour === 12) hour = 0;
        onChange(`${hour}:${minutes}`);
      }
    }
  };

  const handleMinutesChange = (e) => {
    const val = e.target.value;
    if (val === "" || (/^\d{1,2}$/.test(val) && parseInt(val, 10) >= 0 && parseInt(val, 10) <= 59)) {
      setMinutes(val);
      if (hours && val) {
        let hour = parseInt(hours, 10);
        if (period === "PM" && hour < 12) hour += 12;
        else if (period === "AM" && hour === 12) hour = 0;
        onChange(`${hour}:${val}`);
      }
    }
  };

  const togglePeriod = () => {
    const newPeriod = period === "AM" ? "PM" : "AM";
    setPeriod(newPeriod);
    if (hours && minutes) {
      let hour = parseInt(hours, 10);
      if (newPeriod === "PM" && hour < 12) hour += 12;
      else if (newPeriod === "AM" && hour === 12) hour = 0;
      else if (newPeriod === "AM" && hour > 12) hour -= 12;
      onChange(`${hour}:${minutes}`);
    }
  };

  const handleRelativeTimeClick = (hoursToAdd) => {
    const futureTime = addHours(new Date(), hoursToAdd);
    const hour = parseInt(format(futureTime, 'H'));
    const minute = parseInt(format(futureTime, 'm'));
    const newPeriod = format(futureTime, 'a');
    
    const hour12 = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
    
    setHours(String(hour12));
    setMinutes(String(minute));
    setPeriod(newPeriod);
    onChange(`${hour}:${minute}`);
    if (onDateChange) {
      onDateChange(futureTime);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            "bg-[#2a2a2a] border-[#444444] hover:bg-[#333333] hover:text-white",
            !value && "text-gray-400"
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {value 
            ? format(parse(value, 'HH:mm', new Date()), 'h:mm a') 
            : "Select time (optional)"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4 bg-[#2a2a2a] border-[#444444]" align="start">
        <div className="flex flex-col space-y-4">
          <div className="text-xs text-gray-400 text-center mb-1 pb-2 border-b border-[#444444]">
            Times in the past will be set to tomorrow
          </div>
          <div className="grid grid-cols-3 gap-2 text-white">
            {quickTimeOptions.map(option => (
              <Button
                key={option.value}
                type="button"
                variant="outline"
                onClick={() => onChange(option.value)}
                className="bg-[#333333] border-[#444444] hover:bg-[#444444] text-slate-300 hover:text-white text-xs"
                size="sm"
              >
                {option.label}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 text-white">
            {relativeTimeOptions.map(option => (
              <Button
                key={option.label}
                type="button"
                variant="outline"
                onClick={() => handleRelativeTimeClick(option.hours)}
                className="bg-[#333333] border-[#444444] hover:bg-[#444444] text-slate-300 hover:text-white text-xs"
                size="sm"
              >
                {option.label}
              </Button>
            ))}
          </div>
          
          <div className="h-px bg-[#444444] my-1" />
          
          <div className="flex items-center justify-center space-x-2 text-white">
            <div className="flex flex-col items-center">
              <label className="text-xs text-gray-400 mb-1">Hour</label>
              <Input
                value={hours}
                onChange={handleHoursChange}
                className="w-12 sm:w-14 text-center bg-[#333333] border-[#444444]"
                placeholder="HH"
              />
            </div>
            <div className="text-xl font-bold text-gray-300">:</div>
            <div className="flex flex-col items-center">
              <label className="text-xs text-gray-400 mb-1">Minute</label>
              <Input
                value={minutes}
                onChange={handleMinutesChange}
                className="w-12 sm:w-14 text-center bg-[#333333] border-[#444444]"
                placeholder="MM"
              />
            </div>
            <div className="flex flex-col items-center">
              <label className="text-xs text-gray-400 mb-1">AM/PM</label>
              <Button
                type="button"
                variant="outline"
                onClick={togglePeriod}
                className="w-12 sm:w-14 bg-[#333333] border-[#444444] hover:bg-[#444444]"
              >
                {period}
              </Button>
            </div>
          </div>
          
          {value && (
            <Button
              type="button"
              variant="ghost"
              onClick={onClear}
              className="text-red-400 hover:text-red-300 hover:bg-red-900/20 mt-2"
              size="sm"
            >
              Clear time
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TimePicker; 