// src/shared/components/Header.tsx
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase';
import { useNavigate } from 'react-router-dom';

const Header = () => {

  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('ログアウトに失敗しました:', error);
    }
  };

  return (
    <header className="bg-white text-black p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* ロゴ */}
        <div className="text-2xl font-bold">
          <a href="/">E-Lab</a>
        </div>

        <nav className="space-x-4 hidden md:flex">
          {!user ? (
            <>
              <a href="/login" className="hover:bg-gray-100 text-xs rounded px-4 py-2">ログイン</a>
              <a href="/sign_up" className="bg-black text-white text-xs rounded px-4 py-2">無料で始める</a>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white text-xs rounded px-4 py-2 hover:bg-red-600 transition"
            >
              ログアウト
            </button>
          )}
        </nav>

        {/* モバイル用ハンバーガーメニュー（簡易版） */}
        <div className="md:hidden">
          <button className="text-white">
            <span className="material-icons">menu</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
