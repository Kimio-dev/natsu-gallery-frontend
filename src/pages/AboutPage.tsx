// src/pages/AboutPage.tsx
import React from 'react';
import ProfileSection from '../components/ProfileSection';
import Layout from '../components/Layout'; // Layoutコンポーネントをインポート

const AboutPage: React.FC = () => {
  return (
    // これまでの背景スタイルとdivラッパーを削除し、Layoutでラップします
    <Layout>
        <ProfileSection />
    </Layout>
  );
};

export default AboutPage;