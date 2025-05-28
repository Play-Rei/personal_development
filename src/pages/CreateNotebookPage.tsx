import React, { useState, useEffect, useRef } from "react";
import Sidebar from "@/features/dashboard/components/Sidebar";
import Editor from "@/features/notebooks/components/Editor";
type EditorHandle = import("@/features/notebooks/components/Editor").EditorHandle;
import NotebookForm from "@/features/notebooks/components/NotebookForm";
import { useAuth } from "@/contexts/AuthContext";

import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadString } from "firebase/storage";


const CreateNotebookPage = () => {
  const { user } = useAuth(); 
  const [title, setTitle] = useState("");
  const [noteId] = useState(() => crypto.randomUUID());

  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [relativeTime, setRelativeTime] = useState<string | null>(null);
  //const navigate = useNavigate();
  const editorRef = useRef<EditorHandle>(null);
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

    if (!user) return;

    const db = getFirestore();
    const storage = getStorage();
    //const noteId = crypto.randomUUID();

    try {
      const editorData = await editorRef.current?.save(); // 🔥 ココで内容取得

      // Cloud Stotrageへ保存
      const contentPath = `notebooks/${user.uid}/${noteId}.json`;
      const storageRef = ref(storage, contentPath);
      await uploadString(storageRef, JSON.stringify(editorData), "raw", {
        contentType: "application/json",
      });

      // Firestore にメタデータを保存
      await setDoc(doc(db, "users", user.uid, "notes", noteId), {
        title: finalTitle,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        contentPath,
        isArchived: false,
      });
  

      // Firestore や Cloud Storage に保存する処理...
    } catch (err) {
      console.error("ノートの保存に失敗しました", err);
    }

    console.log("ノート保存成功");
    console.log("ノート作成:", { title: finalTitle });

    setLastSavedAt(new Date());
    setRelativeTime("たった今");

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

        <div className="w-full px-18">
          <Editor ref={editorRef} />
        </div>
      </main>
    </div>
  );
};

export default CreateNotebookPage;
