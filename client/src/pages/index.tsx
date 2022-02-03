import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { isLoggedIn } from '../lib/auth';

export default function Index() {
  const router = useRouter();

  useEffect(() => {

    if (!isLoggedIn()) {
      router.push('/dashboard');
    } else {
      router.push('/auth/login');
    }

  }), [];

  return <div></div>;
}
