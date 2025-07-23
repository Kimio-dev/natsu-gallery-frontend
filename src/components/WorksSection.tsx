// src/components/WorksSection.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { sweetImages } from '../data/sweets';
import SectionTitle from './SectionTitle';

const WorksSection: React.FC = () => {
  return (
    <section className="container mx-auto px-4 py-8 mt-16 md:mt-24 text-gray-800">
      <SectionTitle title="作品紹介"/>

      {/* 作品グリッド */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {sweetImages.map((sweet, index) => (
          <Link to={`/works/${sweet.id}`} key={index}>
            <div 
              className="relative rounded-lg shadow-xl overflow-hidden transform transition-transform duration-300 hover:scale-105 h-full flex flex-col"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              <div className="w-full aspect-w-3 aspect-h-4 overflow-hidden flex-grow-0">
                <picture>
                  {sweet.webp && <source srcSet={sweet.webp} type="image/webp" />}
                  <img
                    src={sweet.webp}
                    alt={sweet.alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </picture>
              </div>
              
              <div className="p-4 text-gray-900 flex-grow">
                {/* text-overflow-ellipsis を追加 */}
                <h3 className="text-xxxxxs xs:text-xxxxs sm:text-xxs md:text-xs lg:text-sm xl:text-base font-semibold mb-1 whitespace-nowrap overflow-hidden text-ellipsis"> {/* ここを修正 */}
                  {sweet.name}
                </h3> 
                <p className="text-xs xs:text-sm text-gray-700">作成時間: {sweet.createdAt}</p>
                <p className="text-xs xs:text-sm text-gray-700">難易度: {sweet.difficulty}</p>
              </div>
            </div>
          </Link> 
        ))}
      </div>
    </section>
  );
};

export default WorksSection;