import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Open Sans', sans-serif;
      overflow-y: hidden;
    }
    button {
      outline: none;
      border: none;
      cursor: pointer;
      background: none;
    } 
    a {
      text-decoration: none;
      color: black;
    }
    input {
      border: none;
      :focus {
        outline: none;
      }
    }
`;

export default GlobalStyles;
