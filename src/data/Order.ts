// src/data/Order.ts

export interface OrderImage {
  id: number;
  name: string;
  webp: string;
  jpg: string;
  alt: string;
  price: string;
  discription: string;
}

export const orderImages: OrderImage[] = [
  { id: 1, name: 'コラム作成', webp: '/images/order/1-1.webp', jpg: '/images/order/1-2.jpg', alt: 'コラム作成', price: '￥4,000～',
    discription: '企業様からお菓子のコラム作成依頼を受け付けております。',
  },
   { id: 2, name: 'レシピ開発', webp: '/images/order/2-1.webp', jpg: '/images/order/2-2.jpg', alt: 'レシピ開発', price: '￥10,000～',
    discription: 'テーマや材料を指定いただき、<br />菓子を作成します。',
  },
   { id: 3, name: 'フードスタイリング', webp: '/images/order/3-1.webp', jpg: '/images/order/3-2.jpg', alt: 'フードスタイリング', price: '￥5,000～',
    discription: 'お菓子写真の撮り方をレクチャーします。<br />画角、花や小物の配置方法等。',
  },
   { id: 4, name: 'その他', webp: '/images/order/4-1.webp', jpg: '/images/order/4-2.jpg', alt: 'その他', price: '￥応相談',
    discription: 'その他お菓子作りに関するお悩み承ります。',
  }
 
];