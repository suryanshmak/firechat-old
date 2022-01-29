import React, { useState } from "react";
import { useForm } from "react-hook-form";
import FormInput from "./FormInput";
import styled, { css } from "styled-components";
import SignUp from "./SignUp";
import firebase from "firebase/compat/app";
import { useHistory } from "react-router-dom";
import { auth, useAuth } from "../firebaseUtil";

export interface FormValues {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { register, handleSubmit, watch } = useForm<FormValues>();
  const [signUp, setSignUp] = useState<boolean>(false);
  let history = useHistory();
  const loginAndAddUser = useAuth();

  const handleFormSubmit = async (data: FormValues) => {
    await auth.signInWithEmailAndPassword(data.email, data.password);
    history.push("/channels/@me");
  };

  const handleLoginClick = async () => {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const { user } = await auth.signInWithPopup(provider);
      if (user) {
        await loginAndAddUser(user, user.displayName);
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <LoginPage>
      <LoginContainer>
        <WelcomeContainer />
        <Triangle />
        <FormContainer>
          <FormModal>
            <Form onSubmit={handleSubmit(handleFormSubmit)}>
              <FormInput
                type="email"
                {...register("email", { required: true })}
                shrink={!!watch("email")}
              />
              <FormInput
                type="password"
                {...register("password", { required: true })}
                shrink={!!watch("password")}
              />
              <LoginButton type="submit">Login</LoginButton>
              <Or>
                <Hr />
                <p style={{ padding: "0 8px" }}>OR</p>
                <Hr />
              </Or>
              <LoginButton onClick={handleLoginClick}>
                Log in with Google
              </LoginButton>
            </Form>
            <CreateAccount>
              Don't have an account ?
              <CreateAccButton onClick={() => setSignUp(true)}>
                Create an account
              </CreateAccButton>
            </CreateAccount>
          </FormModal>
        </FormContainer>
      </LoginContainer>
      {signUp && <SignUp setSignUp={setSignUp} />}
    </LoginPage>
  );
};

export default Login;

const placeCenter = css`
  display: grid;
  place-items: center;
`;

const LoginPage = styled.div`
  height: 100vh;
  width: 100%;
  ${placeCenter}
`;

const LoginContainer = styled.article`
  height: 85vh;
  width: 80%;
  box-shadow: rgba(100, 100, 111, 0.2) 0 7px 29px 0;
  border-radius: 8px;
  display: flex;
`;

const WelcomeContainer = styled.div`
  flex: 1;
  ${placeCenter}
`;

const Triangle = styled.div`
  width: 0;
  height: 0;
  border-left: 100px solid transparent;
  border-bottom: 85vh solid rgb(251, 191, 36);
`;

const FormContainer = styled.div`
  flex: 1;
  background: rgb(251, 191, 36);
  border-radius: 0 8px 8px 0;
  ${placeCenter}
`;

const FormModal = styled.div`
  width: 100%;
  ${placeCenter}
`;

const Form = styled.form`
  width: 65%;
  padding: 20px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  background: white;
  border-radius: 8px;
`;

export const LoginButton = styled.button`
  width: 100%;
  background: #1a535c;
  font-size: 15px;
  padding: 12px 10px;
  color: white;
  border-radius: 5px;
`;

const Or = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 0;
  color: #5f5f5f;
`;

const Hr = styled.span`
  background: #bababa;
  height: 1px;
  flex: 1;
`;

const CreateAccount = styled.span`
  color: white;
  margin-top: 15px;
`;

const CreateAccButton = styled.button`
  color: white;
  font-size: 15px;
  padding-left: 5px;
  text-decoration: underline;
`;
