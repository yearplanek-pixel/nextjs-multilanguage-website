import Layout from "../components/Layout";
import {
  useStoryblokState,
  getStoryblokApi,
  StoryblokComponent,
} from "@storyblok/react";

// 循環参照を防ぐ関数
const safeSerialize = (data) => {
  if (data === null || data === undefined) return data;
  try {
    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.warn("Serialization error:", error);
    return null;
  }
};

export default function Page({ story, locale, locales, defaultLocale }) {
  story = useStoryblokState(story, {
    resolveRelations: ["featured-posts.posts", "selected-posts.posts"],
    language: locale,
  });

  return (
    <Layout locale={locale} locales={locales} defaultLocale={defaultLocale}>
      <StoryblokComponent blok={story.content} />
    </Layout>
  );
}

export async function getStaticProps({ locale, locales, defaultLocale, params }) {
  let slug = params.slug ? params.slug.join("/") : "home";

  let sbParams = {
    version: "draft",
    resolve_relations: ["featured-posts.posts", "selected-posts.posts"],
    language: locale,
  };

  try {
    let { data } = await getStoryblokApi().get(`cdn/stories/${slug}`, sbParams);
    
    // 循環参照を解消
    const serializedData = safeSerialize(data);

    return {
      props: {
        story: serializedData ? serializedData.story : false,
        key: serializedData ? serializedData.story.id : false,
        locale,
        locales,
        defaultLocale,
      },
      revalidate: 3600,
    };
  } catch (error) {
    console.error("Error fetching story:", error);
    return {
      props: {
        story: false,
        locale,
        locales,
        defaultLocale,
      },
      revalidate: 3600,
    };
  }
}

export async function getStaticPaths({ locales }) {
  try {
    let { data } = await getStoryblokApi().get("cdn/links/");
    
    // 循環参照を解消
    const serializedData = safeSerialize(data);

    let paths = [];
    Object.keys(serializedData.links).forEach((linkKey) => {
      if (serializedData.links[linkKey].is_folder) {
        return;
      }

      const slug = serializedData.links[linkKey].slug;
      let splittedSlug = slug.split("/");
      if (slug === "home") splittedSlug = false;

      for (const locale of locales) {
        paths.push({ params: { slug: splittedSlug }, locale });
      }
    });

    return {
      paths: paths,
      fallback: "blocking", // falseからblockingに変更
    };
  } catch (error) {
    console.error("Error generating paths:", error);
    return {
      paths: [],
      fallback: "blocking",
    };
  }
}
