import React from "react";
import Hyperspeed from "../components/ui/Hyperspeed";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";

const Homepage = () => {
  const { user } = useUser();
   const navigate = useNavigate();
   const navigateUser=()=>{
    if(user)
      navigate("/dashboard");
    else
    navigate("/login")
   }
  return (
    <div className="flex flex-col items-center justify-center text-center px-4 h-screen z-10">
      <p className="marvel-bold text-5xl md:text-7xl lg:text-9xl z-10">
        ORGANIZE ALL TODO
      </p>
      <p className="marvel-regular text-4xl md:text-6xl lg:text-8xl mt-4 z-10">
         AT TODO.APP
      </p>
      <p className="text-lg md:text-xl mt-6 max-w-2xl text-slate-300 z-10">
        Manage all your tasks in one place with statuses, priorities, and easy
        tracking.
      </p>
      <button className="mt-8 px-6 py-3 backdrop-blur-2xl bg-transparent border-2 border-white hover:scale-110 transition rounded-full hover:cursor-pointer z-10" onClick={() => navigateUser()}>
        {user?"Go to Dashboard":"Get Started for Free"}
      </button>
      <Hyperspeed
        effectOptions={{
          onSpeedUp: () => {},
          onSlowDown: () => {},
          distortion: "turbulentDistortion",
          length: 400,
          roadWidth: 10,
          islandWidth: 2,
          lanesPerRoad: 4,
          fov: 90,
          fovSpeedUp: 150,
          speedUp: 2,
          carLightsFade: 0.4,
          totalSideLightSticks: 20,
          lightPairsPerRoadWay: 40,
          shoulderLinesWidthPercentage: 0.05,
          brokenLinesWidthPercentage: 0.1,
          brokenLinesLengthPercentage: 0.5,
          lightStickWidth: [0.12, 0.5],
          lightStickHeight: [1.3, 1.7],
          movingAwaySpeed: [60, 80],
          movingCloserSpeed: [-120, -160],
          carLightsLength: [400 * 0.03, 400 * 0.2],
          carLightsRadius: [0.05, 0.14],
          carWidthPercentage: [0.3, 0.5],
          carShiftX: [-0.8, 0.8],
          carFloorSeparation: [0, 5],
          colors: {
            roadColor: 0x080808,
            islandColor: 0x0a0a0a,
            background: 0x000000,
            shoulderLines: 0xffffff,
            brokenLines: 0xffffff,
            leftCars: [0xd856bf, 0x6750a2, 0xc247ac],
            rightCars: [0x03b3c3, 0x0e5ea5, 0x324555],
            sticks: 0x03b3c3,
          },
        }}
      />
    </div>
  );
};

export default Homepage;
