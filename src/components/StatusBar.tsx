interface StatusBarProps {
    fileName: string;
    isPersisted: boolean;
    characterCount: number;
    wordCount: number;
    lineCount: number;
  }
  
  export default function StatusBar({
    fileName,
    isPersisted,
    characterCount,
    wordCount,
    lineCount,
  }: StatusBarProps) {
    return (
      <div className="flex justify-between items-center px-4 py-2 bg-base-200 text-sm">
        <div className="flex items-center">
          <span className="mr-4">{fileName}</span>
          {isPersisted && (
            <span className="text-xs opacity-70">Saved to disk</span>
          )}
        </div>
        <div>
          <span className="mr-4">Chars: {characterCount}</span>
          <span className="mr-4">Words: {wordCount}</span>
          <span>Lines: {lineCount}</span>
        </div>
      </div>
    );
  }