import { useState } from "react";

export interface Tab {
  id: string;
  title: string;
}

export const useTabs = (initialTabs: Tab[]) => {
  const [tabs, setTabs] = useState<Tab[]>(initialTabs);
  const [activeTabId, setActiveTabId] = useState<string>(initialTabs[0]?.id ?? "");

  const addTab = () => {
    const newId = crypto.randomUUID();
    setTabs((prev) => [...prev, { id: newId, title: `tab${prev.length + 1}` }]);
    setActiveTabId(newId);
  };

  const removeTab = (id: string) => {
    setTabs((prev) => prev.filter((tab) => tab.id !== id));
    if (activeTabId === id) {
      const remainingTabs = tabs.filter((tab) => tab.id !== id);
      setActiveTabId(remainingTabs.length > 0 ? remainingTabs[0].id : "");
    }
  };

  const changeActiveTab = (id: string) => {
    setActiveTabId(id);
  };

  return { tabs, activeTabId, addTab, removeTab, changeActiveTab };
};
