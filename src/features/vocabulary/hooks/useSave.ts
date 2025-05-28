// useSave.ts
import { useState, useEffect } from "react";

export function useSave(title: string, onSave: (title: string) => Promise<void>) {
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [relativeTime, setRelativeTime] = useState<string | null>(null);

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);

    if (diffMinutes < 1) return "たった今";
    return `${diffMinutes}分前`;
  };

  const save = async () => {
    const finalTitle = title.trim() || "unknown";
    try {
      await onSave(finalTitle);
      setLastSavedAt(new Date());
      setRelativeTime("たった今");
      console.log("ノート保存成功:", finalTitle);
    } catch (err) {
      console.error("ノートの保存に失敗しました", err);
    }
  };

  // Ctrl+S / Cmd+Sで保存
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        save();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [title]);

  // relativeTimeを1分毎に更新
  useEffect(() => {
    if (!lastSavedAt) return;
    const updateRelativeTime = () => setRelativeTime(formatRelativeTime(lastSavedAt));
    updateRelativeTime();
    const id = setInterval(updateRelativeTime, 60000);
    return () => clearInterval(id);
  }, [lastSavedAt]);

  return { lastSavedAt, relativeTime, save };
}
