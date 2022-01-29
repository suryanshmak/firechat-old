import React from "react";
import styled from "styled-components";
import { BsPlus } from "react-icons/bs";
import { useChannel } from "../contexts/ChannelProvider";
import { Link } from "react-router-dom";
import Spinner from "./Spinner";

const ConversationsTab = () => {
  const channel = useChannel();

  if (!channel.length) {
    return <Spinner />;
  }

  return (
    <Conversations>
      <HeaderText>
        <span>Conversations</span>
        <button>
          <BsPlus fontSize="21px" />
        </button>
      </HeaderText>
      <ConversationsContainer>
        {channel.map(({ id, participants }, idx: number) => (
          <Conversation key={idx} to={`/channels/@me/${id}`}>
            {participants.map(({ user: { username } }) =>
              username.slice(0, username.indexOf("#"))
            )}
          </Conversation>
        ))}
      </ConversationsContainer>
    </Conversations>
  );
};

export default ConversationsTab;

const Conversations = styled.div`
  margin-top: 10px;
`;

const HeaderText = styled.span`
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ConversationsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Conversation = styled(Link)`
  cursor: pointer;
  border-radius: 5px;
  padding: 10px;
  :hover {
    background: rgb(6, 6, 7, 0.04);
  }
`;
