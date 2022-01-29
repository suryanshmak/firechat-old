import {
  ReactElement,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { gql, useLazyQuery } from "@apollo/client";
import { useUser } from "./UserProvider";

type FriendsProviderProps = {
  children: ReactElement;
};

export type FriendsValues = {
  username?: string;
  user_uid?: string;
  status?: string;
  sender_id?: string;
  receiver_id?: string;
};

type Friend = {
  pending?: FriendsValues[];
  accepted?: FriendsValues[];
};

const FriendsContext = createContext<Friend>({});

export const useFriends = () => useContext(FriendsContext);

const FETCH_USER_FRIENDS = gql`
  query FetchUserFriends($user_uid: String) {
    friends_list(args: { user_uid: $user_uid }) {
      username
      user_uid
      status
      sender_id
      receiver_id
    }
  }
`;

const FriendsProvider = ({ children }: FriendsProviderProps) => {
  const [fetchFriends, { data }] = useLazyQuery(FETCH_USER_FRIENDS);
  const [friends, setFriends] = useState<Friend>({});
  const user = useUser();

  useEffect(() => {
    if (user) fetchFriends({ variables: { user_uid: user.user_uid } });
  }, [user, fetchFriends]);

  useEffect(() => {
    if (data) {
      const pending: FriendsValues[] = data.friends_list.filter(
        ({ status }: FriendsValues) => status === "pending"
      );
      const accepted: FriendsValues[] = data.friends_list.filter(
        ({ status }: FriendsValues) => status === "accepted"
      );
      setFriends({ pending, accepted });
    }
  }, [data]);

  return (
    <FriendsContext.Provider value={friends}>
      {children}
    </FriendsContext.Provider>
  );
};

export default FriendsProvider;
