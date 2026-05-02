const Sidebar = () => {
  return (
    <div className="h-screen w-64 fixed left-0 top-0 flex flex-col 
    bg-gray-900 dark:bg-gray-950 
    text-gray-100 
    border-r border-gray-800 p-5">

      {/* 🔥 Logo */}
      <h1 className="text-2xl font-semibold mb-10 tracking-tight">
        SimplyNotes
      </h1>

      {/* 🔹 Navigation */}
      <nav className="flex flex-col gap-2 flex-grow">

        {/* Notes */}
        <button className="flex items-center gap-3 px-3 py-2 rounded-lg 
        bg-gray-800 text-white 
        hover:bg-gray-700 transition">
          <span>📒</span>
          <span className="text-sm font-medium">Notes</span>
        </button>

        {/* Settings */}
        <button className="flex items-center gap-3 px-3 py-2 rounded-lg 
        text-gray-400 
        hover:bg-gray-800 hover:text-white transition">
          <span>⚙️</span>
          <span className="text-sm font-medium">Settings</span>
        </button>

      </nav>

      {/* 🔻 Logout */}
      <button className="flex items-center gap-3 px-3 py-2 rounded-lg 
      text-red-400 
      hover:bg-red-500/10 hover:text-red-300 transition">
        <span>🚪</span>
        <span className="text-sm font-medium">Logout</span>
      </button>

    </div>
  );
};

export default Sidebar;