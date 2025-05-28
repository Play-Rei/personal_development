import { useState } from "react";
import type { WordRow } from "../types/types";

export const useTabWords = (initialData: Record<string, WordRow[]>) => {
  const [tabWords, setTabWords] = useState<Record<string, WordRow[]>>(initialData);

  const updateWords = (tabId: string, newWords: WordRow[]) => {
    setTabWords((prev) => ({ ...prev, [tabId]: newWords }));
  };

  return { tabWords, updateWords };
};
