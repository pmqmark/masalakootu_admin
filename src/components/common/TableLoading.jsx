import React from "react";
import { ClockLoader } from "react-spinners"; 

export const TableLoading = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <ClockLoader color="#36d7b7" size={80} /> 
    </div>
  );
};
