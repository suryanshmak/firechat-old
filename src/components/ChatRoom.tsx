import React from "react";
import Sidebar from "./Sidebar";
import Conversation from "./Conversation";
import styled from "styled-components";
import Friends from "./Friends";
import { Route, Switch, useRouteMatch } from "react-router-dom";

const ChatRoom = () => {
  let { path } = useRouteMatch();

  return (
    <ChatRoomContainer>
      <GroupsSidebar />
      <Content>
        <Sidebar />
        <Switch>
          <Route path={`${path}`} exact component={Friends} />
          <Route path={`${path}/:id`} component={Conversation} />
        </Switch>
      </Content>
    </ChatRoomContainer>
  );
};

export default ChatRoom;

const ChatRoomContainer = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
`;

const GroupsSidebar = styled.div`
  width: 72px;
  background: #e3e5e8;
`;
