import { isToday, isTomorrow, isBefore, startOfDay, format, addDays } from 'date-fns';

const getDateTime = (dateStr, timeStr) => {
  const date = new Date(dateStr);
  if (timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    date.setHours(hours, minutes, 0, 0);
  }
  return date;
};

const sortByDateAndTime = (todos) => {
  return todos.sort((a, b) => {
    const dateA = getDateTime(a.dueDate, a.dueTime);
    const dateB = getDateTime(b.dueDate, b.dueTime);
    return dateA - dateB;
  });
};

export const getFilteredTodos = (todos, activeFilter) => {
  const now = new Date();

  if (activeFilter.startsWith("priority-")) {
    const priority = activeFilter.replace("priority-", "");
    return sortByDateAndTime(todos.filter(todo => !todo.completed && todo.priority === priority));
  }

  let filteredTodos = todos.filter(todo => {
    if (todo.completed && activeFilter !== "completed") return false;
    const dueDate = todo.dueDate ? new Date(todo.dueDate) : null;

    switch (activeFilter) {
      case "today":
        return dueDate && isToday(dueDate) && (!todo.dueTime || getDateTime(todo.dueDate, todo.dueTime) >= now);
      case "upcoming":
        return dueDate && !isToday(dueDate) && !isBefore(dueDate, startOfDay(now));
      case "overdue":
        return dueDate && getDateTime(todo.dueDate, todo.dueTime) < now;
      case "completed":
        return todo.completed;
      case "no-date":
        return !todo.completed && !todo.dueDate;
    }
  });
  if (activeFilter === "overdue") {
    return filteredTodos.sort((a, b) => getDateTime(b.dueDate, b.dueTime) - getDateTime(a.dueDate, a.dueTime));
  }
  return sortByDateAndTime(filteredTodos);
};

export const getGroupedUpcomingTodos = (todos, activeFilter) => {
  if (activeFilter !== "upcoming") return null;
  const groupedTodos = {};
  getFilteredTodos(todos, "upcoming").forEach(todo => {
    const dateKey = format(new Date(todo.dueDate), 'yyyy-MM-dd');
    const dateLabel = isTomorrow(new Date(todo.dueDate))
      ? 'Tomorrow'
      : format(new Date(todo.dueDate), 'EEEE, MMMM d, yyyy');

    if (!groupedTodos[dateKey]) {
      groupedTodos[dateKey] = { label: dateLabel, todos: [] };
    }
    
    groupedTodos[dateKey].todos.push(todo);
  });

  return Object.entries(groupedTodos)
    .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
    .map(([dateKey, group]) => ({
      dateKey,
      label: group.label,
      todos: sortByDateAndTime(group.todos)
    }));
};

export const validateAndAdjustDateTime = (date, time) => {
  const now = new Date();
  const dateTime = getDateTime(date, time);
  if (isBefore(dateTime, now)) {
    if (isToday(dateTime)) {
      return {
        date: format(addDays(dateTime, 1), 'yyyy-MM-dd'),
        time,
        isAdjusted: true
      };
    }
  }
  return {
    date: format(dateTime, 'yyyy-MM-dd'),
    time,
    isAdjusted: false
  };
};
