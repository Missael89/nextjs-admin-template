import { Button } from '@paljs/ui/Button';
import { InputGroup } from '@paljs/ui/Input';
import * as React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import Router from 'next/router';

import Auth from 'components/Auth';
import Layout from 'Layouts';
import axios from 'axios';

/*const dotenv = require('dotenv');
dotenv.config({ path: '../../../env/.env' });*/

const Input = styled(InputGroup)`
  margin-bottom: 2rem;
`;

export default function Register() {

  const handleSubmit = async (event: { preventDefault: () => void; currentTarget: HTMLFormElement | undefined; }) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    data.append('query', 'insert');

    /*const firstName = data.get('firstName');
    const lastName = data.get('lastName');
    const email = data.get('email');
    const password = data.get('password');
    const query = data.get('query');*/
    //console.log(process.env.API_PHP);
    (data.get('password') !== data.get('passwordConfirm'))
      ? alert('Las contraseñas no coniciden')
      : await axios.post(`https://api.xiimbah-mexikoo.com/lib/_users.php`, data)
        .then((response) => {
          (response.data.success)
            ? Router.push('/auth/login')
            : console.log(response.data);
        })
        .catch((error) => console.log(error));
    
  };

  return (
    <Layout title="Register">
      <Auth title="Create new account">
        <form onSubmit={handleSubmit}>
          <Input fullWidth>
            <input required type="text" placeholder="Name" id="firstName" name="firstName" />
          </Input>
          <Input fullWidth>
            <input required type="text" placeholder="Last Name" id="lastName" name="lastName" />
          </Input>
          <Input fullWidth>
            <input required type="email" placeholder="Email Address" id="email" name="email" />
          </Input>
          <Input fullWidth>
            <input required type="password" placeholder="Password" id="password" name="password" />
          </Input>
          <Input fullWidth>
            <input required type="password" placeholder="Confirm Password" id="passwordConfirm" name="passwordConfirm" />
          </Input>
          <Button status="Success" type="submit" shape="SemiRound" fullWidth>
            Register
          </Button>
        </form>
        <p>
          Already have an account?{' '}
          <Link href="/auth/login">
            <a>Log In</a>
          </Link>
        </p>
      </Auth>
    </Layout>
  );
}
