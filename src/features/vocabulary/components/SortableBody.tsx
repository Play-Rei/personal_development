import React, { useEffect, useRef } from "react";
import Sortable from "sortablejs";
import type { WordRow } from "../types/types";

interface Props {
  words: WordRow[];
  onSortEnd: (oldIndex: number, newIndex: number) => void;
  children: React.ReactNode;
}

export const SortableBody = ({ words, onSortEnd, children }: Props) => {
  const tbodyRef = useRef<HTMLTableSectionElement>(null);

  useEffect(() => {
    if (!tbodyRef.current) return;

    const sortable = Sortable.create(tbodyRef.current, {
      animation: 150,
      handle: ".drag-handle",
      ghostClass: "bg-gray-100",
      onEnd: (evt) => {
        const { oldIndex, newIndex } = evt;
        if (
          oldIndex == null ||
          newIndex == null ||
          oldIndex === newIndex ||
          oldIndex >= words.length ||
          newIndex >= words.length 
        ) return;
        onSortEnd(oldIndex, newIndex);
      },
      scroll: true,
      scrollSensitivity: 50,
      scrollSpeed: 10,
    });

    return () => sortable.destroy();
  }, [words, onSortEnd]);

  return <tbody ref={tbodyRef}>{children}</tbody>;
};
