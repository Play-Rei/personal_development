import { useState } from "react";
import type { WordRow } from "../types/types";

export const useTabWords = (initialData: Record<string, WordRow[]>) => {
  const [tabWords, setTabWords] = useState<Record<string, WordRow[]>>(initialData);

  const updateWords = (tabId: string, newWords: WordRow[]) => {
    setTabWords((prev) => ({ ...prev, [tabId]: newWords }));
  };

  const addTabWords = (tabId: string) => {
    setTabWords((prev) => ({ ...prev, [tabId]: [] }));
  };

  const removeTabWords = (tabId: string) => {
    const { [tabId]: _, ...rest } = tabWords;
    setTabWords(rest);
  };

  return {
    tabWords,
    updateWords,
    addTabWords,
    removeTabWords,
  };
};
