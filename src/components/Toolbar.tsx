import {
  Database,
  FolderOpen,
  HardDrive,
  LogOut,
  Moon,
  Plus,
  Save,
  Sun,
  User as UserIcon,
} from "lucide-react";
import { useState } from "react";

interface ToolbarProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  importFromLocal: () => void;
  importFromDB: () => void;
  addNewTab: () => void;
  saveCurrentTab: () => void;
  user?: {
    _id: string;
    name: string;
    email: string;
  };
  onLogout: () => void;
}

export default function Toolbar({
  isDarkMode,
  toggleDarkMode,
  importFromLocal,
  importFromDB,
  addNewTab,
  saveCurrentTab,
  user,
  onLogout,
}: ToolbarProps) {
  const [showImportMenu, setShowImportMenu] = useState(false);
  const [showSaveMenu, setShowSaveMenu] = useState(false);

  return (
    <div className="navbar bg-base-200 border-b border-base-300 px-4 flex justify-between">
      {/* Left side - App title */}
      <div className="text-2xl font-bold">
        Text
        <span className="text-primary dark:text-yellow-500">Pad</span>
      </div>

      {/* Right side - Controls */}
      <div className="flex">
        {/* User dropdown */}
        {user && (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar flex items-center justify-center"
            >
              <div>
                {user.name ? <UserIcon size={18} /> : <UserIcon size={18} />}
              </div>
            </div>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <li className="menu-title">
                <span>{user.name || "User"}</span>
              </li>
              <li>
                <a className="justify-between">
                  Profile
                  <span className="badge badge-primary">New</span>
                </a>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <button onClick={onLogout} className="text-error">
                  <LogOut size={16} className="mr-2" />
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}

        {/* Dark mode toggle */}
        <button
          className="btn btn-ghost btn-square"
          onClick={toggleDarkMode}
          aria-label={
            isDarkMode ? "Switch to light mode" : "Switch to dark mode"
          }
        >
          {isDarkMode ? (
            <Sun size={20} className="text-warning" />
          ) : (
            <Moon size={20} />
          )}
        </button>

        {/* File operations */}
        <div className="flex gap-2">
          {/* Import dropdown */}
          <div className="dropdown dropdown-end">
            <button
              className="btn btn-primary"
              onClick={() => setShowImportMenu(!showImportMenu)}
            >
              <FolderOpen size={18} className="mr-1" />
              <span className="hidden sm:block">Open</span>
            </button>
            {showImportMenu && (
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 mt-2"
              >
                <li>
                  <button
                    onClick={() => {
                      importFromLocal();
                      setShowImportMenu(false);
                    }}
                  >
                    <HardDrive size={16} className="mr-2" />
                    From Local File
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      importFromDB();
                      setShowImportMenu(false);
                    }}
                  >
                    <Database size={16} className="mr-2" />
                    From Database
                  </button>
                </li>
              </ul>
            )}
          </div>

          {/* New document */}
          <button className="btn btn-primary" onClick={addNewTab}>
            <Plus size={18} className="mr-1" />
            <span className="hidden sm:block">New</span>
          </button>

          {/* Save dropdown */}
          <div className="dropdown dropdown-end">
            <button className="btn btn-accent" onClick={() => saveCurrentTab()}>
              <Save size={18} className="mr-1" />
              <span className="hidden sm:block">Save</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
