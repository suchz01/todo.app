import React from 'react'
import { useUser } from "@/context/UserContext";

const Dashboard = () => {
    const { user } = useUser();
    console.log(user)
    
    
    return (
      <div>
        <p>{user?.userId}</p>
      </div>
    )
}

export default Dashboard