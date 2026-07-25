import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

const APP_NAME = 'BQ Admin';
const DEFAULT_DESCRIPTION = 'Manage products, categories and orders.';
const DEFAULT_IMAGE = '/android-chrome-512x512.png';

// Static fallback tags in index.html (see comment there) - removed once React takes over,
// since react-helmet-async only manages tags it renders itself and would otherwise duplicate these.
const DEFAULT_TAG_IDS = [
  'default-title',
  'default-description',
  'default-og-type',
  'default-og-site-name',
  'default-og-title',
  'default-og-description',
  'default-og-image',
  'default-twitter-card',
  'default-twitter-title',
  'default-twitter-description',
  'default-twitter-image',
];

interface IPageMeta {
  title: string;
  description?: string;
  image?: string;
}

const PageMeta = ({ title, description = DEFAULT_DESCRIPTION, image }: IPageMeta) => {
  const fullTitle = `${title} | ${APP_NAME}`;
  const imageUrl = new URL(image ?? DEFAULT_IMAGE, window.location.origin).toString();

  useEffect(() => {
    DEFAULT_TAG_IDS.forEach((id) => {
      document.getElementById(id)?.remove();
    });
  }, []);

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={APP_NAME} />
      <meta property="og:url" content={window.location.href} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  );
};

export default PageMeta;
