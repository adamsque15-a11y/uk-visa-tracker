// JSON-LD (schema.org) builders — kept as plain data-shaping functions so
// each page just imports the piece it needs and renders it via <JsonLd>
// (components/JsonLd.tsx). Field names/nesting follow the schema.org specs
// exactly (https://schema.org/FAQPage, /Article, /HowTo, /Organization) so
// the output is eligible for Google Rich Results, not just present.
import { APP_NAME, SITE_URL } from './legalConfig';

export interface FAQItem {
  question: string;
  answer: string;
}

// https://schema.org/FAQPage — Google requires every Question's acceptedAnswer
// text to actually be visible on the page (not solely present in JSON-LD),
// so only call this with Q&A that's also rendered as real page content.
export function buildFAQPageSchema(items: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

interface ArticleSchemaInput {
  headline: string;
  description: string;
  url: string;
  datePublished: string; // ISO 8601
  dateModified: string; // ISO 8601
  authorName?: string;
  // Google's Article rich-result guidelines require an image (recommended
  // >=1200px wide) — falls back to the app icon since there's no dedicated
  // article image yet (same known gap as /og-image.png, see visa-info pages).
  imageUrl?: string;
}

// https://schema.org/Article — field set follows Google's Article
// structured-data guidelines (headline, image, datePublished, dateModified,
// author), not just the bare schema.org minimum.
export function buildArticleSchema({
  headline,
  description,
  url,
  datePublished,
  dateModified,
  authorName,
  imageUrl,
}: ArticleSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    image: imageUrl ?? `${SITE_URL}/icon.png`,
    url,
    datePublished,
    dateModified,
    author: authorName
      ? { '@type': 'Person', name: authorName }
      : { '@type': 'Organization', name: APP_NAME, url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: APP_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/icon.png`,
      },
    },
  };
}

export interface HowToStepInput {
  name: string;
  text: string;
}

interface HowToSchemaInput {
  name: string;
  description: string;
  totalTime?: string; // ISO 8601 duration, e.g. "PT10M"
  steps: HowToStepInput[];
}

// https://schema.org/HowTo
export function buildHowToSchema({ name, description, totalTime, steps }: HowToSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    ...(totalTime ? { totalTime } : {}),
    step: steps.map((step) => ({
      '@type': 'HowToStep',
      name: step.name,
      text: step.text,
    })),
  };
}

// https://schema.org/Organization — the `description` deliberately states
// independence from UKVI/the Home Office, since this is general guidance
// content, not an official government service.
export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: APP_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.png`,
    description:
      `${APP_NAME} is an independent, free tool for tracking UK visa applications. ` +
      'It is not affiliated with, endorsed by, or connected to UK Visas and Immigration (UKVI) or the Home Office.',
  };
}
