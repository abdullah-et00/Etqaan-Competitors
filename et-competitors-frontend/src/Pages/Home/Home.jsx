import React from "react";
import SideMenu from "../../Components/SideMenu";
import { Outlet } from "react-router-dom";
export default function Home() {
  return (
    <div className="tob-div flex gap-4 m-2 p-2 border-2 border-gray-200 border-dashed rounded-lg ">
      <SideMenu />
      <div className="w-full">
        <Outlet />
      </div>
    </div>
  );
}
