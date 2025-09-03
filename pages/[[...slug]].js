import Layout from "../components/Layout";
import {
  useStoryblokState,
  getStoryblokApi,
  StoryblokComponent,
} from "@storyblok/react";

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

export async function getStaticProps({
  locale,
  locales,
  defaultLocale,
  params,
}) {
  let slug = params.slug ? params.slug.join("/") : "home";

  let sbParams = {
    version: "draft",
    resolve_relations: ["featured-posts.posts", "selected-posts.posts"],
    language: locale,
  };

  let { data } = await getStoryblokApi().get(`cdn/stories/${slug}`, sbParams);

  // ✅ 循環参照を解消
  const serializedData = data ? JSON.parse(JSON.stringify(data)) : null;

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
}

export async function getStaticPaths({ locales }) {
  let { data } = await getStoryblokApi().get("cdn/links/");

  // ✅ 循環参照を解消
  const serializedData = JSON.parse(JSON.stringify(data));

  let paths = [];
  Object.keys(serializedData.links).forEach((linkKey) => {
    if (serializedData.links[linkKey].is_folder) {
      return;
    }

    // get array for slug because of catch all
    const slug = serializedData.links[linkKey].slug;
    let splittedSlug = slug.split("/");
    if (slug === "home") splittedSlug = false;

    // create additional languages
    for (const locale of locales) {
      paths.push({ params: { slug: splittedSlug }, locale });
    }
  });

  return {
    paths: paths,
    fallback: false,
  };
}
