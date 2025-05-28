// src/features/dashboard/components/VocabList.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import VocabularyCard from "../components/VocabularyCard";
import { mockVocabBooks } from "../../../mocks/vocabulary_books";
import type { VocabularyBook } from "@/types/vocabulary";
import { TbVocabulary } from "react-icons/tb";
import { useAuth } from "@/contexts/AuthContext";
const VocabList = () => {

    const { user } = useAuth();
    const navigate = useNavigate(); 
    const vocabBooks: VocabularyBook[] = mockVocabBooks;

    const handleAddNotebook = () => {
        if(user)navigate("/vocab/create");  // 新規ノート作成画面へ遷移
        else navigate("/demo_vocab/create");
        
    };

    return (
        <div>
            <h3 className="text-2xl font-semibold mb-4">単語帳一覧</h3>
            <div className="flex overflow-x-auto space-x-4 pb-2">
                <div 
                onClick={handleAddNotebook} 
                className="aspect-[3/4] w-48 bg-white rounded-lg shadow flex flex-col justify-center items-center flex-shrink-0 text-center cursor-pointer hover:bg-gray-100">
                    <div className="flex items-center gap-2 text-gray-600 font-semibold text-sm">
                        <TbVocabulary size={24} />
                        <p>単語帳を追加</p>
                    </div>
                </div>
                {vocabBooks.map((book) => (
                    <VocabularyCard key={book.id} vocabBook={book} />
                ))}
            </div>
        </div>
    );
};

export default VocabList;