// src/global.d.ts

// ReactのImgHTMLAttributesを拡張して、'decode'属性を追加します。
// これにより、TypeScriptが<img>タグのdecode属性を認識するようになります。
declare namespace React {
  interface ImgHTMLAttributes<T> extends HTMLAttributes<T> {
    decode?: "sync" | "async" | "auto";
  }
}
