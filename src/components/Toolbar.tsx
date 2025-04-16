import { FolderOpen, Moon, Plus, Save, Sun } from 'lucide-react';

interface ToolbarProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  openFile: () => void;
  addNewTab: () => void;
  saveCurrentTab: () => void;
}

export default function Toolbar({
  isDarkMode,
  toggleDarkMode,
  openFile,
  addNewTab,
  saveCurrentTab,
}: ToolbarProps) {
  return (
    <div className="navbar bg-base-200">
      <div className="flex-1">
        <button className="btn btn-ghost text-xl">Text Editor</button>
      </div>
      <div className="flex-none">
        <button 
          className="btn btn-ghost btn-circle"
          onClick={toggleDarkMode}
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        <button className="btn btn-primary mr-2" onClick={openFile}>
          <FolderOpen size={18} className="mr-1" />
          Open
        </button>
        
        <button className="btn btn-primary mr-2" onClick={addNewTab}>
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