import React from "react";
import styled from "styled-components";

const Spinner: React.FC = () => {
  return (
    <SpinnerContainer>
      <Loader />
    </SpinnerContainer>
  );
};

export default Spinner;

const SpinnerContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  z-index: 10;
  display: grid;
  place-items: center;
  background: white;
`;
const Loader = styled.div`
  border: 3px solid #f3f3f3;
  border-top-color: #4b4b4b;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;
