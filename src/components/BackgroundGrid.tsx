// src/components/BackgroundGrid.tsx
import React, { useMemo } from 'react'; // Reactをインポート
import { sweetImages } from '../data/sweets'; // 新しく作成した画像データをインポート

// Propsの型定義を追加
interface BackgroundGridProps {
  className?: string; // className をオプションとして受け取る
}

const BackgroundGrid: React.FC<BackgroundGridProps> = ({ className }) => { // className を受け取る
  const numRows = 5;
  const numCols = 4;
  const itemWidth = 240;    // 各グリッドアイテムの幅 (px)
  const itemHeight = 320;   // 各グリッドアイテムの高さ (px)
  const gapSize = 56;     // アイテム間の余白 (px)

  const singleGridHeight = numRows * itemHeight + (numRows - 1) * gapSize;
  const gridContainerWidth = numCols * itemWidth + (numCols - 1) * gapSize;

  const numberOfClones = 15; // 適切な値に調整してください (例: 10〜20)
  const animationScrollHeight = singleGridHeight + gapSize; 

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

  const baseSpeedPer100Px = 15; // 適切な値に調整してください
  const animationDuration = `${(animationScrollHeight / 100) * baseSpeedPer100Px}s`; 
  const initialAnimationDelay = `0s`; 

  return (
    // 受け取ったclassNameを最外層のdivに適用します
    // z-index (-z-10) もclassNameから渡されるようにするため、ここからは削除
    <div className={`fixed inset-0 w-full h-full flex items-center justify-center overflow-hidden perspective-1000 ${className || ''}`}>
      <div
        className="absolute background-grid-animation transform-style-3d"
        style={{
          width: `${gridContainerWidth}px`,
          height: `${(singleGridHeight * numberOfClones) + (gapSize * (numberOfClones - 1))}px`,
          '--animation-duration': animationDuration,
          '--animation-delay': initialAnimationDelay,
          '--scroll-height': `${animationScrollHeight}px`,
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
                    <source srcSet={sweetData.webp} type="image/webp" />
                    <img
                      src={sweetData.jpg || sweetData.webp}
                      alt={sweetData.alt}
                      className="w-full h-full object-cover rounded-lg"
                      loading="lazy"
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