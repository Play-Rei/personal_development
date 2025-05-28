// src/features/vocabulary/components/DemoVocabTabBar.tsx
import React, { useState, useEffect } from "react";

type Tab = {
  id: string;
  title: string;
};

type Props = {
  tabs: Tab[];
  activeTabId: string;
  onTabChange: (id: string) => void;
  onAddTab: () => void;
  onRemoveTab: (id: string) => void;
  onUpdateTabTitle: (id: string, newTitle: string) => void;
};

const DemoVocabTabBar: React.FC<Props> = ({ tabs, activeTabId, onTabChange, onAddTab, onRemoveTab, onUpdateTabTitle, }) => {

  // 編集中のタブIDとタイトルを管理
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [tempTitle, setTempTitle] = useState("");

  useEffect(() => {
    if (editingTabId) {
      const currentTab = tabs.find((tab) => tab.id === editingTabId);
      setTempTitle(currentTab?.title || "");
    }
  }, [editingTabId, tabs]);

  const handleDoubleClick = (id: string) => {
    setEditingTabId(id);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempTitle(e.target.value);
  };

  const handleBlur = () => {
    if (editingTabId !== null) {
      onUpdateTabTitle(editingTabId, tempTitle.trim() || "無題");
      setEditingTabId(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleBlur();
    }
  };

  return (
    <div className="flex items-center space-x-2 border-b border-gray-300 mb-4">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`cursor-pointer px-4 py-2 rounded-b-gray text-xs ${
            tab.id === activeTabId
              ? "bg-white border-b-2 border-black font-semibold"
              : "bg-white text-gray-500 font-semibold"
          } flex items-center space-x-1`}
          onClick={() => onTabChange(tab.id)}
          onDoubleClick={() => handleDoubleClick(tab.id)}  // ダブルクリックで編集開始
        >
          {editingTabId === tab.id ? (
            <input
              autoFocus
              value={tempTitle}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="border px-1 py-0.5 text-xs w-24 focus:outline-none focus:ring-none focus:border-none"
              />
          ) : (
            <span>{tab.title || "無題"}</span>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation(); // タブ切り替えを防ぐ
              if (window.confirm(`タブ「${tab.title}」を削除してもよろしいですか？`)) {
                onRemoveTab(tab.id);
              }
            }}
            className="ml-2 text-gray-400 hover:text-red-600 focus:outline-none text-xs"
            aria-label={`Remove tab ${tab.title}`}
            type="button"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        onClick={onAddTab}
        className="ml-2 w-6 h-6 bg-white text-black text-sm rounded hover:bg-gray-200 hover:text-gray-500 flex items-center justify-center"
        >
        ＋
      </button>
    </div>
  );
};

export default DemoVocabTabBar;
