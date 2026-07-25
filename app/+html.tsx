import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

// Web-only root HTML document, used by Expo Router's static export for
// every page. Runs only in Node during the export — no DOM/browser APIs
// here. This is the one place a tag can land in every page's <head>
// without threading it through each route's own expo-router/head <Head>.
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        {/* Google Search Console domain ownership verification. */}
        <meta name="google-site-verification" content="h8Gigk-vrRt66sSAbH-RO13fHDJ0WM2ParliifOW2Jw" />

        {/*
          Disable body scrolling on web. This makes ScrollView components work closer to how they do on native.
          However, body scrolling is often nice to have for mobile web. If you want to enable it, remove this line.
        */}
        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
