// src/components/StoryblokProvider.jsx
"use client"; // これはクライアントコンポーネントであることを示します

import { getStoryblokApi } from '@/lib/storyblok';

export default function StoryblokProvider({ children }) {
  getStoryblokApi(); // 初期化を呼び出し
  return children;
}
