import { useEffect, useState } from "react";
import Ribbon from "../components/Ribbon";

interface Tab {
  title: string;
  id: number;
  content: string;
}

const Home = () => {
  const [tabs, setTabs] = useState<Tab[]>([
    {
      title: "Untitled 1",
      id: 1,
      content: "This is the content of Untitled 1",
    },
    {
      title: "Untitled 2",
      id: 2,
      content: "This is the content of Untitled 2",
    },
  ]);
  const [activeTab, setActiveTab] = useState<number>(1);
  const [isEditingTitle, setIsEditingTitle] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState<string>("");

  // Set the first tab as active by default
  useEffect(() => {
    if (tabs.length > 0 && !tabs.find(tab => tab.id === activeTab)) {
      setActiveTab(tabs[0].id);
    }
  }, [tabs, activeTab]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updatedTabs = tabs.map(tab =>
      tab.id === activeTab ? { ...tab, content: e.target.value } : tab
    );
    setTabs(updatedTabs);
  };

  const addNewTab = () => {
    const newId = tabs.length > 0 ? Math.max(...tabs.map(tab => tab.id)) + 1 : 1;
    const newTab = {
      title: `Untitled ${newId}`,
      id: newId,
      content: "",
    };
    setTabs([...tabs, newTab]);
    setActiveTab(newId);
  };

  const closeTab = (id: number) => {
    const newTabs = tabs.filter(tab => tab.id !== id);
    setTabs(newTabs);
    
    // If we're closing the active tab, switch to another tab
    if (id === activeTab && newTabs.length > 0) {
      setActiveTab(newTabs[0].id);
    }
  };

  const startEditingTitle = (id: number, title: string) => {
    setIsEditingTitle(id);
    setNewTitle(title);
  };

  const saveTitle = (id: number) => {
    const updatedTabs = tabs.map(tab =>
      tab.id === id ? { ...tab, title: newTitle } : tab
    );
    setTabs(updatedTabs);
    setIsEditingTitle(null);
  };

  const activeContent = tabs.find(tab => tab.id === activeTab)?.content || "";

  return (
    <div className="flex flex-col h-screen">
      <Ribbon 
        tabs={tabs} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        addNewTab={addNewTab}
        closeTab={closeTab}
        isEditingTitle={isEditingTitle}
        startEditingTitle={startEditingTitle}
        newTitle={newTitle}
        setNewTitle={setNewTitle}
        saveTitle={saveTitle}
      />
      
      <textarea
        value={activeContent}
        onChange={handleContentChange}
        className="flex-grow outline-none border-none focus:border-none focus:outline-none focus:ring-0 p-4 resize-none w-full bg-gray-50"
        placeholder="Start typing..."
      />
      
      <div className="bg-gray-100 p-2 text-sm text-gray-500">
        {tabs.find(tab => tab.id === activeTab)?.title} | 
        Characters: {activeContent.length} | 
        Words: {activeContent.trim() ? activeContent.trim().split(/\s+/).length : 0}
      </div>
    </div>
  );
};

export default Home;