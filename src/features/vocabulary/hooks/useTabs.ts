import { useState } from "react";

interface Tab {
  id: string;
  title: string;
}

export function useTabs(initialTabs: Tab[]) {
  const [tabs, setTabs] = useState<Tab[]>(initialTabs);
  const [activeTabId, setActiveTabId] = useState(initialTabs[0]?.id || "");

  const addTab = () => {
    const newId = crypto.randomUUID();
    const newTab = { id: newId, title: `新しいタブ` };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newId); // 追加後、即アクティブに

    
    return newTab;
  };

  const removeTab = (id: string) => {
    setTabs((prev) => prev.filter((tab) => tab.id !== id));
    if (activeTabId === id && tabs.length > 1) {
      const remaining = tabs.filter((tab) => tab.id !== id);
      setActiveTabId(remaining[0].id);
    }
  };

  const changeActiveTab = (id: string) => {
    setActiveTabId(id);
  };

  // タイトル更新用
  const updateTabTitle = (id: string, newTitle: string) => {
    setTabs((prev) =>
      prev.map((tab) => (tab.id === id ? { ...tab, title: newTitle } : tab))
    );
  };

  return {
    tabs,
    activeTabId,
    addTab,
    removeTab,
    changeActiveTab,
    updateTabTitle,
  };
}
