// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import WorksPage from './pages/WorksPage';
import SweetDetailPage from './pages/SweetDetailPage'; // SweetDetailPageをインポート
import OrderFlow from './pages/OrderFlow';
import ContactPage from './pages/ContactPage'; // 追加

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/works" element={<WorksPage />} />
        {/* 作品詳細ページへの新しいルートを追加 */}
        {/* /works/1, /works/2 のようにアクセスできるようになる */}
        <Route path="/works/:id" element={<SweetDetailPage />} /> 
        <Route path="/order-flow" element={<OrderFlow />} /> {/* 追加 */}
        <Route path="/contact" element={<ContactPage />} /> {/* これを追加 */}
      </Routes>
    </Router>
  );
};

export default App;