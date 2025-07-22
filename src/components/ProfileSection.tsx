// src/components/ProfileSection.tsx

import React from 'react';
import { profile } from '../data/profile';
import { experiences } from '../data/experience';
import { skills } from '../data/skills';
import SectionTitle from './SectionTitle';

const ProfileSection: React.FC = () => {
  const profileData = profile[0]; 

  return (
    <section className="container mx-auto px-4 py-8 mt-16 md:mt-24 text-gray-800">
      <SectionTitle title="自己紹介" /> 
      {/* プロフィールコンテンツ */}
      <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-12 mb-12 max-w-4xl mx-auto">
        {/* プロフィール写真 */}
        <div className="flex-shrink-0 mb-8 md:mb-0">
          {profileData && (
            <picture>
              <source srcSet={profileData.webp} type="image/webp" />
              <img
                src={profileData.jpg || profileData.webp}
                alt={profileData.alt}
                className="w-48 h-48 md:w-64 md:h-64 rounded-full object-cover shadow-lg mx-auto"
                loading="lazy"
              />
            </picture>
          )}
        </div>

        {/* 自己紹介文 */}
        <div className="flex-grow text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">こんにちは！原 夏枝です。</h2>
          <p className="text-base sm:text-lg md:text-xl leading-normal sm:leading-relaxed text-left sm:text-justify mx-auto max-w-sm sm:max-w-none">
            閲覧いただきありがとうございます。<br />
            お菓子作りの趣味が高じて、<br />
            その魅力を伝えるサイトを運営しています。<br />
            2児の母、子育てとお菓子作りを頑張ってます。<br />
            以下、私の経歴です。
          </p>
        </div>
      </div>

      {/* 経歴 */}
      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">経歴</h2>
        <div className="relative max-w-2xl mx-auto py-4">
          <div className="absolute left-1/2 -translate-x-1/2 top-[34px] bottom-[72px] w-0.5 bg-gray-300"></div>

          {experiences.map((exp, index) => {
            // description内の<br />を、制御可能な<span>タグに置き換える
            const processedDescription = exp.description.replace(
              /<br \/>/g,
              '<span class="mobile-br"></span>'
            );

            return (
              <div key={index} className="relative flex mb-8 items-center min-h-[50px]">
                <div className="w-1/2 pr-12 text-right flex-shrink-0"> 
                  <p className="text-lg md:text-xl font-semibold">{exp.year}</p>
                </div>

                <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center z-10">
                  <span className="w-3 h-3 bg-white rounded-full"></span>
                </div>

                <div className="w-1/2 pl-12 flex-shrink-0"> 
                  <p 
                    className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold mb-1"
                    dangerouslySetInnerHTML={{ __html: processedDescription }} // 置き換えたHTMLを使用
                  >
                  </p>
                  {exp.details && (
                    <p className="text-gray-700 text-sm sm:text-base md:text-lg">{exp.details}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* スキル */}
      <div>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">スキル</h2>
        <div className="max-w-md mx-auto"> 
          <ul className="list-disc list-inside space-y-2 text-lg md:text-xl text-gray-800">
            {skills.map((skill, index) => (
              <li key={index}>
                {skill}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default ProfileSection;