import { useState, useEffect } from "react";
import { formatRelativeTime } from "../utils";

export const useAutoSave = () => {
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [relativeTime, setRelativeTime] = useState<string | null>(null);

  useEffect(() => {
    if (!lastSavedAt) return;

    const updateRelativeTime = () => setRelativeTime(formatRelativeTime(lastSavedAt));
    updateRelativeTime();

    const interval = setInterval(updateRelativeTime, 60000);
    return () => clearInterval(interval);
  }, [lastSavedAt]);

  return { lastSavedAt, setLastSavedAt, relativeTime };
};
