import React, { useRef } from "react";

interface Props {
  colIndex: number;
  onResizeMouseDown: (e: React.MouseEvent<HTMLDivElement>, colIndex: number) => void;
}

export const ResizableColumn = ({ colIndex, onResizeMouseDown }: Props) => (
  <div
    className="resize-handle"
    onMouseDown={(e) => onResizeMouseDown(e, colIndex)}
    style={{
      position: "absolute",
      right: 0,
      top: 0,
      height: "100%",
      width: 3,
      cursor: "col-resize",
      userSelect: "none",
      zIndex: 10,
    }}
  />
);
