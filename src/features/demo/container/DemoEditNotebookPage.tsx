import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "@/features/dashboard/components/Sidebar";
import Editor from "@/features/notebooks/components/Editor";
type EditorHandle = import("@/features/notebooks/components/Editor").EditorHandle;
import NotebookForm from "@/features/notebooks/components/NotebookForm";
import { useStats } from "@/contexts/StatsContext";
import type { OutputData } from "@editorjs/editorjs";




type NotebookLocal = {
    id: string;
    title: string;
    isArchived: boolean;
    createdAt: string;
    updatedAt: string;
    content: string;
  };


const DemoEditNotebookPage = () => {
    
    const { noteId } = useParams<{ noteId: string }>();
    const navigate = useNavigate();
  
    const editorRef = useRef<EditorHandle>(null);
    const [title, setTitle] = useState("");
    const [editorData, setEditorData] = useState<OutputData | undefined>(undefined);
    const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
    const [relativeTime, setRelativeTime] = useState<string | null>(null);

  useEffect(() => {
    
    if (!noteId) return;

    const rawNotes = localStorage.getItem("notes");
    if (!rawNotes) return;

    try{
        const notes: NotebookLocal[] = rawNotes ? JSON.parse(rawNotes) : [];
        const note = notes.find((n) => n.id === noteId);

        if (!note) {
            console.warn("ノートが見つかりません:", noteId);
            return;
        }

        setTitle(note.title || "");
        setEditorData(undefined);

        if (!note.content) {
            setEditorData(undefined); // 初期化
            return;
        }

        if (!note.content) {
            setEditorData(undefined);
          } else if (typeof note.content === "string") {
            try {
              const parsed = JSON.parse(note.content);
              setEditorData(parsed as OutputData);
            } catch (e) {
              console.error("content の JSON パースに失敗しました:", e);
              setEditorData(undefined);
            }
          } else {
            // すでに object 型の可能性も考慮
            setEditorData(note.content as OutputData);
          }

    } catch (error) {
        console.error("Cloud Storageからのノートデータ取得に失敗:", error);
    }
  }, [noteId]);


  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);

    if (diffMinutes < 1) return "たった今";
    return `${diffMinutes}分前`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalTitle = title.trim() || "unknown";

    if (!noteId) return;

    try {
        const savedData = await editorRef.current?.save();
    if (!savedData) throw new Error("Editorのデータ取得失敗");

    const rawNotes = localStorage.getItem("notes");
    if (!rawNotes) throw new Error("ローカルノートが存在しません");

    const notes: NotebookLocal[] = JSON.parse(rawNotes);
    const noteIndex = notes.findIndex((n) => n.id === noteId);
    if (noteIndex === -1) throw new Error("保存先のノートが見つかりません");

    const updatedNote: NotebookLocal = {
      ...notes[noteIndex],
      title: finalTitle,
      updatedAt: new Date().toISOString(),
      content: JSON.stringify(savedData),
    };

    const updatedNotes = [...notes];
    updatedNotes[noteIndex] = updatedNote;

    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  
        setLastSavedAt(new Date());
        setRelativeTime("たった今");
        console.log("ノートをローカルに保存しました:", updatedNote);
    } catch (error) {
        console.error("ノート保存に失敗しました:", error);
      }
  };
  // ⌘+S / Ctrl+S で保存
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSubmit(new Event('submit') as unknown as React.FormEvent);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [title]);

  // 保存時刻表示を1分ごとに更新
  useEffect(() => {
    if (!lastSavedAt) return;

    const updateRelativeTime = () => {
      setRelativeTime(formatRelativeTime(lastSavedAt));
    };

    updateRelativeTime(); // 初期化時にすぐ反映
    const interval = setInterval(updateRelativeTime, 60000); // 毎分更新

    return () => clearInterval(interval);
  }, [lastSavedAt]);

  return (
    <div className="flex">
      <Sidebar />

      <main className="relative flex-1 p-10 bg-white min-h-screen overflow-y-auto">
        {/* 保存時刻表示 */}
        {relativeTime && (
          <div className="absolute top-4 right-6 text-sm text-gray-500 z-10">
            保存済み: {relativeTime}
          </div>
        )}

        <NotebookForm
          title={title}
          onChange={setTitle}
          onSubmit={handleSubmit}
          error={null}
        />

        <div className="w-full px-18" key={noteId}>
            {editorData ? (
                <Editor ref={editorRef} initialData={editorData} />
            ) : (
                <p>読み込み中...</p>
            )}
        </div>
      </main>
    </div>
  );
};

export default DemoEditNotebookPage;
