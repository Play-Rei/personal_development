import { useState, useRef, useEffect } from "react";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdMore } from "react-icons/io";
import { FiArchive, FiEdit, FiTrash2 } from "react-icons/fi";
import type { Notebook } from "@/types/notebook";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  notebook: Notebook;
}

const NotebookCard: FC<Props> = ({ notebook }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const handleClick = () => {
    if(user)navigate(`/notebooks/edit/${notebook.id}`);
    else navigate(`/demo_notebooks/edit/${notebook.id}`);
  };

  const formatCreatedAt = (createdAt: any): string => {
    try {
      if (createdAt?.toDate) {
        // Firestore Timestamp
        return createdAt.toDate().toLocaleString();
      } else if (typeof createdAt === "string" || createdAt instanceof Date) {
        // ISO文字列またはDate
        return new Date(createdAt).toLocaleString();
      }
    } catch (err) {
      console.error("作成日のフォーマットに失敗しました:", err);
    }
    return "不明";
  };

  // 外側クリックでメニューを閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="aspect-[3/4] w-48 bg-white rounded-lg shadow flex flex-col justify-between flex-shrink-0 cursor-pointer">
      {/* 上半分 */}
      <div className="h-36 bg-gray-200 rounded-t-lg relative" onClick={handleClick}>
        {/* アイコン */}
        <div
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 z-10"
          onClick={(e) => {
            e.stopPropagation(); // 親カードへの click を防ぐ
            setMenuOpen(!menuOpen);
          }}
        >
          <IoMdMore size={20} />
        </div>

        {/* メニュー */}
        {menuOpen && (
          <div
            ref={menuRef}
            className="absolute top-8 right-2 bg-white border border-gray-300 rounded-lg z-20 w-32"
            onClick={(e) => e.stopPropagation()} // メニュー内クリックで閉じない
          >
            <button
              className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-lg"
              onClick={() => {
                setMenuOpen(false);
                navigate(`/notebooks/edit/${notebook.id}`);
              }}
            >
              <FiEdit className="text-gray-600" />
              編集
            </button>
            <button
              className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-lg"
              onClick={() => {
                setMenuOpen(false);
                alert("アーカイブ機能は未実装です");
              }}
            >
              <FiArchive className="text-gray-600" />
              アーカイブ
            </button>
            <button
              className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 rounded-lg"
              onClick={() => {
                setMenuOpen(false);
                alert("削除機能は未実装です");
              }}
            >
              <FiTrash2 className="text-red-500" />
              削除
            </button>
          </div>
        )}
      </div>

      {/* 下半分 */}
      <div>
        <h4 className="text-sm font-semibold truncate px-2 pt-2">{notebook.title}</h4>
        <p className="text-xs text-gray-500 px-2">
            作成日: {formatCreatedAt(notebook.createdAt)}
        </p>
      </div>
      <div className="flex-1" />
    </div>
  );
};

export default NotebookCard;
