import React, { useEffect, useState } from "react";

import { Auth } from "aws-amplify";
import { CognitoUser } from "amazon-cognito-identity-js";

export type UserContextT = {
  user?: CognitoUser;
};

export const UserContext = React.createContext<UserContextT>({});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [self, setSelf] = useState<CognitoUser>();

  useEffect(() => {
    async function getUser() {
      setSelf(await Auth.currentAuthenticatedUser());
    }
    getUser();
  }, []);

  return (
    <UserContext.Provider value={{ user: self }}>
      {children}
    </UserContext.Provider>
  );
};
