import React from "react";
import styled from "styled-components";
import ConversationsTab from "./ConversationsTab";
import { BsPeopleCircle, BsPeopleFill } from "react-icons/bs";
import { MdSettings } from "react-icons/md";
import Spinner from "./Spinner";
import { useUser } from "../contexts/UserProvider";
import { useFriends } from "../contexts/FriendsProvider";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const { username } = useUser();
  const { pending } = useFriends();

  if (!username || !pending) {
    return <Spinner />;
  }

  return (
    <SidebarContainer>
      <input placeholder="Find a conversation" />
      <FriendsTab>
        <Friends to="/channels/@me">
          <BsPeopleFill fontSize="20px" />
          <FriendsSpan>Friends</FriendsSpan>
          {pending.length !== 0 && <FriendReqs>{pending.length}</FriendReqs>}
        </Friends>
      </FriendsTab>
      <ConversationsTab />
      <ProfileContainer>
        <BsPeopleCircle size="24px" />
        <UserInfo>
          <UserName>{username?.slice(0, username.indexOf("#"))}</UserName>
          <Tag>{username?.slice(username.indexOf("#"))}</Tag>
        </UserInfo>
        <MdSettings
          style={{ position: "absolute", right: "30px" }}
          fontSize="20px"
        />
      </ProfileContainer>
    </SidebarContainer>
  );
};

export default Sidebar;

const SidebarContainer = styled.div`
  position: relative;
  height: 100vh;
  width: 250px;
  background: #f2f3f5;
  padding: 0 10px;
`;

const ProfileContainer = styled.div`
  position: absolute;
  height: 60px;
  width: 100%;
  bottom: 0;
  left: 0;
  padding: 0 20px;
  display: flex;
  background: #ebedef;
  align-items: center;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 8px;
`;

const UserName = styled.span`
  font-size: 14px;
`;

const Tag = styled.span`
  font-size: 12px;
`;

const FriendsTab = styled.div`
  margin-top: 10px;
`;

const FriendReqs = styled.span`
  position: absolute;
  right: 20px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: rgb(237, 65, 69);
  color: white;
  display: grid;
  place-items: center;
`;

const Friends = styled(Link)`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  :hover {
    background: rgba(116, 127, 141, 0.24);
  }
`;

const FriendsSpan = styled.span`
  color: #060607;
  font-size: 16px;
  margin-left: 10px;
`;
