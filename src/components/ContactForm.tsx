import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import SectionTitle from './SectionTitle';
import { useLocation } from 'react-router-dom';

// フォームデータの型定義
interface ContactFormInputs {
  name: string;
  email: string;
  inquiryType: 'Column writing' | 'Create sweets' | 'Food styling' | 'Other' | '';
  details: string;
}

const ContactForm: React.FC = () => {
  const location = useLocation();

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<ContactFormInputs>();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(''); // 送信メッセージを管理
  const [isError, setIsError] = useState(false); // エラー状態を管理

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const initialInquiryType = params.get('inquiryType');

    if (initialInquiryType) {
      const validInquiryTypes: ContactFormInputs['inquiryType'][] = [
        'Column writing', 'Create sweets', 'Food styling', 'Other'
      ];
      
      if (validInquiryTypes.includes(initialInquiryType as ContactFormInputs['inquiryType'])) {
        setValue('inquiryType', initialInquiryType as ContactFormInputs['inquiryType']);
      } else {
        setValue('inquiryType', '');
      }
    } else {
      setValue('inquiryType', '');
    }
    
    window.scrollTo(0, 0); 

  }, [location.search, setValue]);

  const onSubmit: SubmitHandler<ContactFormInputs> = async (data) => {
    setIsSubmitted(true); // 送信処理中はメッセージ表示
    setSubmitMessage(''); // メッセージをクリア
    setIsError(false); // エラー状態をリセット

    try {
      const response = await fetch('https://natsu-gallery-backend.onrender.com', { // バックエンドのURLを指定
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitMessage(result.message || 'お問い合わせを受け付けました。');
        setIsError(false);
        reset(); // フォームをリセット
      } else {
        // バリデーションエラーなど、サーバーからのエラーレスポンス
        setSubmitMessage(result.message || result.errors?.[0]?.msg || 'お問い合わせの送信に失敗しました。');
        setIsError(true);
      }
    } catch (error) {
      console.error('フォーム送信エラー:', error);
      setSubmitMessage('ネットワークエラーが発生しました。後でもう一度お試しください。');
      setIsError(true);
    } finally {
      // 成功/失敗に関わらず、一定時間後にメッセージを非表示にする
      setTimeout(() => {
        setIsSubmitted(false);
        setSubmitMessage('');
      }, 5000);
    }
  };

  return (
    <section className="container mx-auto px-4 py-8 mt-16 md:mt-24 text-gray-800">
      <SectionTitle title="問い合わせ" />
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <p className="text-gray-700 mb-6 text-center">
          ご依頼・ご相談はこちらのフォームよりお気軽にお問い合わせください。
        </p>

        {isSubmitted && submitMessage && ( // submitMessage がある場合のみ表示
          <div className={`${isError ? 'bg-red-100 border-red-400 text-red-700' : 'bg-green-100 border-green-400 text-green-700'} px-4 py-3 rounded relative mb-6`} role="alert">
            <strong className="font-bold">{isError ? 'エラー!' : '送信完了!'}</strong>
            <span className="block sm:inline"> {submitMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
              お名前 (企業名) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              {...register('name', { required: 'お名前は必須です。' })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="例: 山田 太郎 / 株式会社〇〇"
            />
            {errors.name && <p className="text-red-500 text-xs italic mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              {...register('email', { 
                required: 'Emailは必須です。', 
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: '有効なEmailアドレスを入力してください。'
                }
              })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="例: example@mail.com"
            />
            {errors.email && <p className="text-red-500 text-xs italic mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="inquiryType" className="block text-gray-700 text-sm font-bold mb-2">
              ご依頼内容 <span className="text-red-500">*</span>
            </label>
            <select
              id="inquiryType"
              {...register('inquiryType', { required: 'ご依頼内容を選択してください。' })}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">選択してください</option>
              <option value="Column writing">コラム作成</option>
              <option value="Create sweets">レシピ開発</option>
              <option value="Food styling">フードスタイリング</option>
              <option value="Other">その他</option>
            </select>
            {errors.inquiryType && <p className="text-red-500 text-xs italic mt-1">{errors.inquiryType.message}</p>}
          </div>

          <div>
            <label htmlFor="details" className="block text-gray-700 text-sm font-bold mb-2">
              ご依頼・ご相談詳細 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="details"
              rows={6}
              {...register('details', { 
                required: 'ご依頼・ご相談詳細を入力してください。',
                minLength: { value: 10, message: '詳細は10文字以上で入力してください。' }
              })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-y"
              placeholder="ご依頼内容や具体的なご相談についてご記入ください。"
            ></textarea>
            {errors.details && <p className="text-red-500 text-xs italic mt-1">{errors.details.message}</p>}
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-8 rounded-md focus:outline-none focus:shadow-outline transition-colors duration-300"
            >
              送信する
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
