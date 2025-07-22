import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'; // dotenvをインポート
import rateLimit from 'express-rate-limit'; // rateLimitをインポート
import { Request, Response, NextFunction } from 'express'; // エラーハンドリングミドルウェアのためにインポート

// .envファイルから環境変数を読み込む - 必ず一番最初に呼び出す
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000; // 環境変数からポートを取得、なければ5000

// CORSの設定
const corsOptions = {
  origin: 'https://natsu-gallery-frontend.vercel.app', // フロントエンドのVite開発サーバーのポート
  optionsSuccessStatus: 200 // 古いブラウザのための設定
};
app.use(cors(corsOptions));

// JSONリクエストボディをパースするためのミドルウェア
app.use(express.json());

// レートリミットの設定
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1分間 (ミリ秒単位)
  max: 5, // 1分間に5リクエストまで許可
  message: '短期間に多くのリクエストがありました。しばらくしてから再度お試しください。', // 制限を超えた場合のエラーメッセージ
  standardHeaders: true, // RateLimit-Limit, RateLimit-Remaining, Retry-Afterヘッダーを追加
  legacyHeaders: false, // X-RateLimit-*ヘッダーを無効にする
});

// APIルートの設定
// /apiで始まる全てのルートにレートリミットを適用
app.use('/api', limiter); 
import contactRoutes from './routes/contactRoutes'; // お問い合わせルートをインポート
app.use('/api', contactRoutes); // /api/contactのようなパスでアクセスできるようにする

// ルートエンドポイント（サーバーが動作しているか確認用）
app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

// エラーハンドリングミドルウェアの追加
// これを全てのルート定義の後に配置します
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // サーバーログには詳細なエラー情報を出力
  // クライアントには一般的なエラーメッセージを返します
  res.status(500).send('サーバー内部エラーが発生しました。'); 
});

// サーバーを起動
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Access backend at http://localhost:${PORT}`);
});
