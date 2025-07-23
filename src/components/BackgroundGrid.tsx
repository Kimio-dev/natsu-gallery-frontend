import React, { useMemo, useRef, useEffect, useCallback } from 'react';
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

  const singleGridHeight = numRows * itemHeight + (numRows - 1) * gapSize;
  const gridContainerWidth = numCols * itemWidth + (numCols - 1) * gapSize;

  // アニメーションのクローン数を減らす (パフォーマンス改善のため)
  const numberOfClones = 5; // 15 -> 5 に削減
  const animationScrollHeight = singleGridHeight + gapSize; 

  // グリッドアイテムのデータを準備
  const items = useMemo(() => {
    const totalItemsPerGrid = numRows * numCols;
    const allItems = [];
    for (let i = 0; i < totalItemsPerGrid; i++) {
      const sweet = sweetImages[i % sweetImages.length];
      allItems.push({
        id: i,
        sweetData: sweet,
      });
    }
    return allItems;
  }, [numRows, numCols]);

  const baseSpeedPer100Px = 15;
  const animationDuration = `${(animationScrollHeight / 100) * baseSpeedPer100Px}s`; 
  const initialAnimationDelay = `0s`; 

  // Intersection Observer 用の ref を管理する Map
  // 各画像要素に直接 ref を設定するため、Map を使用して動的に管理
  const imageRefs = useRef(new Map<string, HTMLImageElement>());

  // Intersection Observer のコールバック関数
  const handleIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // ビューポートに入ったら画像を読み込む
        const img = entry.target as HTMLImageElement; // entry.target は img 要素
        if (img && img.dataset.src) {
          // src と srcset 属性を data-src/data-srcset からコピー
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
        className="absolute background-grid-animation transform-style-3d"
        style={{
          width: `${gridContainerWidth}px`,
          height: `${(singleGridHeight * numberOfClones) + (gapSize * (numberOfClones - 1))}px`,
          '--animation-duration': animationDuration,
          '--animation-delay': initialAnimationDelay,
          '--scroll-height': `${animationScrollHeight}px`,
          willChange: 'transform',
        } as React.CSSProperties}
      >
        {Array.from({ length: numberOfClones }).map((_, cloneIndex) => (
          <div
            key={cloneIndex}
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${numCols}, ${itemWidth}px)`,
              gridTemplateRows: `repeat(${numRows}, ${itemHeight}px)`,
              gap: `${gapSize}px`,
              marginBottom: cloneIndex < numberOfClones - 1 ? `${gapSize}px` : '0px',
            }}
            // この div には Intersection Observer は不要
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
                    {/* source タグの srcset も data-srcset に変更 */}
                    <source data-srcset={sweetData.webp} type="image/webp" />
                    <img
                      // 初期 src は透明なGIFプレースホルダー
                      src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" 
                      data-src={sweetData.jpg || sweetData.webp} // 実際のJPGまたはWebPパスをdata-srcに設定
                      alt={sweetData.alt}
                      className="w-full h-full object-cover rounded-lg"
                      // loading="lazy" は Intersection Observer と併用しないため削除
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
