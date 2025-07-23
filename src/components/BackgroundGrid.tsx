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
  const mobileNumRows = 5; // 20枚の画像を表示するために調整 (4列 * 5行 = 20)
  const mobileNumCols = 4;
  const mobileItemWidth = 80;  // 横80px
  const mobileItemHeight = 240; // 縦240px
  const mobileGapSize = 16; // モバイル向けにギャップを小さく調整

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
    // モバイルもPCも全画像（19枚 + 1繰り返し）
    const imagesToUse = sweetImages; 

    for (let i = 0; i < imagesToUse.length; i++) {
      const sweet = imagesToUse[i];
      allItems.push({
        id: i,
        sweetData: sweet,
      });
    }

    // グリッドのマス数に合わせて画像を繰り返して埋める
    const totalGridCells = currentNumRows * currentNumCols;
    while (allItems.length < totalGridCells) {
      allItems.push({
        id: allItems.length,
        sweetData: imagesToUse[allItems.length % imagesToUse.length],
      });
    }
    return allItems;
  }, [isMobile, currentNumRows, currentNumCols]);

  // メインコンテナのスタイル
  const mainContainerStyle: React.CSSProperties = isMobile ? {
    width: `${mobileGridContainerWidth}px`,
    height: `${mobileSingleGridHeight}px`,
    transformStyle: 'preserve-3d',
    transform: 'rotateY(-20deg) rotateX(45deg)', // モバイル版の3D変換
    transformOrigin: 'center center',
    // モバイルで画面全体に収まるように、必要に応じてscaleを調整
    // 例えば、iPhone SE (375px) で横幅 368px (80*4 + 16*3) は収まるはず
    // scale: '0.95', // 必要であれば追加
  } : { // PC版のスタイル
    width: `${pcGridContainerWidth}px`,
    height: `${(pcSingleGridHeight * pcNumberOfClones) + (pcGapSize * (pcNumberOfClones - 1))}px`,
    '--animation-duration': pcAnimationDuration,
    '--animation-delay': pcInitialAnimationDelay,
    '--scroll-height': `${pcAnimationScrollHeight}px`,
    willChange: 'transform',
  } as React.CSSProperties;

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
                // ここが重要: 画像が読み込まれるまで親divの背景色を表示し、画像とdivのサイズを合わせる
                // モバイル版では背景画像として設定し、imgタグは使用しない
                className={`rounded-lg shadow-lg flex items-center justify-center`}
                style={{
                  width: `${currentItemWidth}px`,
                  height: `${currentItemHeight}px`,
                  // モバイル版のみ背景画像として設定
                  backgroundImage: isMobile ? `url(${sweetData.webp})` : 'none',
                  backgroundSize: 'cover', // divいっぱいに画像を拡大縮小
                  backgroundPosition: 'center', // 画像を中央に配置
                  backgroundRepeat: 'no-repeat', // 画像を繰り返さない
                  backgroundColor: isMobile ? 'transparent' : 'bg-gray-800', // モバイルでは背景色を透明に
                } as React.CSSProperties}
              >
                {!isMobile && sweetData && ( // PC版のみimgタグを使用
                  <picture>
                    <source srcSet={sweetData.webp} type="image/webp" />
                    <img
                      src={sweetData.webp} // 直接webpパスを指定
                      alt={sweetData.alt}
                      className="w-full h-full object-cover rounded-lg"
                      loading="lazy" // PC版はlazy
                      decode="async" // 非同期デコードは両方で維持
                    />
                  </picture>
                )}
                {isMobile && ( // モバイル版で画像読み込み失敗時のaltテキスト表示を防ぐため、imgタグを削除
                  // 画像が背景画像として設定されるため、altテキストは表示されません。
                  // 必要であれば、アクセシビリティのためにaria-labelなどをdivに追加することを検討してください。
                  <div className="sr-only">{sweetData.alt}</div> // スクリーンリーダー向けにaltテキストを保持
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
