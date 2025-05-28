import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "@/features/dashboard/components/Sidebar";
import Editor from "@/features/notebooks/components/Editor";
type EditorHandle = import("@/features/notebooks/components/Editor").EditorHandle;
import NotebookForm from "@/features/notebooks/components/NotebookForm";
import { useAuth } from "@/contexts/AuthContext";
import { useStats } from "@/contexts/StatsContext";

import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadString } from "firebase/storage";
import { getDownloadURL } from "firebase/storage";
import type { OutputData } from "@editorjs/editorjs";


const EditNotebookPage = () => {
    const { user } = useAuth();
    const { notes } = useStats();
    const { noteId } = useParams<{ noteId: string }>();
    const navigate = useNavigate();
  
    const editorRef = useRef<EditorHandle>(null);
    const [title, setTitle] = useState("");
    const [editorData, setEditorData] = useState<OutputData | undefined>(undefined);
    const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
    const [relativeTime, setRelativeTime] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !noteId || notes.length === 0) return;

    const note = notes.find((n) => n.id === noteId);
    if (!note) {
      console.warn("ノートが見つかりません:", noteId);
      return;
    }

    setTitle(note.title || "");

    if (!note.contentPath) {
      setEditorData(undefined); // 初期化
      return;
    }

    const fetchContent = async () => {
      try {
        const storage = getStorage();
        const storageRef = ref(storage, note.contentPath);
        const url = await getDownloadURL(storageRef);
        const res = await fetch(url);
        const data = await res.json();
        
        setEditorData(data);
      } catch (error) {
        console.error("Cloud Storageからのノートデータ取得に失敗:", error);
      }
    };

    fetchContent();
  }, [user, noteId, notes]);


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

    if (!user || !noteId) return;

    const db = getFirestore();
    const storage = getStorage();

    try {
        const savedData = await editorRef.current?.save();
        if (!savedData) throw new Error("Editorのデータ取得失敗");
  
        const db = getFirestore();
        const storage = getStorage();
        const note = notes.find((n) => n.id === noteId);
        if (!note) throw new Error("ノート情報が見つかりません");
  
        const contentPath = note.contentPath || `notebooks/${user.uid}/${noteId}.json`;
        const storageRef = ref(storage, contentPath);
  
        // Cloud Storageへアップロード
        await uploadString(storageRef, JSON.stringify(savedData), "raw", {
          contentType: "application/json",
        });
  
        // Firestoreにメタ情報保存
        await setDoc(
          doc(db, "users", user.uid, "notes", noteId),
          {
            title: finalTitle,
            updatedAt: serverTimestamp(),
            contentPath,
            isArchived: note.isArchived || false,
          },
          { merge: true }
        );
  
        setLastSavedAt(new Date());
        setRelativeTime("たった今");
        console.log("ノートを保存しました");
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

export default EditNotebookPage;
