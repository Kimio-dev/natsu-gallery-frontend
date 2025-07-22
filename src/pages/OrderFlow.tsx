// src/pages/OrderFlow.tsx
import React from 'react';
import OrderFlowSection from '../components/OrderFlowSection';
import Layout from '../components/Layout'; // Layoutコンポーネントをインポート

const OrderFlow: React.FC = () => {
  return (
    <Layout>
        <OrderFlowSection /> {/* OrderFlowSection をレンダリング */}
    </Layout>
  );
};

export default OrderFlow;