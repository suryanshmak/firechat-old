import React, { useState } from "react";
import styled from "styled-components";
import FriendRequests from "./FriendRequests";
import AllFriends from "./AllFriends";
import AddFriend from "./AddFriend";

const Friends: React.FC = () => {
  const ADD_FRIEND = "Add Friend";
  const ALL = "All";
  const PENDING = "Pending";
  const [selectedTab, setSelectedTab] = useState<string>(ALL);
  const isAllSelected = selectedTab === ALL;
  const isAddFriendSelected = selectedTab === ADD_FRIEND;
  const isPendingSelected = selectedTab === PENDING;

  return (
    <FriendsContainer>
      <Nav>
        <Item onClick={() => setSelectedTab(ALL)} itemScope={isAllSelected}>
          {ALL}
        </Item>
        <Item
          onClick={() => setSelectedTab(ADD_FRIEND)}
          itemScope={isAddFriendSelected}
        >
          {ADD_FRIEND}
        </Item>
        <Item
          onClick={() => setSelectedTab(PENDING)}
          itemScope={isPendingSelected}
        >
          {PENDING}
        </Item>
      </Nav>
      <Content>
        {isAllSelected && <AllFriends />}
        {isAddFriendSelected && <AddFriend />}
        {isPendingSelected && <FriendRequests />}
      </Content>
    </FriendsContainer>
  );
};

export default Friends;

const FriendsContainer = styled.div`
  position: relative;
  height: 100vh;
  flex: 1;
`;

const Nav = styled.nav`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 48px;
  padding: 0 8px;
  line-height: 20px;
  border-bottom: 1px solid rgba(79, 84, 92, 0.3);
`;

const Item = styled.button`
  padding: 4px 8px;
  margin: 0 8px;
  background: ${(props) =>
    props.itemScope ? "rgba(116, 127, 141, 0.24)" : ""};
  border-radius: 4px;
  font-size: 15px;
  :hover {
    background: rgba(116, 127, 141, 0.1);
  }
`;

const Content = styled.div``;
