import { createContext, useState } from 'react';
import { storeDataToLocalStore, LocalStoreKeys, removeDataFromLocalStore } from './localStore';

export interface AuthContextType {
  token: string;
  setToken: (token: string, save?: boolean) => void;
  removeToken: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  token: '',
  setToken: () => {},
  removeToken: () => {},
  isAuthenticated: false,
});

function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string>('');
  const isAuthenticated = token.length > 0;

  const setTokenHandler = (token: string, save = true) => {
    setToken(token);

    if (save) {
      // store token in local storage
      storeDataToLocalStore(LocalStoreKeys.AUTH_TOKEN, token);
    }
  };

  const removeTokenHandler = () => {
    setToken('');
    removeDataFromLocalStore(LocalStoreKeys.AUTH_TOKEN);
  };

  const value = {
    token,
    isAuthenticated,
    setToken: setTokenHandler,
    removeToken: removeTokenHandler,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
