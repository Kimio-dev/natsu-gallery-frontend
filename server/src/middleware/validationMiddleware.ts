import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// お問い合わせフォームのバリデーションルールとサニタイズ
export const validateContactForm = [
  // name フィールドのバリデーションとサニタイズ
  body('name')
    .trim() // 前後の空白を削除
    .escape() // HTMLエンティティに変換 (サニタイズ)
    .notEmpty().withMessage('お名前は必須です。') // 空でないことを確認
    .isLength({ min: 1, max: 100 }).withMessage('お名前は1文字以上100文字以内で入力してください。'),

  // email フィールドのバリデーションとサニタイズ
  body('email')
    .trim() // 前後の空白を削除
    .normalizeEmail() // メールアドレスを正規化 (サニタイズ)
    .notEmpty().withMessage('Emailは必須です。')
    .isEmail().withMessage('有効なEmailアドレスを入力してください。'),

  // inquiryType フィールドのバリデーション
  body('inquiryType')
    .notEmpty().withMessage('ご依頼内容を選択してください。')
    .isIn(['Column writing', 'Create sweets', 'Food styling', 'Other']).withMessage('無効なご依頼内容です。'),

  // details フィールドのバリデーションとサニタイズ
  body('details')
    .trim() // 前後の空白を削除
    .escape() // HTMLエンティティに変換 (サニタイズ)
    .notEmpty().withMessage('ご依頼・ご相談詳細を入力してください。')
    .isLength({ min: 10, max: 1000 }).withMessage('詳細は10文字以上1000文字以内で入力してください。'),

  // バリデーション結果を処理するミドルウェア
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // バリデーションエラーがある場合、400 Bad Request とエラーメッセージを返す
      return res.status(400).json({ errors: errors.array() });
    }
    next(); // エラーがなければ次のミドルウェアまたはルートハンドラへ
  }
];
