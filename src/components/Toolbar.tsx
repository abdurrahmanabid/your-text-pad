import { FolderOpen, Moon, Plus, Save, Sun, User as UserIcon } from 'lucide-react';

interface ToolbarProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  openFile: () => void;
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
  openFile,
  addNewTab,
  saveCurrentTab,
  user,
  onLogout,
}: ToolbarProps) {
  return (
    <div className="navbar bg-base-200">
      <div className="flex-1">
        <button className="btn btn-ghost text-xl">Text Editor</button>
      </div>
      <div className="flex-none gap-2">
        {/* User dropdown - only shown when logged in */}
        {user ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} className="btn btn-ghost flex items-center gap-2">
              <UserIcon size={18} />
              <span>{user.name}</span>
            </div>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
              <li>
                <a className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </a>
              </li>
              <li><a>Settings</a></li>
              <li><button onClick={onLogout}>Logout</button></li>
            </ul>
          </div>
        ) : null}
        
        {/* Theme toggle */}
        <button 
          className="btn btn-ghost btn-circle"
          onClick={toggleDarkMode}
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        {/* File operations */}
        <button className="btn btn-primary" onClick={openFile}>
          <FolderOpen size={18} className="mr-1" />
          Open
        </button>
        
        <button className="btn btn-primary" onClick={addNewTab}>
          <Plus size={18} className="mr-1" />
          New
        </button>

        <button className="btn btn-accent" onClick={saveCurrentTab}>
          <Save size={18} className="mr-1" />
          Save (Ctrl+S)
        </button>
      </div>
    </div>
  );
}