import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from '../components/Editor';
import StatusBar from '../components/StatusBar';
import TabBar from '../components/TabBar';
import Toolbar from '../components/Toolbar';
import { getFiles, getMe, logout, saveFileToDB } from '../service/api';

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

interface DBFile {
  _id: string;
  title: string;
  content: string;
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
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showDBFiles, setShowDBFiles] = useState(false);
  const [dbFiles, setDbFiles] = useState<DBFile[]>([]);
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
  const saveCurrentTab = useCallback(() => {
    setShowSaveDialog(true);
  }, []);

  const handleSaveToLocal = async () => {
    const tab = tabs.find(t => t.id === activeTab);
    if (!tab) return;

    setShowSaveDialog(false);
    try {
      if ('showSaveFilePicker' in window) {
        await saveWithFileSystemAPI(tab);
      } else {
        saveWithDownload(tab);
      }
    } catch (error) {
      console.error('Error saving file locally:', error);
      showToast('Failed to save locally');
    }
  };

  const handleSaveToDB = async () => {
    const tab = tabs.find(t => t.id === activeTab);
    if (!tab) return;

    setShowSaveDialog(false);
    try {
      await saveFileToDB({
        title: tab.title,
        content: tab.content
      });
      showToast('File saved to database!');
    } catch (error) {
      console.error('Error saving to database:', error);
      showToast('Failed to save to database');
    }
  };

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

  const importFromLocal = async () => {
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

  const importFromDB = async () => {
    try {
      const files = await getFiles();
      setDbFiles(files);
      setShowDBFiles(true);
    } catch (error) {
      console.error('Error fetching files:', error);
      showToast('Failed to load files from database');
    }
  };

  const handleFileSelectFromDB = (file: DBFile) => {
    const newId = tabs.length > 0 ? Math.max(...tabs.map(tab => tab.id)) + 1 : 1;
    const newTab = {
      title: file.title,
      id: newId,
      content: file.content,
    };
    setTabs([...tabs, newTab]);
    setActiveTab(newId);
    setShowDBFiles(false);
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
      {/* Save Options Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-96 shadow-xl">
            <h3 className="text-lg font-bold mb-4">Save File</h3>
            <div className="space-y-3">
              <button
                onClick={handleSaveToLocal}
                className="btn btn-primary w-full flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Save to Local File
              </button>
              <button
                onClick={handleSaveToDB}
                className="btn btn-secondary w-full flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
                Save to Database
              </button>
              <button
                onClick={() => setShowSaveDialog(false)}
                className="btn btn-ghost w-full"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Database Files Dialog */}
      {showDBFiles && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-base-100 p-6 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">Your Saved Files</h3>
            <div className="space-y-2">
              {dbFiles.length > 0 ? (
                dbFiles.map((file) => (
                  <div 
                    key={file._id} 
                    className="p-3 hover:bg-base-200 rounded-lg cursor-pointer border border-base-300"
                    onClick={() => handleFileSelectFromDB(file)}
                  >
                    <div className="font-medium">{file.title}</div>
                    <div className="text-sm text-gray-500">
                      Last updated: {new Date(file.updatedAt).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {file.content.length > 100 
                        ? `${file.content.substring(0, 100)}...` 
                        : file.content}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">No files found in database</div>
              )}
            </div>
            <button
              onClick={() => setShowDBFiles(false)}
              className="btn btn-ghost mt-4"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <Toolbar 
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        importFromLocal={importFromLocal}
        importFromDB={importFromDB}
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