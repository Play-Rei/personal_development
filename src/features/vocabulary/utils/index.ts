export const generateRandomId = (length = 10): string => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      const idx = Math.floor(Math.random() * chars.length);
      result += chars[idx];
    }
    return result;
  };
  
  export const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    if (diffMinutes < 1) return "たった今";
    return `${diffMinutes}分前`;
  };
  
  import type { WordRow } from "../types/types";
  
  export const initialTabWordsMap: Record<string, WordRow[]> = {
    tab1: []
  };
  