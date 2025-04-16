interface EditorProps {
    content: string;
    onChange: (content: string) => void;
  }
  
  export default function Editor({ content, onChange }: EditorProps) {
    return (
      <textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        className="flex-grow textarea textarea-ghost p-4 resize-none w-full focus:outline-none font-mono text-base"
        placeholder="Start typing..."
        spellCheck="false"
      />
    );
  }