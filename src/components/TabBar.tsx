import { X } from 'lucide-react';
import { Tab } from '../pages/Home';

interface TabBarProps {
  tabs: Tab[];
  activeTab: number;
  setActiveTab: (id: number) => void;
  isEditingTitle: number | null;
  newTitle: string;
  setNewTitle: (title: string) => void;
  startEditingTitle: (id: number, title: string) => void;
  saveTitle: (id: number) => void;
  closeTab: (id: number) => void;
}

export default function TabBar({
  tabs,
  activeTab,
  setActiveTab,
  isEditingTitle,
  newTitle,
  setNewTitle,
  startEditingTitle,
  saveTitle,
  closeTab,
}: TabBarProps) {
  return (
    <div className="tabs tabs-boxed bg-base-200 px-4 pt-1 overflow-x-auto">
      {tabs.map(tab => (
        <div
          key={tab.id}
          className={`tab tab-lg ${activeTab === tab.id ? 'tab-active' : ''}`}
          onClick={() => setActiveTab(tab.id)}
        >
          {isEditingTitle === tab.id ? (
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onBlur={() => saveTitle(tab.id)}
              onKeyDown={(e) => e.key === 'Enter' && saveTitle(tab.id)}
              className="input input-xs w-32"
              autoFocus
            />
          ) : (
            <div className="flex items-center">
              <span 
                onDoubleClick={() => startEditingTitle(tab.id, tab.title)}
                className="mr-2"
              >
                {tab.title}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
                className="btn btn-circle btn-xs btn-ghost"
                aria-label={`Close ${tab.title}`}
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}