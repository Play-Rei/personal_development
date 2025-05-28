// src/features/vocabulary/components/DemoVocabTabBar.tsx
import React from "react";

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
};

const DemoVocabTabBar: React.FC<Props> = ({ tabs, activeTabId, onTabChange, onAddTab, onRemoveTab }) => {
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
        >
          <span>{tab.title || "無題"}</span>
        </div>
      ))}
    </div>
  );
};

export default DemoVocabTabBar;
