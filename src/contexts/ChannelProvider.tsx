import {
  ReactElement,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { gql, useLazyQuery } from "@apollo/client";
import { useUser } from "./UserProvider";

type ChannelProviderProps = {
  children: ReactElement;
};

export type ChannelValues = {
  id: string;
  participants: [
    {
      user: {
        username: string;
        user_uid: string;
      };
    }
  ];
};

const ChannelContext = createContext<ChannelValues[]>([]);

export const useChannel = () => useContext(ChannelContext);

const FETCH_USER_CHANNELS = gql`
  query FetchUserChannels($user_uid: String) {
    channel(where: { participants: { user_uid: { _eq: $user_uid } } }) {
      id
      participants(where: { user_uid: { _neq: $user_uid } }) {
        user {
          username
          user_uid
        }
      }
    }
  }
`;

const ChannelProvider = ({ children }: ChannelProviderProps) => {
  const [fetchChannel, { data }] = useLazyQuery(FETCH_USER_CHANNELS, {
    notifyOnNetworkStatusChange: true,
  });
  const [channel, setChannel] = useState<ChannelValues[]>([]);
  const user = useUser();

  useEffect(() => {
    if (user.user_uid) fetchChannel({ variables: { user_uid: user.user_uid } });
  }, [user, fetchChannel]);

  useEffect(() => {
    if (data) setChannel(data.channel);
  }, [data]);

  return (
    <ChannelContext.Provider value={channel}>
      {children}
    </ChannelContext.Provider>
  );
};

export default ChannelProvider;
