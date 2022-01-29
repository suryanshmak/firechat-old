import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { useHistory } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
const randomatic = require("randomatic");

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "firechat-f51c7.firebaseapp.com",
  projectId: "firechat-f51c7",
  storageBucket: "firechat-f51c7.appspot.com",
  messagingSenderId: "618428779274",
  appId: "1:618428779274:web:cd16a01902b0fa3c54c8f3",
  measurementId: "G-8GPSHDDPM2",
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();

const ADD_USER = gql`
  mutation AddUser($username: String, $email: String, $user_uid: String) {
    insert_users(
      objects: { username: $username, email: $email, user_uid: $user_uid }
      on_conflict: { constraint: users_pkey, update_columns: [] }
    ) {
      affected_rows
    }
  }
`;

export const useAuth = () => {
  let history = useHistory();
  const [addUser] = useMutation(ADD_USER);

  return async (user: firebase.User | null, username: string | null) => {
    await user?.updateProfile({
      displayName: `${username}#${randomatic("0", 4)}`,
    });

    await addUser({
      variables: {
        username: user?.displayName,
        email: user?.email,
        user_uid: user?.uid,
      },
    });
    history.push("/channels/@me");
  };
};
