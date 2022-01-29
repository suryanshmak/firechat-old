import React from "react";
import { BsFillChatSquareFill } from "react-icons/bs";
import { FiMoreVertical } from "react-icons/fi";
import styled from "styled-components";
import { FriendsValues } from "../contexts/FriendsProvider";
import { useFriends } from "../contexts/FriendsProvider";
import { gql, useMutation } from "@apollo/client";
import { useUser } from "../contexts/UserProvider";
import { v4 as uuidv4 } from "uuid";
import { useHistory } from "react-router-dom";
import { useChannel } from "../contexts/ChannelProvider";
import Spinner from "./Spinner";

const ADD_CHANNEL = gql`
  mutation AddChannel($friend_uid: String, $uid: String, $uuid: uuid) {
    insert_channel(
      objects: {
        participants: { data: [{ user_uid: $friend_uid }, { user_uid: $uid }] }
        id: $uuid
      }
    ) {
      affected_rows
    }
  }
`;

const AllFriends = () => {
  const { accepted } = useFriends();
  const [addChannel] = useMutation(ADD_CHANNEL);
  const user = useUser();
  let history = useHistory();
  const channel = useChannel();

  const onFriendClick = async (user_uid?: string) => {
    const channelExists = channel.find(
      ({ participants }) => participants[0].user.user_uid === user_uid
    );

    if (channelExists) {
      history.push(`/channels/@me/${channelExists.id}`);
      return;
    }
    await addChannel({
      variables: { friend_uid: user_uid, uid: user?.user_uid, uuid: uuidv4() },
    });
  };

  if (!accepted) {
    return <Spinner />;
  }
  return (
    <AllFriendsContainer>
      <span>All - {accepted?.length}</span>
      <Content>
        {accepted?.map(({ username, user_uid }: FriendsValues, id: number) => (
          <Friend key={id} onClick={() => onFriendClick(user_uid)}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span>{username}</span>
            </div>
            <ActionButtonContainer>
              <ActionButton>
                <BsFillChatSquareFill />
              </ActionButton>
              <ActionButton>
                <FiMoreVertical />
              </ActionButton>
            </ActionButtonContainer>
          </Friend>
        ))}
      </Content>
    </AllFriendsContainer>
  );
};

export default AllFriends;

const AllFriendsContainer = styled.div`
  padding: 20px;
`;

const Content = styled.div`
  margin-top: 10px;
`;

const Friend = styled.div`
  height: 62px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgb(6, 6, 7, 0.08);
  cursor: pointer;
  padding: 0 10px;
  border-radius: 8px;
  :hover {
    background-color: rgb(6, 6, 7, 0.04);
  }
`;

const ActionButtonContainer = styled.div`
  display: flex;
`;

const ActionButton = styled.div`
  cursor: pointer;
  height: 36px;
  width: 36px;
  border-radius: 50%;
  color: #4f5660;
  display: grid;
  place-items: center;
  background-color: #f2f3f5;
  margin-left: 10px;
  font-size: 16px;
`;
