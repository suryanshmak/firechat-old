import React from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useUser } from "../contexts/UserProvider";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { useFriends } from "../contexts/FriendsProvider";

type FormValues = {
  userTag: string;
};

const FETCH_RECEIVER_UID = gql`
  query FetchReceiverUid($username: String) {
    users(where: { username: { _eq: $username } }) {
      user_uid
    }
  }
`;

const ADD_FRIEND = gql`
  mutation AddFriend($sender_id: String, $receiver_id: String) {
    insert_friends(
      objects: { sender_id: $sender_id, receiver_id: $receiver_id }
      on_conflict: { constraint: friends_pkey, update_columns: [] }
    ) {
      affected_rows
    }
  }
`;

const AddFriend = () => {
  const { register, handleSubmit } = useForm<FormValues>();
  const { username, user_uid } = useUser();
  const [fetchReceiverUid, { data, loading }] =
    useLazyQuery(FETCH_RECEIVER_UID);
  const [addFriend] = useMutation(ADD_FRIEND);
  const { pending, accepted } = useFriends();

  const handleAddSubmit = async ({ userTag }: FormValues) => {
    const userExists = accepted?.find(({ username }) => username === userTag);
    const isSent = pending?.find(({ username }) => username === userTag);
    if (username === userTag || userExists || isSent) {
      alert("Don't mess with me");
      return;
    }
    await fetchReceiverUid({ variables: { username: userTag } });
    if (!loading && data?.users.length) {
      await addFriend({
        variables: { sender_id: user_uid, receiver_id: data.users[0].user_uid },
      });
    }
  };

  return (
    <AddFriendContainer>
      <h2 style={{ fontSize: "16px" }}>ADD FRIEND</h2>
      <Form onSubmit={handleSubmit(handleAddSubmit)}>
        <Input
          type="text"
          {...register("userTag", { required: true })}
          placeholder="Enter a Username#0000"
          maxLength={37}
        />
        <Button>Send request</Button>
      </Form>
    </AddFriendContainer>
  );
};

export default AddFriend;

const AddFriendContainer = styled.div`
  padding: 20px 30px;
`;

const Form = styled.form`
  position: relative;
  display: flex;
  padding: 16px 12px;
  align-items: center;
  margin-top: 10px;
  border: 1px solid rgba(79, 84, 92, 0.3);
  background: rgba(79, 84, 92, 0.02);
  border-radius: 5px;
  width: 100%;
`;

const Input = styled.input`
  flex: 1;
  background: transparent;
  font-size: 16px;
`;

const Button = styled.button`
  position: absolute;
  right: 10px;
  background: rgb(251, 191, 36);
  color: white;
  padding: 10px;
  border-radius: 4px;
`;
