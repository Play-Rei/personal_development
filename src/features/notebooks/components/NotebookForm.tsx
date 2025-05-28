// components/NotebookForm.tsx
import React, { useEffect, useRef } from "react";

interface Props {
  title: string;
  onChange: (title: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  error?: string | null;
}

const NotebookForm: React.FC<Props> = ({ title, onChange, onSubmit, error }) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // 自動高さ調整
  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const autoResize = () => {
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
      };

      autoResize();
      textarea.addEventListener("input", autoResize);

      return () => {
        textarea.removeEventListener("input", autoResize);
      };
    }
  }, []);

  return (
    <form onSubmit={onSubmit} className="mb-0">
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="px-21">
        <label htmlFor="title" className="sr-only">
            タイトル
        </label>
        <textarea
          id="title"
          name="title"
          ref={textareaRef}
          className="mt-1 block w-full pt-2 border border-transparent rounded-md text-3xl focus:outline-none focus:ring-0 font-bold resize-none"
          placeholder="タイトル"
          value={title}
          onChange={(e) => onChange(e.target.value)}
          style={{
            minHeight: '50px', // 最小の高さを指定
            overflow: 'hidden', // 余分なスクロールバーを非表示に
          }}
        />
      </div>
    </form>
  );
};

export default NotebookForm;
