// src/pages/HomePage.tsx
import React from 'react';
import BackgroundGrid from '../components/BackgroundGrid';
import Layout from '../components/Layout';

const HomePage: React.FC = () => {
  return (
    <Layout showFooter={false}>
      <BackgroundGrid className="fixed inset-0 -z-0" />
      <div className="fixed inset-0 flex flex-col items-center justify-center text-center text-gray-800 px-4 z-10">
        <h1
          className="
            font-extrabold mb-4 drop-shadow-lg
            text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-gray-400
          "
          style={{ fontSize: 'calc(1.5rem + 4vw)' }}
        >
          NATSU_GALLERY
        </h1>
        <div>このサイトはTypescript+React+Node.js練習用に作成したデモサイトです。</div>
      </div>
    </Layout>
  );
};

export default HomePage;