import React from "react";
import { Outlet } from "react-router";
import Navbar from "./index";

function WithNav() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default WithNav;
