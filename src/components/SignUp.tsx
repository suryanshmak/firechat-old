import React from "react";
import { FormValues } from "./Login";
import { useForm } from "react-hook-form";
import FormInput from "./FormInput";
import ReactDOM from "react-dom";
import { LoginButton } from "./Login";
import styled from "styled-components";
import { AiOutlineClose } from "react-icons/ai";
import { auth, useAuth } from "../firebaseUtil";

interface SignUpProps {
  setSignUp: (signUp: boolean) => void;
}

interface SignUpValues extends FormValues {
  userName: string;
}

const SignUp: React.FC<SignUpProps> = ({ setSignUp }) => {
  const { register, watch, handleSubmit } = useForm<SignUpValues>();
  const loginAndAddUser = useAuth();

  const handleFormSubmit = async ({
    email,
    password,
    userName,
  }: SignUpValues) => {
    try {
      auth
        .createUserWithEmailAndPassword(email, password)
        .then(async ({ user }) => {
          await loginAndAddUser(user, userName);
        });
      setSignUp(false);
    } catch (error) {
      alert(error);
    }
  };

  const portalDiv = document.getElementById("sign-up");

  return portalDiv
    ? ReactDOM.createPortal(
        <SignUpPage>
          {/*{!isVerified && <Verification><AiFillCheckCircle color="#4cc93f"/><p>Verification email sent! Please verify to start chatting.</p></Verification>}*/}
          <FormContainer>
            <div>
              <SignUpH3>Sign Up.</SignUpH3>
              <hr />
              <SignUpH3 style={{ padding: "8px 0 " }}>
                It's quick and easy.
              </SignUpH3>
              <CloseButton onClick={() => setSignUp(false)}>
                <AiOutlineClose fontSize="18px" />
              </CloseButton>
            </div>
            <Form onSubmit={handleSubmit(handleFormSubmit)}>
              <FormInput
                type="text"
                {...register("userName", { required: true })}
                shrink={!!watch("userName")}
                maxLength={37}
              />
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
              <LoginButton type="submit">Sign up</LoginButton>
            </Form>
          </FormContainer>
        </SignUpPage>,
        portalDiv
      )
    : null;
};

export default SignUp;

const SignUpPage = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  display: grid;
  place-items: center;
  z-index: 99;
  background: rgba(0, 0, 0, 0.4);
`;

const Verification = styled.div`
  position: absolute;
  top: 20px;
  background: white;
  padding: 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  p {
    padding-left: 5px;
  }
`;

const FormContainer = styled.div`
  position: relative;
  padding: 20px;
  border-radius: 5px;
  width: calc(10vw + 16rem);
  background: white;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
`;

const SignUpH3 = styled.h3`
  font-weight: 200;
  padding-bottom: 8px;
`;

const Form = styled.form`
  display: flex;
  text-align: center;
  flex-direction: column;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 18px;
`;
