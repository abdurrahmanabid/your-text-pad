// components/FileStoreModal.tsx
import { Database, Trash2, X } from 'lucide-react';

interface FileStoreModalProps {
  files: Array<{
    _id: string;
    title: string;
    content: string;
    updatedAt: string;
  }>;
  onOpen: (content: string, title: string) => void;
  onDelete: (fileId: string) => void;
  onClose: () => void;
}

export default function FileStoreModal({ files, onOpen, onDelete, onClose }: FileStoreModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-base-300">
          <div className="flex items-center gap-2">
            <Database size={20} />
            <h3 className="text-lg font-semibold">Your Stored Files</h3>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm">
            <X size={20} />
          </button>
        </div>
        
        <div className="overflow-y-auto flex-1 p-4">
          {files.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No files found in your storage
            </div>
          ) : (
            <div className="space-y-3">
              {files.map((file) => (
                <div 
                  key={file._id} 
                  className="group flex items-center justify-between p-3 border border-base-300 rounded-lg hover:bg-base-200 transition-colors"
                >
                  <div 
                    className="flex-1 cursor-pointer"
                    onClick={() => onOpen(file.content, file.title)}
                  >
                    <div className="font-medium">{file.title}</div>
                    <div className="text-sm text-gray-500">
                      Last updated: {new Date(file.updatedAt).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400 mt-1 truncate">
                      {file.content.substring(0, 100)}{file.content.length > 100 ? '...' : ''}
                    </div>
                  </div>
                  <button
                    onClick={() => onDelete(file._id)}
                    className="btn btn-ghost btn-sm text-error opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Delete file"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-base-300 flex justify-end">
          <button onClick={onClose} className="btn btn-ghost">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}