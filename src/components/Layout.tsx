// src/components/Layout.tsx
import React from 'react';
import type { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showFooter = true }) => {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: '#F7F0DC', // 古紙のベースカラー
        backgroundImage: `
          /* === レイヤー1: 全体的な非常に薄いノイズ/繊維感 (最も細かい) === */
          radial-gradient(circle at 50% 50%, rgba(0,0,0,0.01) 0%, transparent 1%),
          radial-gradient(circle at 20% 80%, rgba(255,255,255,0.015) 0%, transparent 2%),
          radial-gradient(circle at 80% 20%, rgba(0,0,0,0.015) 0%, transparent 2%),
          
          /* === レイヤー2: 非常に薄く、ランダムな折り目線 === */
          linear-gradient(135deg, rgba(0,0,0,0.02) 0%, transparent 1px, transparent 99%, rgba(0,0,0,0.02) 100%),
          linear-gradient(45deg, rgba(0,0,0,0.02) 0%, transparent 1px, transparent 99%, rgba(0,0,0,0.02) 100%),
          linear-gradient(to right, rgba(0,0,0,0.015) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(0,0,0,0.015) 1px, transparent 1px),

          /* === レイヤー3: ぼんやりとした、より大きなシワの影 (奥行き感) === */
          radial-gradient(ellipse at 70% 30%, rgba(0,0,0,0.08) 0%, transparent 60%),
          radial-gradient(ellipse at 30% 70%, rgba(255,255,255,0.05) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(0,0,0,0.06) 0%, transparent 80%),
          
          /* === レイヤー4: ランダムな斑点や汚れ (経年劣化) === */
          radial-gradient(circle at 10% 10%, rgba(50,40,30,0.03) 0%, transparent 30%),
          radial-gradient(circle at 90% 90%, rgba(50,40,30,0.03) 0%, transparent 30%),
          radial-gradient(circle at 60% 15%, rgba(0,0,0,0.02) 0%, transparent 40%),
          radial-gradient(circle at 25% 65%, rgba(0,0,0,0.02) 0%, transparent 40%),

          /* === レイヤー5: かすかな波紋状のしわ (最終的な質感) === */
          conic-gradient(from 0deg at 50% 50%, rgba(0,0,0,0.02) 0deg, rgba(255,255,255,0.02) 90deg, rgba(0,0,0,0.02) 180deg, rgba(255,255,255,0.02) 270deg, rgba(0,0,0,0.02) 360deg)
        `,
        backgroundSize: `
          4px 4px, /* L1: 微細ノイズ */
          8px 8px, /* L1: 微細ノイズ */
          8px 8px, /* L1: 微細ノイズ */
          
          50px 50px, /* L2: 斜め線1 */
          50px 50px, /* L2: 斜め線2 */
          30px 30px, /* L2: 縦線 */
          30px 30px, /* L2: 横線 */

          600px 600px, /* L3: 大きな影1 */
          500px 500px, /* L3: 大きなハイライト2 */
          800px 800px, /* L3: 中央影 */

          300px 300px, /* L4: シミ1 */
          300px 300px, /* L4: シミ2 */
          400px 400px, /* L4: 斑点1 */
          400px 400px, /* L4: 斑点2 */

          200px 200px /* L5: 波紋状しわ */
        `,
        backgroundBlendMode: 'multiply, overlay, soft-light, overlay, multiply, soft-light, multiply, soft-light, overlay, soft-light, multiply, overlay, soft-light, multiply',
      }}
    >
      <Header />
      {/* main タグに w-full h-full を追加して、利用可能なスペースを完全に占有するようにします */}
      <main className="flex-grow w-full h-full"> {/* <-- ここを修正 */}
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;