// src/data/experience.ts

// 経歴データの型を定義
export interface ExperienceItem {
  year: string;
  description: string;
  details?: string; // オプショナルな詳細（例: 資格取得など）
}

// 経歴データを定義
export const experiences: ExperienceItem[] = [
  { year: '20XX年', description: '○○製菓学校卒業'},
  { year: '20YY年', description: '複数社にて<br />お菓子コラム作成' },
  { year: '20ZZ年', description: '複数社とコラボ<br />商品開発' },
  { year: '現在', description: 'フリーで<br />お仕事募集' },
];