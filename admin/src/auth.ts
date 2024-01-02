import { createAuthProvider, type AuthProvider } from 'tushan';

export const authProvider: AuthProvider = createAuthProvider({
  loginUrl: `http://a132810.e1.luyouxia.net:25563/api/login`
});
