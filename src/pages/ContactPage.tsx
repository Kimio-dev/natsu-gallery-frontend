// src/pages/ContactPage.tsx
import React from 'react';
import Layout from '../components/Layout';
import ContactForm from '../components/ContactForm'; // ContactFormをインポート

const ContactPage: React.FC = () => {
  return (
    <Layout>
        {/* ContactForm コンポーネントを使用 */}
        <ContactForm />
    </Layout>
  );
};

export default ContactPage;