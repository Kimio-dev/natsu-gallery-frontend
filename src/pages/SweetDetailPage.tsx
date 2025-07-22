// src/pages/SweetDetailPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom'; // URLパラメータを取得
import SweetDetailSection from '../components/SweetDetailSection';
import { sweetImages } from '../data/sweets'; // sweetImages データをインポート
import Layout from '../components/Layout'; // Layoutコンポーネントをインポート

const SweetDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // URLからIDを取得
  const sweetId = parseInt(id || '0'); // IDを数値に変換

  // 該当する作品データを取得
  const sweet = sweetImages.find(s => s.id === sweetId);

  // 作品が見つからない場合の処理（例: 404ページへリダイレクトなど）
  if (!sweet) {
    return (
      // 作品が見つからない場合もLayoutでラップし、共通の背景を適用
      <Layout>
        <div className="flex flex-col items-center justify-center text-gray-800 flex-grow">
          <p className="text-2xl font-bold">作品が見つかりませんでした。</p>
          <p className="mt-4"><a href="/works" className="text-blue-600 hover:underline">作品紹介ページに戻る</a></p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SweetDetailSection sweet={sweet} />
    </Layout>
  );
};

export default SweetDetailPage;