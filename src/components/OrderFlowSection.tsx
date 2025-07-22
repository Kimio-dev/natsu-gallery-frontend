// src/components/OrderFlowSection.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { orderImages } from '../data/Order';
import SectionTitle from './SectionTitle'; 

const OrderFlowSection: React.FC = () => {
  // item.name (日本語) を inquiryType (英語) に変換するヘルパー関数
  const getInquiryTypeValue = (name: string): string => {
    switch (name) {
      case 'コラム作成':
        return 'Column writing';
      case 'レシピ開発':
        return 'Create sweets';
      case 'フードスタイリング':
        return 'Food styling';
      case 'その他':
        return 'Other';
      default:
        // 一致しない場合は空文字列を返すか、エラーハンドリングを検討
        return ''; 
    }
  };

  return (
    <section className="container mx-auto px-4 py-8 mt-16 md:mt-24 text-gray-800">
      <SectionTitle title="ご依頼の流れ" /> 

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {orderImages.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 relative pb-20">
            <div className="w-full h-56 md:h-64 lg:h-72 overflow-hidden">
              <picture>
                <source srcSet={item.webp} type="image/webp" />
                <img
                  src={item.jpg}
                  alt={item.alt}
                  className="w-full h-full object-cover"
                />
              </picture>
            </div>

            <div className="p-6 flex flex-col">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">{item.name}</h2>
                <p className="text-xl font-bold text-pink-600 mb-3">{item.price}</p>
                <p 
                  className="text-gray-600 leading-relaxed mb-6" 
                  dangerouslySetInnerHTML={{ __html: item.discription }}
                ></p>
              </div>
            </div>
            
            {/* お問合せボタン: クエリパラメータを追加 */}
            <Link 
              // 各項目の name に応じて inquiryType クエリパラメータを設定
              to={`/contact?inquiryType=${getInquiryTypeValue(item.name)}`} 
              className="absolute bottom-4 left-4 right-4 py-3 bg-pink-600 text-white font-bold rounded-md text-center
                         hover:bg-pink-700 transition-colors duration-300"
            >
              お問合せ
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OrderFlowSection;