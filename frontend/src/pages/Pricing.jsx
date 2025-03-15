import React, { useState } from "react";

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className=" flex flex-col items-center justify-center px-4 py-16 text-white">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-sky-300 to-sky-500 animate-gradient">
          Choose Your Perfect Plan
        </h1>
        <p className="text-center text-gray-300 mb-8 text-xl">
          Unlock your productivity potential today
        </p>

        <div className="flex justify-center items-center space-x-4 mb-12">
          <span
            className={`text-lg transition-colors duration-300 ${
              !isYearly ? "text-white" : "text-gray-400"
            }`}
          >
            Monthly
          </span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className="relative w-16 h-8 rounded-full bg-sky-500/30 p-1 transition-colors duration-300 hover:bg-sky-500/50"
          >
            <div
              className={`w-6 h-6 rounded-full bg-white transition-transform duration-300 ${
                isYearly ? "translate-x-8" : ""
              }`}
            />
          </button>
          <span
            className={`text-lg transition-colors duration-300 ${
              isYearly ? "text-white" : "text-gray-400"
            }`}
          >
            Yearly <span className="text-green-400 text-sm">(-20%)</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-900/50 p-8 rounded-2xl border border-gray-700/50 text-center transform transition-all duration-300 hover:scale-105 hover:border-sky-500/50 hover:shadow-2xl hover:shadow-sky-500/20">
            <h2 className="text-2xl font-bold">Basic</h2>
            <p className="text-gray-400 mt-2">For personal use</p>
            <div className="mt-6">
              <span className="text-5xl font-bold">
              ₹0
              </span>
              <span className="text-gray-400">
                /{isYearly ? "year" : "month"}
              </span>
            </div>
            <button className="mt-6 w-full py-3 px-6 rounded-xl bg-gradient-to-r from-sky-300 to-sky-500 text-white font-semibold transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-sky-500/25">
              Get Started Free
            </button>
          </div>
          <div className="relative bg-gradient-to-br from-sky-900 to-blue-900 p-8 rounded-2xl border border-sky-500/50 text-center transform transition-all duration-300 hover:scale-110 shadow-2xl shadow-sky-500/20">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-4 py-1.5 rounded-full shadow-md">
                Most Popular
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white mt-2">Pro</h2>
            <p className="text-blue-100 mt-2">For productivity lovers</p>
            <div className="mt-6">
              <span className="text-5xl font-bold text-white">
              ₹{isYearly ? "999" : "99"}
              </span>
              <span className="text-blue-200">
                /{isYearly ? "year" : "month"}
              </span>
            </div>
            <button className="mt-6 w-full py-3 px-6 rounded-xl bg-white text-sky-600 font-semibold shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-sky-50 hover:shadow-xl">
              Upgrade Now
            </button>
          </div>
          <div className="bg-gray-900/50 p-8 rounded-2xl border border-gray-700/50 text-center transform transition-all duration-300 hover:scale-105 hover:border-sky-500/50 hover:shadow-2xl hover:shadow-sky-500/20">
            <h2 className="text-2xl font-bold">Enterprise</h2>
            <p className="text-gray-400 mt-2">For teams & businesses</p>
            <div className="mt-6">
              <span className="text-5xl font-bold">
              ₹{isYearly ? "1999" : "199"}
              </span>
              <span className="text-gray-400">
                /{isYearly ? "year" : "month"}
              </span>
            </div>
            <button className="mt-6 w-full py-3 px-6 rounded-xl bg-gradient-to-r from-sky-300 to-sky-500 text-white font-semibold transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-sky-500/25">
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
