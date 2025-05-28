// src/contexts/StatsContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase"; // firestore 初期化済みインスタンス
import { useAuth } from "./AuthContext";
import type { Notebook } from "@/types/notebook";

type StatsContextType = {
  notesCount: number;
  vocabBooksCount: number;
  notes: Notebook[];
};

const StatsContext = createContext<StatsContextType>({
  notesCount: 0,
  vocabBooksCount: 0,
  notes: [],
});

export const StatsProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [notesCount, setNotesCount] = useState(0);
  const [vocabBooksCount, setVocabBooksCount] = useState(0);
  const [notes, setNotes] = useState<Notebook[]>([]);

  useEffect(() => {
    if (user) {
      const notesRef = collection(db, `users/${user.uid}/notes`);
      const vocabBooksRef = collection(db, `users/${user.uid}/vocab_books`);

      const unsubscribeNotes = onSnapshot(notesRef, (snapshot) => {
        setNotesCount(snapshot.size);
        const notesData: Notebook[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          notesData.push({
            id: doc.id,
            title: data.title,
            contentPath: data.contentPath,
            updatedAt: data.updatedAt,
            createdAt: data.createdAt,
            isArchived: data.isArchived || false,
          });
        });
        setNotes(notesData);
      });

      const unsubscribeVocabBooks = onSnapshot(vocabBooksRef, (snapshot) => {
        setVocabBooksCount(snapshot.size);
      });

      return () => {
        unsubscribeNotes();
        unsubscribeVocabBooks();
      };
    } else {
      // 🔽 ログインしていない場合は localStorage から取得
      const localNotesStr = localStorage.getItem("notes");
      try {
        const localNotes: Notebook[] = localNotesStr ? JSON.parse(localNotesStr) : [];
        setNotes(localNotes);
        setNotesCount(localNotes.length);
      } catch (e) {
        console.error("localStorageからノートを読み込めませんでした", e);
        setNotes([]);
        setNotesCount(0);
      }
    }
  }, [user]);

  return (
    <StatsContext.Provider value={{ notesCount, vocabBooksCount, notes}}>
      {children}
    </StatsContext.Provider>
  );
};

export const useStats = () => useContext(StatsContext);
