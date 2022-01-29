import { BsCheck } from "react-icons/bs";
import { FiX } from "react-icons/fi";
import styled from "styled-components";
import { useUser } from "../contexts/UserProvider";
import { useFriends } from "../contexts/FriendsProvider";
import { FriendsValues } from "../contexts/FriendsProvider";
import { gql, useMutation } from "@apollo/client";

const DELETE_REQUEST = gql`
  mutation DeleteRequest($sender_id: String, $receiver_id: String) {
    delete_friends(
      where: {
        sender_id: { _eq: $sender_id }
        receiver_id: { _eq: $receiver_id }
      }
    ) {
      affected_rows
    }
  }
`;

const UPDATE_FRIENDS_STATUS = gql`
  mutation UpdateFriendsStatus($sender_id: String, $receiver_id: String) {
    update_friends(
      where: {
        sender_id: { _eq: $sender_id }
        receiver_id: { _eq: $receiver_id }
      }
      _set: { status: "accepted" }
    ) {
      affected_rows
    }
  }
`;

const FriendRequests = () => {
  const user = useUser();
  const { pending } = useFriends();
  const [deleteRequest] = useMutation(DELETE_REQUEST);
  const [updateFriendsStatus] = useMutation(UPDATE_FRIENDS_STATUS);

  const handleAcceptClick = async ({
    sender_id,
    receiver_id,
  }: FriendsValues) => {
    await updateFriendsStatus({ variables: { sender_id, receiver_id } });
  };

  const handleDeclineClick = async ({
    sender_id,
    receiver_id,
  }: FriendsValues) => {
    await deleteRequest({ variables: { sender_id, receiver_id } });
  };

  return (
    <Pending>
      <span>Pending - {pending?.length}</span>
      <PendingRequests>
        {pending?.map(
          (
            { username, sender_id, receiver_id }: FriendsValues,
            idx: number
          ) => {
            const hasUserSent: boolean = user.user_uid === sender_id;
            return (
              <Request key={idx}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span>{username}</span>
                  <span style={{ fontSize: "14px" }}>
                    {hasUserSent
                      ? "Outgoing Request"
                      : "Incoming Friend Request"}
                  </span>
                </div>
                <ActionButtonContainer>
                  {!hasUserSent && (
                    <ActionButton
                      onClick={() =>
                        handleAcceptClick({ sender_id, receiver_id })
                      }
                    >
                      <BsCheck />
                    </ActionButton>
                  )}
                  <ActionButton
                    onClick={() =>
                      handleDeclineClick({ sender_id, receiver_id })
                    }
                  >
                    <FiX />
                  </ActionButton>
                </ActionButtonContainer>
              </Request>
            );
          }
        )}
      </PendingRequests>
    </Pending>
  );
};

export default FriendRequests;

const Pending = styled.div`
  padding: 20px;
`;

const PendingRequests = styled.div`
  margin-top: 10px;
`;

const Request = styled.div`
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
  font-size: 18px;
`;
