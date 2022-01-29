import React, { useRef } from "react";
import styled from "styled-components";

type Message = {
  content: string;
  sent_at: string;
  participant: {
    user: {
      username: string;
    };
  };
};

type MessagesProps = {
  messages: Message[];
};

const Messages = ({ messages }: MessagesProps) => {
  const prevDate = useRef<string>("");

  return (
    <>
      {messages.map(
        (
          {
            content,
            participant: {
              user: { username },
            },
            sent_at,
          },
          idx
        ) => {
          const date = new Date(sent_at).toLocaleDateString("en-GB");
          const time = new Date(sent_at).toTimeString();

          return (
            <React.Fragment key={idx}>
              {prevDate.current !== date && (
                <Divider>
                  <DividerDate>{(prevDate.current = date)}</DividerDate>
                </Divider>
              )}
              <MessageWithTime>
                <h2>
                  <Sender>{username.slice(0, username.indexOf("#"))}</Sender>
                  <Time>{time.slice(0, time.lastIndexOf(":"))}</Time>
                </h2>
                <Content>{content}</Content>
              </MessageWithTime>
            </React.Fragment>
          );
        }
      )}
    </>
  );
};

export default Messages;

const MessageWithTime = styled.li`
  margin-top: 10px;
  padding: 0.125rem 0;
`;

const Content = styled.div`
  font-size: 16px;
`;

const Sender = styled.span`
  font-size: 1rem;
  line-height: 1.375rem;
`;

const Time = styled.span`
  font-size: 12px;
  color: #72767d;
  margin-left: 8px;
`;

const Divider = styled.div`
  z-index: 1;
  height: 0;
  border-top: thin solid #72767d;
  margin-top: 20px;
  color: #72767d;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DividerDate = styled.span`
  font-size: 14px;
  padding: 2px 4px;
  background: white;
  margin-top: -1px;
`;
