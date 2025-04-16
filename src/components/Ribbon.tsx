interface RibbonProps {
  tabs: Tab[];
  activeTab: number;
  setActiveTab: (id: number) => void;
  addNewTab: () => void;
  closeTab: (id: number) => void;
  isEditingTitle: number | null;
  startEditingTitle: (id: number, title: string) => void;
  newTitle: string;
  setNewTitle: (title: string) => void;
  saveTitle: (id: number) => void;
}

const Ribbon = ({
  tabs,
  activeTab,
  setActiveTab,
  addNewTab,
  closeTab,
  isEditingTitle,
  startEditingTitle,
  newTitle,
  setNewTitle,
  saveTitle,
}: RibbonProps) => {
  return (
    <div className="flex bg-gray-200 p-1 overflow-x-auto">
      {tabs.map(tab => (
        <div
          key={tab.id}
          className={`flex items-center mr-1 px-3 py-1 rounded-t-lg cursor-pointer ${
            activeTab === tab.id ? "bg-white" : "bg-gray-300 hover:bg-gray-100"
          }`}
        >
          {isEditingTitle === tab.id ? (
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onBlur={() => saveTitle(tab.id)}
              onKeyDown={(e) => e.key === 'Enter' && saveTitle(tab.id)}
              className="w-32 px-1"
              autoFocus
            />
          ) : (
            <>
              <span 
                onClick={() => setActiveTab(tab.id)}
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
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </>
          )}
        </div>
      ))}
      <button
        onClick={addNewTab}
        className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        +
      </button>
    </div>
  );
};

export default Ribbon;