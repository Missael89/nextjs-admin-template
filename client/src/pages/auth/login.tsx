import { Button } from '@paljs/ui/Button';
import { InputGroup } from '@paljs/ui/Input';
import React from 'react';
import Link from 'next/link';

import Auth, { Group } from 'components/Auth';
import Layout from 'Layouts';
import { login } from '../../lib/auth';

export default function Login() {

  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    login(event);    
  }

  return (
    <Layout title="Login">
      <Auth title="Login" subTitle="XIIMBAH MEXIKOO">
        <form onSubmit={handleSubmit}>
          <InputGroup fullWidth>
            <input required type="email" placeholder="Email Address" name="email" id="email" />
          </InputGroup>
          <InputGroup fullWidth>
            <input required type="password" placeholder="Password" name="password" id="password" />
          </InputGroup>
          <Group>
            <Link href="/auth/request-password">
              <a>Forgot Password?</a>
            </Link>
          </Group>
          <Button status="Success" type="submit" shape="SemiRound" fullWidth>
            Login
          </Button>
        </form>
        <p>
          Don&apos;t have account?{' '}
          <Link href="/auth/register">
            <a>Register</a>
          </Link>
        </p>
      </Auth>
    </Layout>
  );
}
