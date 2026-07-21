import Head from 'expo-router/head';

interface JsonLdProps {
  data: object;
}

// Renders one JSON-LD <script> block inside the page's <head>. Escaping "<"
// guards against the (unlikely, since all our content is app-authored, not
// user-submitted) case of a literal "</script>" inside a text field breaking
// out of the script tag.
export default function JsonLd({ data }: JsonLdProps) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return (
    <Head>
      <script type="application/ld+json">{json}</script>
    </Head>
  );
}
