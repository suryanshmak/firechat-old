import {
  ReactElement,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth } from "../firebaseUtil";
import { gql, useLazyQuery } from "@apollo/client";

interface SignedInProviderProps {
  children: ReactElement;
}

type UserValues = {
  createdAt?: string;
  username?: string;
  user_uid?: string;
  name?: string;
};

const UserContext = createContext<UserValues>({});

export const useUser = () => useContext(UserContext);

const FETCH_USER = gql`
  query FetchUser($user_uid: String) {
    users(where: { user_uid: { _eq: $user_uid } }) {
      user_uid
      email
      created_at
      username
    }
  }
`;

const UserProvider = ({ children }: SignedInProviderProps) => {
  const [fetchUser, { data }] = useLazyQuery(FETCH_USER, {
    notifyOnNetworkStatusChange: true,
  });
  const [user, setUser] = useState<UserValues>({});

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) fetchUser({ variables: { user_uid: authUser.uid } });
    });
    if (data) setUser(data.users[0]);
    return unsubscribe;
  }, [data]);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export default UserProvider;
