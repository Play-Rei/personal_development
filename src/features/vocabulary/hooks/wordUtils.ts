export const generateId = (): string => `${Date.now()}-${Math.random()}`;

import type { WordRow } from "../types/types";

export const getInitialWords = (
  allWords: Record<string, WordRow[]>,
  id: string,
  initialWords: WordRow[]
): WordRow[] => {
  if (allWords[id]?.length) {
    return allWords[id].map(row => ({
      ...row,
      id: row.id ?? generateId(),
    }));
  }
  if (initialWords.length) {
    return initialWords.map(row => ({
      ...row,
      id: row.id ?? generateId(),
    }));
  }
  return [{
    id: generateId(),
    isChecked: false,
    word: "",
    meaning: "",
    partOfSpeech: "",
    exampleSentence: "",
    exampleTranslation: "",
  }];
};
