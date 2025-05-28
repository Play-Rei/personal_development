import React, { useState, useEffect, useRef } from "react";
import Sidebar from "@/features/dashboard/components/Sidebar";
import VocabForm from "@/features/vocabulary/components/VocabForm";
import WordTableComponent from "@/features/vocabulary/components/WordTableComponent";
import type { WordTableHandle } from "@/features/vocabulary/types/types";
import DemoVocabTabBar from "./DemoVocabTabBar";
import { initialTabWordsMap } from "@/features/vocabulary/utils";
import { useTabs } from "@/features/vocabulary/hooks/useTabs";
import { useTabWords } from "@/features/vocabulary/hooks/useTabWords";
import { useAutoSave } from "@/features/vocabulary/hooks/useAutoSave";

const DemoCreateVocabPage = () => {
  const [title, setTitle] = useState("");
  const [noteId] = useState(() => crypto.randomUUID());

  const { tabs, activeTabId, addTab, removeTab, changeActiveTab } = useTabs([
    { id: "tab1", title: "tab1" },
    { id: "tab2", title: "tab2" },
    { id: "tab3", title: "tab3" },
  ]);

  const { tabWords, updateWords } = useTabWords(initialTabWordsMap);

  const { lastSavedAt, setLastSavedAt, relativeTime } = useAutoSave();

  const wordTableRef = useRef<WordTableHandle>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalTitle = title.trim() || "unknown";
    try {
      // Firestoreなど保存処理
    } catch (err) {
      console.error("ノートの保存に失敗しました", err);
    }
    setLastSavedAt(new Date());
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSubmit(new Event("submit") as unknown as React.FormEvent);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [title]);

  return (
    <div className="flex">
      <Sidebar />

      <main className="relative flex-1 p-10 bg-white min-h-screen overflow-y-auto">
        {relativeTime && (
          <div className="absolute top-4 right-6 text-sm text-gray-500 z-10">
            保存済み: {relativeTime}
          </div>
        )}

        <VocabForm title={title} onChange={setTitle} onSubmit={handleSubmit} error={null} />

        <div className="w-full px-18">
          <DemoVocabTabBar
            tabs={tabs}
            activeTabId={activeTabId}
            onTabChange={changeActiveTab}
            onAddTab={addTab}
            onRemoveTab={removeTab}
          />
        </div>

        <div className="w-full px-18">
          {tabs.map((tab) => (
            <div key={tab.id} style={{ display: activeTabId === tab.id ? "block" : "none" }}>
              <WordTableComponent
                ref={activeTabId === tab.id ? wordTableRef : null}
                id={tab.id}
                allWords={tabWords}
                onChange={(newWords) => updateWords(tab.id, newWords)}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default DemoCreateVocabPage;
