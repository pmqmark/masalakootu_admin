import React from "react";
import { MoonLoader  } from "react-spinners"; 

export const TableLoading = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <MoonLoader  color="#FFB401" size={80} /> 
    </div>
  );
};
