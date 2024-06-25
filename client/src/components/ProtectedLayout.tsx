import React from "react";
import Navbar from "./Navbar";

type Props = {
  children: React.ReactNode;
};

const ProtectedLayout = ({ children }: Props) => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-10 overflow-y-auto bg-gray-100">
      <Navbar />

      {children}
    </div>
  );
};

export default ProtectedLayout;
