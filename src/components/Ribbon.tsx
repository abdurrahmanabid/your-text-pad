import { FilePlus2, X } from "lucide-react";
import { useState } from "react";

interface Tab {
  title: string;
  id: number;
  content: string;
}

interface RibbonProps {
  tabs: Tab[];
  setTabs: (tabs: Tab[]) => void;
}

const Ribbon = ({ tabs, setTabs }: RibbonProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const addNew = () => {
    const newTab = {
      title: `Untitled ${tabs.length + 1}`,
      id: Date.now(), // Using timestamp as unique ID
      content: `This is the content of Untitled ${tabs.length + 1}`,
    };
    setTabs([...tabs, newTab]);
  };

  const removeTab = (id: number) => {
    const newTabs = tabs.filter(tab => tab.id !== id);
    setTabs(newTabs);
  };

  return (
    <div className="border flex flex-wrap items-center border-gray-300 rounded-md overflow-hidden">
      {tabs.map((tab, index) => (
        <div
          key={tab.id}
          className="flex items-center gap-2 border-r border-gray-300 px-3 py-2 cursor-pointer hover:bg-gray-100 transition-colors"
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <span className="text-sm font-medium">{tab.title}</span>
          <X
            size={16}
            className={`cursor-pointer transition-colors ${
              hoveredIndex === index ? "text-gray-500" : "text-transparent"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              removeTab(tab.id);
            }}
          />
        </div>
      ))}
      <div
        className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={addNew}
      >
        <FilePlus2 size={16} className="text-gray-500" />
        <span className="text-sm font-medium">New</span>
      </div>
    </div>
  );
};

export default Ribbon;