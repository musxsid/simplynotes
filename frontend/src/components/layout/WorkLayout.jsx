import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const WorkLayout = () => {
  return (
    <div className="flex min-h-screen relative bg-background dark:bg-background-dark">

      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 relative z-10">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 relative z-0 overflow-visible">
        <Outlet />
      </div>

    </div>
  );
};

export default WorkLayout;