import React, { useMemo } from 'react'; // useRef, useEffect, useCallback を削除
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

  // アニメーションのクローン数は5のまま維持（DOM要素数削減のため）
  const numberOfClones = 1; 
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

  const baseSpeedPer100Px = 25;
  const animationDuration = `${(animationScrollHeight / 100) * baseSpeedPer100Px}s`; 
  const initialAnimationDelay = `0s`; 

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
                    {/* source タグの srcset はそのまま */}
                    <source srcSet={sweetData.webp} type="image/webp" />
                    <img
                      // src を実際のwebpパスに固定 (jpgフォールバックはデータから削除したため)
                      src={sweetData.webp} 
                      alt={sweetData.alt}
                      className="w-full h-full object-cover rounded-lg"
                      loading="lazy" // ネイティブの遅延読み込みを再有効化
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
