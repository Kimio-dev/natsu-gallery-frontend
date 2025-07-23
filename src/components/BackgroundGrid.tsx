import React, { useMemo, useRef, useEffect, useCallback, useState } from 'react'; // useState を追加
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
      // rootMargin を大幅に拡大し、ビューポート外の広い範囲で読み込みを開始
      rootMargin: '500px 500px 500px 500px', // 上下左右500px手前で読み込み開始
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
  }, [handleIntersect, items]);

  // 画面幅を監視して、3D変換を適用するかどうかを決定
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

  const transformStyle = isMobile 
    ? 'none' // モバイルでは3D変換を無効化
    : 'rotateY(-20deg) rotateX(45deg)'; // PCでは3D変換を適用

  return (
    <div className={`fixed inset-0 w-full h-full flex items-center justify-center overflow-hidden perspective-1000 ${className || ''}`}>
      <div
        className="absolute"
        style={{
          width: `${gridContainerWidth}px`,
          height: `${singleGridHeight}px`, 
          transformStyle: 'preserve-3d',
          transform: transformStyle, // レスポンシブなtransformを適用
          transformOrigin: 'center center',
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
                      src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" 
                      data-src={sweetData.webp}
                      alt={sweetData.alt}
                      className="w-full h-full object-cover rounded-lg"
                      // loading="eager" を試すことで、Intersection Observer を待たずに即座に読み込みを試みる
                      // ただし、パフォーマンスへの影響が大きい可能性があるので、慎重にテストしてください。
                      // これでもダメなら loading="lazy" に戻すか、カスタムIOのrootMarginをさらに広げる。
                      loading="eager" 
                      decode="async"
                      ref={el => {
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
