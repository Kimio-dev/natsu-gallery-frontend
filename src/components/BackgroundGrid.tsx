import React, { useMemo } from 'react';
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

  // 単一のグリッドのみを表示するため、クローン数は1に固定
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
    // グリッドが20マスなので、最後の1マスは最初の画像を繰り返すか、空にするか。
    // 今回は、グリッドのサイズに合わせて画像を配置し、余ったマスはそのままにする（背景の灰色グリッドが見える）
    // または、sweetImages.lengthがnumRows * numColsより少ない場合、
    // 残りのマスは表示されないか、またはデフォルトの背景色（bg-gray-800）が表示されます。
    // ここでは、sweetImagesの全画像を使い切るようにします。
    // 必要であれば、グリッドのマス数に合わせて画像を繰り返すことも可能です。
    // 例: for (let i = 0; i < numRows * numCols; i++) { const sweet = sweetImages[i % sweetImages.length]; ... }
    // しかし、ユーザーの要望は「デフォルトで全グリッドを画面に表示」なので、
    // 全てのユニークな画像を一度表示し、余りがあればグリッドの背景色が表示される形が自然です。
    return allItems;
  }, []);

  return (
    // fixed inset-0 w-full h-full flex items-center justify-center overflow-hidden perspective-1000 は維持
    <div className={`fixed inset-0 w-full h-full flex items-center justify-center overflow-hidden perspective-1000 ${className || ''}`}>
      <div
        // アニメーション関連のクラスとスタイルを削除し、3D変換を追加
        className="absolute" // background-grid-animation クラスを削除
        style={{
          width: `${gridContainerWidth}px`,
          // numberOfClones が1なので、単一グリッドの高さ
          height: `${singleGridHeight}px`, 
          transformStyle: 'preserve-3d', // transform-style-3d をスタイルに移動
          // 3D変換の適用: 左斜め20度 (Y軸), 後ろ方向45度 (X軸)
          transform: 'rotateY(-20deg) rotateX(-45deg)', 
          // 画面中央に配置するため、必要に応じて調整
          // top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotateY(-20deg) rotateX(-45deg)',
          // ただし、親のflex-boxで中央寄せされているので、transformのtranslateは不要
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
              // クローンが1つなのでmarginBottomは不要
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
                    {/* source タグの srcset はそのまま */}
                    <source srcSet={sweetData.webp} type="image/webp" />
                    <img
                      // src を実際のwebpパスに固定
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
