// src/features/dashboard/components/NotesList.tsx
import React from "react";
import NotebookCard from "./NotebookCard";
import type { Notebook } from "@/types/notebook";
import { LuNotebookPen } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useStats } from "@/contexts/StatsContext";
import { useAuth } from "@/contexts/AuthContext";

const NotesList = () => {

    const navigate = useNavigate();  // navigate関数を使用
    const { user } = useAuth();

    const { notes } = useStats();
    const activeNotes: Notebook[] = notes.filter((note) => !note.isArchived);

    const handleAddNotebook = () => {
        if(user)navigate("/notebooks/create");  // 新規ノート作成画面へ遷移
        else navigate("/demo_notebooks/create");
    };

    return (
        <div>
            <h3 className="text-2xl font-semibold mb-4">ノートブック一覧</h3>
            <div className="flex overflow-x-auto space-x-4 pb-2">
                <div 
                onClick={handleAddNotebook}  // クリック時に遷移
                className="aspect-[3/4] w-48 bg-white rounded-lg shadow flex flex-col justify-center items-center flex-shrink-0 text-center cursor-pointer hover:bg-gray-100">
                        <div className="flex items-center gap-2 text-gray-600 font-semibold text-sm">
                            <LuNotebookPen size={24} />
                            <p>ノートブックを追加</p>
                        </div>
                    </div>
                {activeNotes.map((notebook: Notebook) => (
                    <NotebookCard key={notebook.id} notebook={notebook} />
                ))}
            </div>
        </div>
      );
}
export default NotesList;
