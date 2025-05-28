// src/shared/components/Header.tsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white text-black text-left p-6 mt-auto shadow-inner">
        <div className="flex flex-col md:flex-row md:items-start md:justify-start md:gap-x-12 text-center md:text-left space-y-4 md:space-y-0">
        
            {/* 左側（ロゴとコピーライト） */}
            <div className="md:pl-10">
                <div className="text-2xl font-bold mb-2">E-Lab</div>
                <div className="text-xs opacity-70">&copy; 2025 Rei Hamakawa. All rights reserved.</div>
            </div>

            {/* 右側（リンクリスト） */}
            <div className="flex flex-col items-start gap-2 pt-1">
                <a href="/" className="text-xs hover:underline">E-Labについて</a>
                <a href="/" className="text-xs hover:underline">iOSアプリ</a>
                <a href="/" className="text-xs hover:underline">利用規約とプライバシーポリシー</a>
            </div>
    
        </div>
    </footer>

  );
};

export default Footer;
