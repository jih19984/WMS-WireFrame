import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "@/app/router";
import "@/index.css";

const root = document.documentElement;
const storedTheme = window.localStorage.getItem("ax-wms-theme");
if (storedTheme === "light") {
  root.classList.remove("dark");
} else {
  root.classList.add("dark");
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
