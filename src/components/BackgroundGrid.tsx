import React, { useMemo, useRef, useEffect, useCallback } from 'react'; // useRef, useEffect, useCallback を追加
import { sweetImages } from '../data/sweets';

interface BackgroundGridProps {
  className?: string;
}

const BackgroundGrid: React.FC<BackgroundGridProps> = ({ className }) => {
  const numRows = 5;
  const numCols = 4;
  const itemWidth = 240;
  const itemHeight = 320;
  const gapSize = 56;

  // 単一のグリッドのみを表示
  const numberOfClones = 1; 

  // グリッド全体の幅と高さ
  const singleGridHeight = numRows * itemHeight + (numRows - 1) * gapSize;
  const gridContainerWidth = numCols * itemWidth + (numCols - 1) * gapSize;

  // グリッドアイテムのデータを準備
  // sweetImagesの全画像をグリッドに配置
  const items = useMemo(() => {
    const allItems = [];
    // sweetImagesの全19枚の画像をitemsに格納
    for (let i = 0; i < sweetImages.length; i++) {
      const sweet = sweetImages[i];
      allItems.push({
        id: i,
        sweetData: sweet,
      });
    }
    // グリッドのマス数 (numRows * numCols = 20) に合わせて、
    // 画像が足りない場合は最初の画像を繰り返して埋める
    // これにより、灰色のグリッドではなく画像で埋めることができます
    const totalGridCells = numRows * numCols;
    while (allItems.length < totalGridCells) {
      allItems.push({
        id: allItems.length, // ユニークなIDを付与
        sweetData: sweetImages[allItems.length % sweetImages.length],
      });
    }
    return allItems;
  }, [numRows, numCols]);

  // Intersection Observer 用の ref を管理する Map
  const imageRefs = useRef(new Map<string, HTMLImageElement>());

  // Intersection Observer のコールバック関数
  const handleIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // ビューポートに入ったら画像を読み込む
        const img = entry.target as HTMLImageElement;
        if (img && img.dataset.src) {
          img.src = img.dataset.src;
          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
          }
          // 属性を削除して、再度読み込まれないようにする
          img.removeAttribute('data-src');
          img.removeAttribute('data-srcset');
          // Observer から監視を解除 (一度読み込んだら不要)
          (entry.target as any)._observer.unobserve(entry.target); // カスタムプロパティでobserverを保持
        }
      }
    });
  }, []);

  // Intersection Observer の設定とクリーンアップ
  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersect, {
      root: null, // ビューポートをルートとする
      rootMargin: '0px 0px 100px 0px', // ビューポートの100px手前で読み込み開始
      threshold: 0, // わずかでも見えたらコールバック
    });

    // 全ての画像要素を監視対象に追加
    imageRefs.current.forEach(img => {
      if (img) {
        observer.observe(img);
        (img as any)._observer = observer; // observer インスタンスを要素に紐付け
      }
    });

    // クリーンアップ関数
    return () => {
      observer.disconnect(); // コンポーネントがアンマウントされたら監視を停止
    };
  }, [handleIntersect, items]); // items の変更時にも再設定

  return (
    <div className={`fixed inset-0 w-full h-full flex items-center justify-center overflow-hidden perspective-1000 ${className || ''}`}>
      <div
        className="absolute"
        style={{
          width: `${gridContainerWidth}px`,
          height: `${singleGridHeight}px`, 
          transformStyle: 'preserve-3d',
          // 3D変換の適用: 左斜め20度 (Y軸), 後ろ方向45度 (X軸)
          transform: 'rotateY(-20deg) rotateX(-45deg)', 
          // 中央配置のための調整（親のflex-boxと合わせて調整）
          // transform-origin を中央に設定すると、回転の中心が要素の中心になる
          transformOrigin: 'center center',
          // モバイルで画面全体に表示されるように、必要に応じて scale を調整する
          // 例えば、小さく見える場合は scale(1.2) など
          // scale: '1.0', 
        } as React.CSSProperties}
      >
        {/* numberOfClones が1なので、ループは1回のみ */}
        {Array.from({ length: numberOfClones }).map((_, cloneIndex) => (
          <div
            key={cloneIndex}
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${numCols}, ${itemWidth}px)`,
              gridTemplateRows: `repeat(${numRows}, ${itemHeight}px)`,
              gap: `${gapSize}px`,
              marginBottom: '0px', 
            }}
          >
            {items.map(({ id, sweetData }) => (
              <div
                key={`${cloneIndex}-${id}`}
                className={`rounded-lg bg-gray-800 shadow-lg flex items-center justify-center`}
                style={{
                  width: `${itemWidth}px`,
                  height: `${itemHeight}px`,
                }}
              >
                {sweetData && (
                  <picture>
                    <source data-srcset={sweetData.webp} type="image/webp" />
                    <img
                      // 初期 src は透明なGIFプレースホルダー
                      src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" 
                      data-src={sweetData.webp} // 実際のWebPパスをdata-srcに設定
                      alt={sweetData.alt}
                      className="w-full h-full object-cover rounded-lg"
                      // loading="lazy" は Intersection Observer と併用しないため削除
                      decode="async" // <-- この行を追加: 画像のデコードを非同期で行うヒント
                      ref={el => { // img 要素に直接 ref を設定
                        if (el) {
                          imageRefs.current.set(`${cloneIndex}-${id}`, el);
                        } else {
                          imageRefs.current.delete(`${cloneIndex}-${id}`);
                        }
                      }}
                    />
                  </picture>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BackgroundGrid;
