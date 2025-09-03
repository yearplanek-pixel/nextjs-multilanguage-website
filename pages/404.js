import Layout from "../components/Layout";

export default function Page404({ locale, locales, defaultLocale }) {
  return (
    <Layout locale={locale} locales={locales} defaultLocale={defaultLocale}>
      <h1>Not found</h1>
    </Layout>
  );
}

export async function getStaticProps({ locale, locales, defaultLocale }) {
  // ✅ 念のためシリアライズ処理を追加
  return {
    props: {
      locale: locale,
      locales: JSON.parse(JSON.stringify(locales)),
      defaultLocale: defaultLocale,
    },
  };
}
