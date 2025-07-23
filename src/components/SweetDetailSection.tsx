// src/components/SweetDetailSection.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import type { SweetImage } from '../data/sweets';

interface SweetDetailSectionProps {
  sweet: SweetImage;
}

const SweetDetailSection: React.FC<SweetDetailSectionProps> = ({ sweet }) => {
  return (
    <section className="container mx-auto px-4 py-8 mt-16 md:mt-24 text-gray-800">
      {/* 全体を中央寄せし、左右にコンテンツを配置するコンテナ */}
      <div className="max-w-5xl mx-auto bg-white bg-opacity-70 rounded-lg shadow-xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start md:space-x-12">
        {/* 左側: 作品写真 */}
        <div className="flex-shrink-0 mb-8 md:mb-0 w-full md:w-1/2 flex justify-center">
          <div className="w-full max-w-sm aspect-w-3 aspect-h-4 overflow-hidden rounded-lg shadow-md">
            <picture>
              {sweet.webp && <source srcSet={sweet.webp} type="image/webp" />}
              <img
                src={sweet.webp}
                alt={sweet.alt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </picture>
          </div>
        </div>

        {/* 右側: 作品詳細情報 */}
        <div className="flex-grow w-full md:w-1/2">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center md:text-left">{sweet.name}</h1>
          <p className="text-lg mb-2"><strong className="font-semibold">作成時間:</strong> {sweet.createdAt}</p>
          <p className="text-lg mb-4"><strong className="font-semibold">難易度:</strong> {sweet.difficulty}</p>

          {/* 材料 */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">材料</h2>
            <ul className="list-disc list-inside text-base leading-relaxed">
              {sweet.ingredients.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          {/* 作成工程 */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-2">作成工程</h2>
            {/* olタグからリストスタイルを削除し、liでflexboxを使用 */}
            <ol className="text-base leading-relaxed"> {/* ここを修正: list-decimal list-outside を削除 */}
              {sweet.process.map((step: string, index: number) => (
                <li key={index} className="mb-1 flex items-start text-base md:text-lg"> {/* ここを修正 */}
                  {/* ナンバー表示用のspan */}
                  <span className="flex-shrink-0 pr-2"> {/* 数字とテキストの間隔を調整 */}
                    {index + 1}.
                  </span>
                  {/* テキスト内容用のspan */}
                  <span className="flex-grow">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* 作品紹介ページに戻るボタン */}
          <div className="text-center md:text-left">
            <Link
              to="/works"
              className="inline-block bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 shadow-md"
            >
              作品紹介ページに戻る
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SweetDetailSection;