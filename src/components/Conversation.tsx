import React, { FormEvent, useRef } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import Spinner from "./Spinner";
import { AiOutlineSend } from "react-icons/ai";
import { useUser } from "../contexts/UserProvider";
import Messages from "./Messages";
import { useChannel } from "../contexts/ChannelProvider";

const CHANNEL_MESSAGE_SUBSCRIPTION = gql`
  subscription ChannelMessage($channel_id: uuid) {
    messages(
      where: { channel_id: { _eq: $channel_id } }
      order_by: { sent_at: asc }
    ) {
      id
      content
      sent_at
      participant {
        user {
          username
        }
      }
    }
  }
`;

const ADD_MESSAGE = gql`
  mutation AddMessage($user_uid: String, $content: String, $channel_id: uuid) {
    insert_messages(
      objects: {
        user_uid: $user_uid
        content: $content
        channel_id: $channel_id
      }
    ) {
      affected_rows
    }
  }
`;

const Conversation = () => {
  let { id } = useParams<{ id: string }>();
  const [addMessage] = useMutation(ADD_MESSAGE);
  const user = useUser();
  const messageRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { data, loading } = useSubscription(CHANNEL_MESSAGE_SUBSCRIPTION, {
    variables: { channel_id: id },
  });

  if (loading || !user) {
    return <Spinner />;
  }

  const { messages } = data;
  // const reducedMessages = channel[0].messages.reduce(
  //   (messages: any[], cMessage: Message) => {
  //     let event = new Date(cMessage.sent_at);
  //     let date: any = event.toLocaleDateString("en-GB");
  //
  //     if (messages[date]) {
  //       messages[date].push(cMessage);
  //       return messages;
  //     }
  //     messages[date] = [cMessage];
  //     return messages;
  //   },
  //   {}
  // );

  const handleMessageSubmit = async (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (messageRef.current?.innerText) {
      const content = messageRef.current.innerText;
      messageRef.current.innerText = "";
      await addMessage({
        variables: {
          user_uid: user.user_uid,
          content,
          channel_id: id,
        },
      });
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleMessageChange = async (
    e: React.KeyboardEvent<HTMLDivElement>
  ) => {
    if (e.shiftKey && e.key === "Enter") return;
    if (e.key === "Enter") {
      e.preventDefault();
      await handleMessageSubmit();
    }
  };

  return (
    <ConversationContainer>
      <MessageContainer>
        <h2>This is the beginning of your chat history</h2>
        <Messages messages={data.messages} />
        <div style={{ padding: "10px 0" }} ref={scrollRef} />
      </MessageContainer>
      <Form onSubmit={(e) => handleMessageSubmit(e)}>
        <TextArea>
          <Input
            ref={messageRef}
            role="textbox"
            contentEditable="true"
            dir="auto"
            autoCorrect="off"
            spellCheck="true"
            aria-autocomplete="list"
            aria-multiline="true"
            aria-label="Enter a Message"
            onKeyDown={(e) => handleMessageChange(e)}
          />
          <Button type="submit">
            <AiOutlineSend fontSize="18px" />
          </Button>
        </TextArea>
      </Form>
    </ConversationContainer>
  );
};

export default Conversation;

const ConversationContainer = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
`;
const Form = styled.form`
  position: relative;
  padding: 0 20px;
  margin-bottom: 20px;
`;

const TextArea = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  border-radius: 5px;
  max-height: 50vh;
  background: rgba(79, 84, 92, 0.08);
  padding: 10px;
`;

const Input = styled.div`
  background: transparent;
  width: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  font-size: 16px;
  color: black;
  max-height: inherit;
  :focus {
    outline: none;
  }
`;

const Button = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
`;

const MessageContainer = styled.ol`
  list-style: none;
  flex: 1 1 auto;
  margin: 0 18px;
  overflow-y: scroll;
`;
