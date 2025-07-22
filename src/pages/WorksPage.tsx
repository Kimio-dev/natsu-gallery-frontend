// src/pages/WorksPage.tsx
import React from 'react';
import WorksSection from '../components/WorksSection'
import Layout from '../components/Layout'; // Layoutコンポーネントをインポート

const WorksPage: React.FC = () => {
  return (
    <Layout>
        <WorksSection />
    </Layout>
  );
};

export default WorksPage;