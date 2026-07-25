import { Helmet } from 'react-helmet-async';

const APP_NAME = 'BQ Admin';

interface IPageMeta {
  title: string;
  description?: string;
}

const PageMeta = ({ title, description }: IPageMeta) => {
  return (
    <Helmet>
      <title>{`${title} | ${APP_NAME}`}</title>
      {!!description && <meta name="description" content={description} />}
    </Helmet>
  );
};

export default PageMeta;
