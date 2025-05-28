import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaArchive, FaTrashAlt } from "react-icons/fa";
import { RiSettings3Fill } from "react-icons/ri";
import { useAuth } from "@/contexts/AuthContext";

const Sidebar = () => {

  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  const dashboard_path = user ? "/dashboard" : "/demo";

  return (
    <aside className="bg-gray-100 text-gray-900 w-64 min-h-screen p-6 hidden md:block">
      <h2 className="text-2xl font-bold mb-8">E-Lab</h2>
      <nav className="space-y-4">
        <Link
          to={dashboard_path}
          className={`flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-300 ${
            isActive("/dashboard") ? "bg-gray-300 text-black" : "text-gray-600"
          }`}
        >
          <FaHome />
          <span>ホーム</span>
        </Link>

        <Link
          to="#"
          className={`flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-300 ${
            isActive("/notebooks") ? "bg-gray-300 text-black" : "text-gray-600"
          }`}
        >
          <FaArchive />
          <span>アーカイブ</span>
        </Link>

        <Link
          to="#"
          className={`flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-300 ${
            isActive("/vocab-books") ? "bg-gray-300 text-black" : "text-gray-600"
          }`}
        >
          <RiSettings3Fill />
          <span>設定</span>
        </Link>

        <Link
          to="#"
          className={`flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-300 ${
            isActive("/profile") ? "bg-gray-300 text-black" : "text-gray-600"
          }`}
        >
          <FaTrashAlt />
          <span>ゴミ箱</span>
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
