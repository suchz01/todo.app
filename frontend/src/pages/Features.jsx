import React from "react";

const Features = () => {
  const features = [
    {
      title: "Task Management",
      description: "Easily create, edit, and delete tasks to stay organized.",
    },
    {
      title: "Due Dates & Reminders",
      description: "Set due dates and get notifications to never miss a task.",
    },
    {
      title: "Categories & Tags",
      description:
        "Organize tasks using categories and tags for better tracking.",
    },
    {
      title: "Priority Levels",
      description:
        "Assign priority levels to tasks to focus on what matters most.",
    },
    {
      title: "Collaboration",
      description: "Share tasks with teammates and collaborate in real-time.",
    },
    {
      title: "Dark Mode",
      description:
        "Switch between light and dark mode for a comfortable experience.",
    },
  ];

  return (
    <div className=" p-20 flex flex-col justify-center items-center text-center px-4">
      <p className="text-5xl md:text-6xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-sky-300 to-sky-500 animate-gradient">
        Key Features of Our To-Do App
      </p>
      <p className="text-lg text-gray-300 max-w-2xl mb-8">
        Stay organized and boost your productivity with our feature-rich task
        management app.
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-6 rounded-lg shadow-lg border border-gray-700/50 
                     bg-gradient-to-r from-sky-300/10 to-sky-500/10
                     hover:from-sky-300/20 hover:to-sky-500/20
                     transition-all duration-500 ease-in-out
                     hover:scale-105 hover:shadow-sky-500/20"
          >
            <p className="text-xl font-semibold text-sky-400 mb-2">
              {feature.title}
            </p>
            <p className="text-gray-300">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
