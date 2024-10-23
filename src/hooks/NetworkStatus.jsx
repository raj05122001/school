"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export const useOnlineStatus = () => {
  const [onlineStatus, setOnlineStatus] = useState(true);

  useEffect(() => {
   const interval = setInterval(() => {
     axios(`/total-student.jpg?time=${Number(new Date())}`)
     .then(response => {
      setOnlineStatus(true)
     })
     .catch(error => {
      if(error.code === "ERR_NETWORK"){
        setOnlineStatus(false);
      }
     });
   }, 10000);

   return ()=> clearInterval(interval);
  },[axios]);

  return { onlineStatus };
};
