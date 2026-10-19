import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./AppLayout.css";

export default function AppLayout() {
  return (
    <div className="jk-layout">
      <Sidebar />

      <main className="jk-main">
        <Outlet />
      </main>
    </div>
  );
}