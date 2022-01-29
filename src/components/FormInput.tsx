import React from "react";
import styled, { css } from "styled-components";

interface FormInputProps {
  name: string;
  type: string;
  shrink?: boolean;
  maxLength?: number;
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  (props, ref) => {
    return (
      <FormGroup>
        <Input ref={ref} {...props} />
        <Label className={props.shrink ? "shrink" : ""}>
          {props.name.toUpperCase()}
        </Label>
      </FormGroup>
    );
  }
);

export default FormInput;

const shrinkLabel = css`
  top: 1px;
  left: 8px;
  color: black;
  font-size: 0.7rem;
`;

const FormGroup = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  flex: 1;
  input[type="password"] {
    letter-spacing: 0.2em;
  }
`;

const Input = styled.input`
  font-family: "Open Sans", sans-serif;
  font-size: 15px;
  width: 100%;
  padding: 18px 10px 10px 6px;
  border: 1px solid #c2c2c2;
  border-radius: 4px;
  background: #f8f8f8;

  :focus {
    border-color: #8a8a8a;
  }

  :focus ~ label {
    ${shrinkLabel}
  }
`;

const Label = styled.label`
  color: #9d9d9d;
  font-size: 14px;
  font-weight: normal;
  position: absolute;
  pointer-events: none;
  left: 15px;
  top: 15px;
  transition: 300ms ease all;

  &.shrink {
    ${shrinkLabel}
  }
`;
