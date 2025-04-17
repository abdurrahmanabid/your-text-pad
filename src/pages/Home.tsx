import { Download, DownloadCloud } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Editor from "../components/Editor";
import FileStoreModal from "../components/FileStoreModal";
import StatusBar from "../components/StatusBar";
import TabBar from "../components/TabBar";
import Toolbar from "../components/Toolbar";
import {
  deleteStoredFile,
  getFiles,
  getMe,
  getStoredFiles,
  logout,
  saveFileToDB,
} from "../service/api";

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
      title: "Document 1",
      id: 1,
      content:
        "Welcome to your new text editor!\n\nPress Ctrl+S to save this file.",
    },
  ]);
  const [activeTab, setActiveTab] = useState<number>(1);
  const [isEditingTitle, setIsEditingTitle] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState<string>("");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showDBFiles, setShowDBFiles] = useState(false);
  const [dbFiles, setDbFiles] = useState<DBFile[]>([]);
  const [showFileStore, setShowFileStore] = useState(false);
  const [storedFiles, setStoredFiles] = useState<
    Array<{
      _id: string;
      title: string;
      content: string;
      updatedAt: string;
    }>
  >([]);
  const navigate = useNavigate();

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const userData = await getMe();
        setUser(userData);
      } catch (error) {
        localStorage.removeItem("token");
        // navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("token");
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Tab management functions
  const handleContentChange = (content: string) => {
    const updatedTabs = tabs.map((tab) =>
      tab.id === activeTab ? { ...tab, content } : tab
    );
    setTabs(updatedTabs);
  };

  const addNewTab = () => {
    const newId =
      tabs.length > 0 ? Math.max(...tabs.map((tab) => tab.id)) + 1 : 1;
    const newTab = {
      title: `Document ${newId}`,
      id: newId,
      content: "",
    };
    setTabs([...tabs, newTab]);
    setActiveTab(newId);
  };

  const closeTab = (id: number) => {
    const newTabs = tabs.filter((tab) => tab.id !== id);
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
    const updatedTabs = tabs.map((tab) =>
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
    const tab = tabs.find((t) => t.id === activeTab);
    if (!tab) return;

    setShowSaveDialog(false);
    try {
      if ("showSaveFilePicker" in window) {
        await saveWithFileSystemAPI(tab);
      } else {
        saveWithDownload(tab);
      }
    } catch (error) {
      console.error("Error saving file locally:", error);
      showToast("Failed to save locally");
    }
  };

  const handleSaveToDB = async () => {
    const tab = tabs.find((t) => t.id === activeTab);
    if (!tab) return;

    setShowSaveDialog(false);
    try {
      await saveFileToDB({
        title: tab.title,
        content: tab.content,
      });
      showToast("File saved to Cloud!");
    } catch (error) {
      console.error("Error saving to Cloud:", error);
      showToast("Failed to save to Cloud");
    }
  };

  const saveWithFileSystemAPI = async (tab: Tab) => {
    try {
      let fileHandle = tab.fileHandle;
  
      if (!fileHandle) {
        fileHandle = await (window as any).showSaveFilePicker({
          suggestedName: `${tab.title}.txt`,
          types: [
            {
              description: "Text Files",
              accept: { "text/plain": [".txt"] },
            },
          ],
        });
      }
  
      if (!fileHandle) throw new Error("No file handle available.");
  
      const writable = await fileHandle.createWritable();
      await writable.write(tab.content);
      await writable.close();
  
      if (!tab.fileHandle) {
        const updatedTabs = tabs.map((t) =>
          t.id === tab.id
            ? { ...t, fileHandle, title: fileHandle!.name.replace(".txt", "") }
            : t
        );
        setTabs(updatedTabs);
      }
  
      showToast("File saved successfully!");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      throw error;
    }
  };
  

  const saveWithDownload = (tab: Tab) => {
    const blob = new Blob([tab.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tab.title}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast("File downloaded!");
  };

  const importFromLocal = async () => {
    try {
      if (!(window as any).showOpenFilePicker) {
        alert(
          "File System Access API not supported in your browser. Try Chrome or Edge."
        );
        return;
      }
  
      const [fileHandle] = await (window as any).showOpenFilePicker({
        types: [
          {
            description: "Text Files",
            accept: { "text/plain": [".txt"] },
          },
        ],
        multiple: false,
      });
  
      const file = await fileHandle.getFile();
      const content = await file.text();
  
      const newId =
        tabs.length > 0 ? Math.max(...tabs.map((tab) => tab.id)) + 1 : 1;
  
      const newTab = {
        title: file.name.replace(".txt", ""),
        id: newId,
        content,
        fileHandle,
      };
  
      setTabs([...tabs, newTab]);
      setActiveTab(newId);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      console.error("Error opening file:", error);
    }
  };
  

  const importFromDB = async () => {
    try {
      const files = await getFiles();
      setDbFiles(files);
      setShowDBFiles(true);
    } catch (error) {
      console.error("Error fetching files:", error);
      showToast("Failed to load files from database");
    }
  };

  const handleFileSelectFromDB = (file: DBFile) => {
    const newId =
      tabs.length > 0 ? Math.max(...tabs.map((tab) => tab.id)) + 1 : 1;
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
    const toast = document.createElement("div");
    toast.className = "toast toast-top toast-center";
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
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        saveCurrentTab();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [saveCurrentTab]);
  // Add these functions to your Home component
  const handleOpenFileStore = async () => {
    try {
      const files = await getStoredFiles();
      setStoredFiles(files);
      setShowFileStore(true);
    } catch (error) {
      console.error("Error fetching stored files:", error);
      showToast("Failed to load stored files");
    }
  };

  const handleOpenFromStore = (content: string, title: string) => {
    const newId =
      tabs.length > 0 ? Math.max(...tabs.map((tab) => tab.id)) + 1 : 1;
    const newTab = {
      title,
      id: newId,
      content,
    };
    setTabs([...tabs, newTab]);
    setActiveTab(newId);
    setShowFileStore(false);
  };

  const handleDeleteFromStore = async (fileId: string) => {
    try {
      await deleteStoredFile(fileId);
      setStoredFiles(storedFiles.filter((file) => file._id !== fileId));
      showToast("File deleted successfully");
    } catch (error) {
      console.error("Error deleting file:", error);
      showToast("Failed to delete file");
    }
  };

  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-base-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col h-screen ${isDarkMode ? "dark" : ""}`}
      data-theme={isDarkMode ? "dark" : "light"}
    >
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
                <Download className="h-5 w-5" />
                Save to Local File
              </button>
              <button
                onClick={handleSaveToDB}
                className="btn btn-secondary w-full flex items-center justify-center gap-2"
              >
                <DownloadCloud className="h-5 w-5" />
                Save to Cloud
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
                <div className="text-center py-4">
                  No files found in database
                </div>
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
        user={user ?? undefined}
        onLogout={handleLogout}
        openFileStore={handleOpenFileStore}
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
        content={activeTabData?.content || ""}
        onChange={handleContentChange}
      />

      <StatusBar
        fileName={activeTabData?.title || "Untitled"}
        isPersisted={!!activeTabData?.fileHandle}
        characterCount={activeTabData?.content.length || 0}
        wordCount={
          activeTabData?.content.trim()
            ? activeTabData.content.trim().split(/\s+/).length
            : 0
        }
        lineCount={activeTabData?.content.split("\n").length || 0}
      />
      {showFileStore && (
        <FileStoreModal
          files={storedFiles}
          onOpen={handleOpenFromStore}
          onDelete={handleDeleteFromStore}
          onClose={() => setShowFileStore(false)}
        />
      )}
    </div>
  );
}
