import Sidebar from "../components/layout/Sidebar";
import DashboardPage from "./DashboardPage";

function WorkPage() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 w-full">
        <DashboardPage />
      </div>
    </div>
  );
}

export default WorkPage;