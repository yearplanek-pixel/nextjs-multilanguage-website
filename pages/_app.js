import "../styles/tailwind.css";
import { storyblokInit, apiPlugin } from "@storyblok/react";

// コンポーネントのインポート
import BlogPost from "../components/BlogPost";
import Feature from "../components/Feature";
import FeaturedPosts from "../components/FeaturedPosts";
import Grid from "../components/Grid";
import Page from "../components/Page";
import PostsList from "../components/PostsList";
import Teaser from "../components/Teaser";
import Text from "../components/Text";

const components = {
  feature: Feature,
  "featured-posts": FeaturedPosts,
  grid: Grid,
  page: Page,
  post: BlogPost,
  "selected-posts": PostsList,
  teaser: Teaser,
  text: Text,
};

// 環境変数からトークンを取得
const storyblokToken = process.env.NEXT_PUBLIC_STORYBLOK_TOKEN || process.env.STORYBLOK_TOKEN;

storyblokInit({
  accessToken: storyblokToken,
  use: [apiPlugin],
  components,
});

// 安全なシリアライズ関数
const safePageProps = (pageProps) => {
  if (!pageProps) return {};
  try {
    return JSON.parse(JSON.stringify(pageProps));
  } catch (error) {
    console.warn("Page props serialization error:", error);
    return {};
  }
};

function MyApp({ Component, pageProps }) {
  const processedProps = safePageProps(pageProps);
  return <Component {...processedProps} />;
}

export default MyApp;
