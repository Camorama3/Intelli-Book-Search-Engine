// use this to decode a token and get the user's information out of it
import decode from 'jwt-decode';
import client from './apollo-client'; // Import Apollo Client
import { gql } from '@apollo/client';

// create a new class to instantiate for a user
class AuthService {
  // get user data
  getProfile() {
    return decode(this.getToken());
  }

  // check if user's logged in
  loggedIn() {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token); // handwaiving here
  }

  // check if token is expired
  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      if (decoded.exp < Date.now() / 1000) {
        return true;
      } else return false;
    } catch (err) {
      return false;
    }
  }

  getToken() {
    // Retrieves the user token from localStorage
    return localStorage.getItem('id_token');
  }

//   login(idToken) {
//     // Saves user token to localStorage
//     localStorage.setItem('id_token', idToken);
//     window.location.assign('/');
//   }

//   logout() {
//     // Clear user token and profile data from localStorage
//     localStorage.removeItem('id_token');
//     // this will reload the page and reset the state of the application
//     window.location.assign('/');
//   }
// }
async login(email, password) {
  const LOGIN_MUTATION = gql`
    mutation Login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        idToken
      }
    }
  `;

  try {
    const { data } = await client.mutate({
      mutation: LOGIN_MUTATION,
      variables: { email, password }
    });
    const { idToken } = data.login;
    localStorage.setItem('id_token', idToken);
    window.location.assign('/');
  } catch (error) {
    console.error('Login Error:', error);
    throw new Error('Login Failed');
  }
}

logout() {
  localStorage.removeItem('id_token');
  window.location.assign('/');
}
}

export default new AuthService();
