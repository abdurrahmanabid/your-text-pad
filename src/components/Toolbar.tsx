import {
  Database,
  FolderOpen,
  HardDrive,
  LogIn,
  LogOutIcon,
  Moon,
  Plus,
  Save,
  Sun,
  User
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
  openFileStore: () => void;
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
  openFileStore,
}: ToolbarProps) {
  const [showImportDropdown, setShowImportDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="navbar bg-base-200 border-b border-base-300 px-4">
      {/* Left side - App title */}
      <div className="flex-1">
        <span className="text-xl font-bold">
          Text<span className="text-primary">Pad</span>
        </span>
      </div>

      {/* Right side - Controls */}
      <div className="flex gap-2">
        {/* Dark mode toggle */}
        <button
          className="btn btn-ghost btn-square"
          onClick={toggleDarkMode}
          aria-label={
            isDarkMode ? "Switch to light mode" : "Switch to dark mode"
          }
          data-tip={isDarkMode ? "Light mode" : "Dark mode"}
        >
          {isDarkMode ? (
            <Sun size={20} className="text-yellow-400" />
          ) : (
            <Moon size={20} />
          )}
        </button>

        {/* File operations */}
        <div className="flex gap-1">
          {/* Import dropdown */}
          <div className="dropdown dropdown-end">
            <button
              className="btn btn-primary btn-sm md:btn-md"
              onClick={() => setShowImportDropdown(!showImportDropdown)}
            >
              <FolderOpen size={18} className="mr-1" />
              <span className="hidden sm:inline">Open</span>
            </button>
            <ul
              tabIndex={0}
              className={`dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 mt-1 ${
                showImportDropdown ? "" : "hidden"
              }`}
              onMouseLeave={() => setShowImportDropdown(false)}
            >
              <li>
                <button
                  onClick={() => {
                    importFromLocal();
                    setShowImportDropdown(false);
                  }}
                  className="flex items-center"
                >
                  <HardDrive size={16} className="mr-2" />
                  From Local File
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    openFileStore();
                    setShowImportDropdown(false);
                  }}
                  className="flex items-center"
                >
                  <Database size={16} className="mr-2" />
                  From Database
                </button>
              </li>
            </ul>
          </div>

          {/* New document */}
          <button
            className="btn btn-primary btn-sm md:btn-md"
            onClick={addNewTab}
            data-tip="New document"
          >
            <Plus size={18} className="mr-1" />
            <span className="hidden sm:inline">New</span>
          </button>

          {/* Save button */}
          <button
            className="btn btn-accent btn-sm md:btn-md"
            onClick={saveCurrentTab}
            data-tip="Save (Ctrl+S)"
          >
            <Save size={18} className="mr-1" />
            <span className="hidden sm:inline">Save</span>
          </button>
        </div>

        {/* User controls */}
      </div>
      {user ? (
        <div className="dropdown dropdown-end">
          <button
            className="btn"
            onClick={() => setShowImportDropdown(!showImportDropdown)}
          >
            <User size={18} className="mr-1" />
          </button>
          <ul
            tabIndex={0}
            className={`dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 mt-1 ${
              showImportDropdown ? "" : "hidden"
            }`}
            onMouseLeave={() => setShowImportDropdown(false)}
          >
            <li>
              <button
                className="flex items-center"
              >
                <User size={16} className="mr-2" />
                Profile
              </button>
            </li>
            <li>
              <button onClick={onLogout} className="flex items-center text-red-700">
                <LogOutIcon size={16} className="mr-2" />
                Logout
              </button>
            </li>
          </ul>
        </div>
      ) : (
        <button
          className="btn btn-ghost"
          onClick={() => navigate("/login")}
          data-tip="Login"
        >
          <LogIn size={18} />
        </button>
      )}
    </div>
  );
}
