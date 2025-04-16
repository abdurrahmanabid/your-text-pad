import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from '../components/Editor';
import StatusBar from '../components/StatusBar';
import TabBar from '../components/TabBar';
import Toolbar from '../components/Toolbar';
import { getMe, logout } from '../service/api';

export interface Tab {
  title: string;
  id: number;
  content: string;
  fileHandle?: FileSystemFileHandle;
}

interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export default function Home() {
  const [tabs, setTabs] = useState<Tab[]>([
    {
      title: 'Document 1',
      id: 1,
      content: 'Welcome to your new text editor!\n\nPress Ctrl+S to save this file.',
    },
  ]);
  const [activeTab, setActiveTab] = useState<number>(1);
  const [isEditingTitle, setIsEditingTitle] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        
        const userData = await getMe();
        setUser(userData);
      } catch (error) {
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('token');
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Tab management functions
  const handleContentChange = (content: string) => {
    const updatedTabs = tabs.map(tab =>
      tab.id === activeTab ? { ...tab, content } : tab
    );
    setTabs(updatedTabs);
  };

  const addNewTab = () => {
    const newId = tabs.length > 0 ? Math.max(...tabs.map(tab => tab.id)) + 1 : 1;
    const newTab = {
      title: `Document ${newId}`,
      id: newId,
      content: '',
    };
    setTabs([...tabs, newTab]);
    setActiveTab(newId);
  };

  const closeTab = (id: number) => {
    const newTabs = tabs.filter(tab => tab.id !== id);
    setTabs(newTabs);
    
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

  // File operations
  const saveCurrentTab = useCallback(async () => {
    const tab = tabs.find(t => t.id === activeTab);
    if (!tab) return;

    try {
      if ('showSaveFilePicker' in window) {
        await saveWithFileSystemAPI(tab);
      } else {
        saveWithDownload(tab);
      }
    } catch (error) {
      console.error('Error saving file:', error);
    }
  }, [tabs, activeTab]);

  const saveWithFileSystemAPI = async (tab: Tab) => {
    try {
      let fileHandle = tab.fileHandle;
      
      if (!fileHandle) {
        fileHandle = await window.showSaveFilePicker({
          suggestedName: `${tab.title}.txt`,
          types: [{
            description: 'Text Files',
            accept: { 'text/plain': ['.txt'] },
          }],
        });
      }

      const writable = await fileHandle.createWritable();
      await writable.write(tab.content);
      await writable.close();

      if (!tab.fileHandle) {
        const updatedTabs = tabs.map(t => 
          t.id === tab.id ? { ...t, fileHandle, title: fileHandle!.name.replace('.txt', '') } : t
        );
        setTabs(updatedTabs);
      }

      showToast('File saved successfully!');
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      throw error;
    }
  };

  const saveWithDownload = (tab: Tab) => {
    const blob = new Blob([tab.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tab.title}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('File downloaded!');
  };

  const showToast = (message: string) => {
    const toast = document.createElement('div');
    toast.className = 'toast toast-top toast-center';
    toast.innerHTML = `
      <div class="alert alert-success">
        <span>${message}</span>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  };

  const openFile = async () => {
    try {
      if (!('showOpenFilePicker' in window)) {
        alert('File System Access API not supported in your browser. Try Chrome or Edge.');
        return;
      }

      const [fileHandle] = await window.showOpenFilePicker({
        types: [{
          description: 'Text Files',
          accept: { 'text/plain': ['.txt'] },
        }],
        multiple: false,
      });

      const file = await fileHandle.getFile();
      const content = await file.text();
      
      const newId = tabs.length > 0 ? Math.max(...tabs.map(tab => tab.id)) + 1 : 1;
      const newTab = {
        title: file.name.replace('.txt', ''),
        id: newId,
        content,
        fileHandle,
      };

      setTabs([...tabs, newTab]);
      setActiveTab(newId);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      console.error('Error opening file:', error);
    }
  };

  // Handle Ctrl+S shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveCurrentTab();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [saveCurrentTab]);

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-base-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-screen ${isDarkMode ? 'dark' : ''}`} data-theme={isDarkMode ? "dark" : "light"}>
      <Toolbar 
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        openFile={openFile}
        addNewTab={addNewTab}
        saveCurrentTab={saveCurrentTab}
        user={user}
        onLogout={handleLogout}
      />
      
      <TabBar
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isEditingTitle={isEditingTitle}
        newTitle={newTitle}
        setNewTitle={setNewTitle}
        startEditingTitle={startEditingTitle}
        saveTitle={saveTitle}
        closeTab={closeTab}
      />

      <Editor
        content={activeTabData?.content || ''}
        onChange={handleContentChange}
      />

      <StatusBar
        fileName={activeTabData?.title || 'Untitled'}
        isPersisted={!!activeTabData?.fileHandle}
        characterCount={activeTabData?.content.length || 0}
        wordCount={activeTabData?.content.trim() ? activeTabData.content.trim().split(/\s+/).length : 0}
        lineCount={activeTabData?.content.split('\n').length || 0}
      />
    </div>
  );
}