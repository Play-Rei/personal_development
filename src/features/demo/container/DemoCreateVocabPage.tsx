import React, { useState, useEffect } from "react";
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

  const { tabs, activeTabId, addTab, removeTab, changeActiveTab, updateTabTitle } = useTabs([
    { id: "tab1", title: "新しいタブ" },
  ]);

  const { tabWords, updateWords, addTabWords, removeTabWords } = useTabWords(initialTabWordsMap);

  const { lastSavedAt, setLastSavedAt, relativeTime } = useAutoSave();

  // tableRefsをuseStateで管理し、tabsの変化に追従させる
  const [tableRefs, setTableRefs] = useState<Record<string, React.RefObject<WordTableHandle | null>>>(() =>
    Object.fromEntries(tabs.map(tab => [tab.id, React.createRef<WordTableHandle>()]))
  );

  useEffect(() => {
    setTableRefs(prev => {
      const newRefs = { ...prev };
      // 新しいタブがあったらrefを追加
      tabs.forEach(tab => {
        if (!newRefs[tab.id]) {
          newRefs[tab.id] = React.createRef<WordTableHandle>();
        }
      });
      // 削除されたタブのrefは削除
      Object.keys(newRefs).forEach(key => {
        if (!tabs.find(tab => tab.id === key)) {
          delete newRefs[key];
        }
      });
      return newRefs;
    });
  }, [tabs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalTitle = title.trim() || "unknown";

    try {
      console.log("🔸保存開始:", finalTitle);

      // すべてのタブのテーブルデータを取得・出力
      for (const tab of tabs) {
        const ref = tableRefs[tab.id];
        const data = ref?.current?.getSaveData();
        console.log(`📘 タブ: ${tab.title}`);
        console.log(data?.blocks[0].data.words ?? []);
      }

      // ここにFirestoreなどの保存処理を書く

      setLastSavedAt(new Date());
    } catch (err) {
      console.error("ノートの保存に失敗しました", err);
    }
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
  }, [title, tabs, tableRefs]);

  const handleAddTab = () => {
    const newTab = addTab();
    addTabWords(newTab.id);
    // 新しいtabのrefはuseEffectで追加されるのでここでは不要
  };

  const handleRemoveTab = (tabId: string) => {
    removeTab(tabId);
    removeTabWords(tabId);
  };

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
            onAddTab={handleAddTab}
            onRemoveTab={handleRemoveTab}
            onUpdateTabTitle={updateTabTitle}
          />
        </div>

        <div className="w-full px-18">
          {tabs.map((tab) => (
            <div key={tab.id} style={{ display: activeTabId === tab.id ? "block" : "none" }}>
              <WordTableComponent
                ref={tableRefs[tab.id]}
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
