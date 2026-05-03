import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const WorkLayout = () => {
  return (
    <div className="flex min-h-screen bg-background dark:bg-background-dark">

      {/* Sidebar */}
      <div className="w-64 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="
        flex-1 
        bg-background dark:bg-background-dark
      ">
        <Outlet />
      </div>

    </div>
  );
};

export default WorkLayout;