import { Fragment } from 'react';

import LoginForm from '@/components/layout/forms/LoginForm';
import PageMeta from '@/components/ui/PageMeta';

const Login = () => (
  <Fragment>
    <PageMeta title="Login" description="Login to your account." />
    <LoginForm />
  </Fragment>
);

export default Login;
