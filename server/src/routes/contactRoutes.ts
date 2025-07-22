import { Router, Request, Response } from 'express';
import { validateContactForm } from '../middleware/validationMiddleware'; // バリデーションミドルウェアをインポート
import nodemailer from 'nodemailer'; // Nodemailer をインポート

const router = Router();

// Nodemailer のトランスポーター設定 (仮)
// 実際には、環境変数から認証情報を取得する必要があります
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // 例: 'smtp.gmail.com'
  port: parseInt(process.env.EMAIL_PORT || '587'), // 例: 587 (TLS) または 465 (SSL)
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,     // 送信元メールアドレス
    pass: process.env.EMAIL_PASS,     // 送信元メールアドレスのパスワードまたはアプリパスワード
  },
});

// お問い合わせフォームの POST エンドポイント
// validateContactForm ミドルウェアを適用
router.post('/contact', validateContactForm, async (req: Request, res: Response) => {
  const { name, email, inquiryType, details } = req.body;

  try {
    // メール送信のオプション設定
    const mailOptions = {
      from: process.env.EMAIL_USER, // 送信元
      to: process.env.EMAIL_RECEIVER, // 受信者 (お問い合わせを受け取るメールアドレス)
      subject: `NATSU_GALLERY お問い合わせ: ${inquiryType}`, // メール件名
      html: `
        <p><strong>お名前 (企業名):</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>ご依頼内容:</strong> ${inquiryType}</p>
        <p><strong>ご依頼・ご相談詳細:</strong></p>
        <p>${details}</p>
      `, // HTML形式のメール本文
    };

    // メール送信 (実際にはここで送信される)
    await transporter.sendMail(mailOptions);

    console.log('お問い合わせメールが正常に送信されました:', { name, email, inquiryType });
    res.status(200).json({ message: 'お問い合わせを受け付けました。' });

  } catch (error) {
    console.error('お問い合わせメールの送信中にエラーが発生しました:', error);
    // エラー詳細をクライアントに返さないように注意
    res.status(500).json({ message: 'お問い合わせの送信中にエラーが発生しました。' });
  }
});

export default router;
