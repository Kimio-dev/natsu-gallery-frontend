// src/components/Header.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface NavLinkItem {
  name: string;
  path: string;
}

const NavLinks: React.FC<{ className?: string, onItemClick?: () => void }> = ({ className, onItemClick }) => {
  const links: NavLinkItem[] = [
    { name: '自己紹介', path: '/about' },
    { name: '作品紹介', path: '/works' },
    { name: 'ご依頼の流れ', path: '/order-flow' },
    { name: '問い合わせ', path: '/contact' }
  ];

  return (
    <ul className={className}>
      {links.map((link) => (
        <li key={link.name}>
          <Link
            to={link.path}
            onClick={onItemClick}
            className="block py-2 text-gray-900 hover:text-gray-700 transition-colors duration-300"
          >
            {link.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // ハンバーガーメニューの開閉に応じてbodyのスクロールを制御
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // クリーンアップ関数
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <header className={`
      fixed top-0 left-0 w-full p-4 z-20 flex justify-between items-center
      bg-white shadow-md  // bg-white/70 から bg-white に変更
    `}>
      {/* サイトロゴ/トップページへのリンク */}
      <div className="text-2xl font-bold text-gray-900">
        <Link to="/" className="hover:text-pink-700 transition-colors duration-200">
          NATSU_GALLERY
        </Link>
      </div>

      {/* PC用ナビゲーション (mdスクリーン以上で表示) */}
      <nav className="hidden md:block">
        <NavLinks className="flex items-center space-x-6 text-sm font-medium text-gray-900" />
      </nav>

      {/* ハンバーガーメニューボタン (mdスクリーン未満で表示) */}
      <div className="md:hidden z-50">
        <button onClick={() => setIsOpen(!isOpen)} className="relative text-gray-900">
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
          )}
        </button>
      </div>
      
      {/* スマホ用メニュー (開閉) */}
      {isOpen && (
        <div 
          className={`
            md:hidden fixed top-0 left-0 w-full h-full z-40
            bg-gray-500/50 backdrop-blur-sm // スマホメニュー側はブラーを維持（問題なければ）
            transition-opacity duration-300 ease-in-out
            ${
              isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }
          `}
        >
          <nav className="flex items-center justify-center h-full">
            <NavLinks className="text-center space-y-4 text-lg text-white" onItemClick={() => setIsOpen(false)}/>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;