import React, { useMemo, useState, useEffect } from 'react';
import { sweetImages } from '../data/sweets';

interface BackgroundGridProps {
  className?: string;
}

const BackgroundGrid: React.FC<BackgroundGridProps> = ({ className }) => {
  // 画面幅を監視して、PC/モバイルの分岐を決定
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // 768px (md breakpoint) 未満をモバイルと判断
      setIsMobile(window.innerWidth < 768); 
    };

    checkMobile(); // 初期ロード時にチェック
    window.addEventListener('resize', checkMobile); // リサイズ時にチェック

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // --- PC版の設定 ---
  const pcNumRows = 5;
  const pcNumCols = 4;
  const pcItemWidth = 240;
  const pcItemHeight = 320;
  const pcGapSize = 56;
  const pcNumberOfClones = 15; // PC版は15クローンに戻す
  const pcBaseSpeedPer100Px = 15; // PC版は元の速度に戻す

  const pcSingleGridHeight = pcNumRows * pcItemHeight + (pcNumRows - 1) * pcGapSize;
  const pcGridContainerWidth = pcNumCols * pcItemWidth + (pcNumCols - 1) * pcGapSize;
  const pcAnimationScrollHeight = pcSingleGridHeight + pcGapSize; 
  const pcAnimationDuration = `${(pcAnimationScrollHeight / 100) * pcBaseSpeedPer100Px}s`; 
  const pcInitialAnimationDelay = `0s`; 

  // --- モバイル版の設定 ---
  const mobileNumRows = 3; // 12枚の画像を表示するために調整 (4列 * 3行 = 12)
  const mobileNumCols = 4;
  const mobileItemWidth = 80;  // 横80px
  const mobileItemHeight = 160; // 縦160px
  const mobileGapSize = 24; // モバイル向けにギャップを小さく調整

  const mobileSingleGridHeight = mobileNumRows * mobileItemHeight + (mobileNumRows - 1) * mobileGapSize;
  const mobileGridContainerWidth = mobileNumCols * mobileItemWidth + (mobileNumCols - 1) * mobileGapSize;
  const mobileNumberOfClones = 1; // モバイル版はアニメーションなし、単一グリッド

  // 現在のデバイスに応じた設定を選択
  const currentNumRows = isMobile ? mobileNumRows : pcNumRows;
  const currentNumCols = isMobile ? mobileNumCols : pcNumCols;
  const currentItemWidth = isMobile ? mobileItemWidth : pcItemWidth;
  const currentItemHeight = isMobile ? mobileItemHeight : pcItemHeight;
  const currentGapSize = isMobile ? mobileGapSize : pcGapSize;
  const currentNumberOfClones = isMobile ? mobileNumberOfClones : pcNumberOfClones;

  // グリッドアイテムのデータを準備
  const items = useMemo(() => {
    const allItems = [];
    const imagesToUse = isMobile ? sweetImages.slice(0, 12) : sweetImages; // モバイルは12枚、PCは全画像

    for (let i = 0; i < imagesToUse.length; i++) {
      const sweet = imagesToUse[i];
      allItems.push({
        id: i,
        sweetData: sweet,
      });
    }

    // グリッドのマス数に合わせて画像を繰り返して埋める (モバイル版のみ影響)
    const totalGridCells = currentNumRows * currentNumCols;
    while (allItems.length < totalGridCells) {
      allItems.push({
        id: allItems.length,
        sweetData: imagesToUse[allItems.length % imagesToUse.length],
      });
    }
    return allItems;
  }, [isMobile, currentNumRows, currentNumCols]); // isMobile, currentNumRows, currentNumCols を依存配列に追加

  // メインコンテナのスタイル
  const mainContainerStyle: React.CSSProperties = isMobile ? {
    width: `${mobileGridContainerWidth}px`,
    height: `${mobileSingleGridHeight}px`,
    transformStyle: 'preserve-3d',
    transform: 'rotateY(-20deg) rotateX(45deg)', // モバイル版の3D変換
    transformOrigin: 'center center',
    // モバイルで画面全体に収まるように、必要に応じてscaleを調整
    // 例えば、iPhone SE (375px) で横幅 392px (80*4 + 24*3) は少しはみ出すため、縮小する
    // 画面幅に応じて動的に調整することも可能だが、今回は固定値で試す
    // scale: '0.9', // 必要であれば追加
  } : { // PC版のスタイル
    width: `${pcGridContainerWidth}px`,
    height: `${(pcSingleGridHeight * pcNumberOfClones) + (pcGapSize * (pcNumberOfClones - 1))}px`,
    '--animation-duration': pcAnimationDuration,
    '--animation-delay': pcInitialAnimationDelay,
    '--scroll-height': `${pcAnimationScrollHeight}px`,
    willChange: 'transform',
  } as React.CSSProperties; // 型アサーション

  return (
    <div className={`fixed inset-0 w-full h-full flex items-center justify-center overflow-hidden perspective-1000 ${className || ''}`}>
      <div
        className={`absolute ${!isMobile ? 'background-grid-animation transform-style-3d' : ''}`} // PC版のみアニメーションクラス
        style={mainContainerStyle}
      >
        {Array.from({ length: currentNumberOfClones }).map((_, cloneIndex) => (
          <div
            key={cloneIndex}
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${currentNumCols}, ${currentItemWidth}px)`,
              gridTemplateRows: `repeat(${currentNumRows}, ${currentItemHeight}px)`,
              gap: `${currentGapSize}px`,
              marginBottom: isMobile ? '0px' : (cloneIndex < currentNumberOfClones - 1 ? `${currentGapSize}px` : '0px'),
            }}
          >
            {items.map(({ id, sweetData }) => (
              <div
                key={`${cloneIndex}-${id}`}
                className={`rounded-lg bg-gray-800 shadow-lg flex items-center justify-center`}
                style={{
                  width: `${currentItemWidth}px`,
                  height: `${currentItemHeight}px`,
                }}
              >
                {sweetData && (
                  <picture>
                    <source srcSet={sweetData.webp} type="image/webp" />
                    <img
                      src={sweetData.webp} // 直接webpパスを指定
                      alt={sweetData.alt}
                      className="w-full h-full object-cover rounded-lg"
                      loading={isMobile ? 'eager' : 'lazy'} // モバイルはeager、PCはlazy
                      decode="async" // 非同期デコードは両方で維持
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
