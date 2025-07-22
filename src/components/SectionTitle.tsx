// src/components/SectionTitle.tsx
import React, { useRef, useEffect} from 'react';

interface SectionTitleProps {
  title: string; // 各ページに合わせて変更するタイトルを受け取る
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title }) => {
  const titleRef = useRef<HTMLHeadingElement>(null); // h1要素への参照
  const containerRef = useRef<HTMLDivElement>(null); // コンテナdivへの参照

  useEffect(() => {
    // h1要素の幅を測定し、CSS変数に設定
    const updateTitleWidth = () => {
      if (titleRef.current && containerRef.current) {
        const h1Width = titleRef.current.offsetWidth;
        const halfWidth = h1Width / 2;
        // 親のコンテナにCSSカスタムプロパティとして設定
        containerRef.current.style.setProperty('--title-half-width', `${halfWidth}px`);
      }
    };

    // コンポーネントマウント時とウィンドウリサイズ時に実行
    updateTitleWidth();
    window.addEventListener('resize', updateTitleWidth);

    // クリーンアップ
    return () => {
      window.removeEventListener('resize', updateTitleWidth);
    };
  }, [title]); // title が変更された場合も再計算

  return (
    <div
      ref={containerRef} // ここに ref を追加
      className="relative text-center mb-12 overflow-hidden py-4 md:py-6"
    >
      {/* 左リボン */}
      <div className="ribbon-left absolute top-0 left-0 h-full"></div>
      {/* 右リボン */}
      <div className="ribbon-right absolute top-0 right-0 h-full"></div>

      {/* タイトル */}
      <h1
        ref={titleRef} // ここに ref を追加
        className="relative z-10 text-4xl md:text-5xl font-bold inline-block px-2 py-1 text-white"
      >
        {title} {/* propsで受け取ったタイトルを表示 */}
      </h1>
    </div>
  );
};

export default SectionTitle;