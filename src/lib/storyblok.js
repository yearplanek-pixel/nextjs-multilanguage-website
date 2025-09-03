// src/lib/storyblok.js
import { apiPlugin, storyblokInit } from '@storyblok/react/rsc';

// 後ほど作成するコンポーネントをインポートする準備
import Page from '@/components/Page';
import Teaser from '@/components/Teaser';
import Feature from '@/components/Feature';
import Grid from '@/components/Grid';

export const getStoryblokApi = storyblokInit({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_CONTENT_API_ACCESS_TOKEN,
  use: [apiPlugin],
  components: {
    // ここにStoryblokのブロックとReactコンポーネントを対応づけます
    page: Page,
    teaser: Teaser,
    feature: Feature,
    grid: Grid,
  },
  apiOptions: {
    region: 'eu', // または 'us'。あなたのスペースのリージョンに合わせて変更。
  },
});
