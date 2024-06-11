import styled from "styled-components";

const StyledLogin = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  .container {
    width: 400px;
    height: 400px;
    border: 1px solid grey;
  }

  .header {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    font-size: 16px;
    justify-content: center;
    border-bottom: 1px solid green;
  }

  .body {
    margin-top: 10px;
    display: grid;
    grid-template-columns: 0.75fr 1.25fr;
  }

  .col {
    width: 80%;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-row: 50px;
    gap: 10px;
    margin: 20px 10% 10px 10%;
  }

  .input-ctn {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 30px 10px;
  }

  .footer {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 40px;
  }

  .footer1 {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 10px;
  }

  .submit-ctn {
    cursor: pointer;
    padding: 10px 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    border: 1px solid grey;
    border-radius: 5px;
  }

  .input {
    border: 1px solid grey;
    box-shadow: none;
    outline: none;
    height: 20px;
    width: 100%;
  }

  .password-input {
    border: 1px solid grey;
    box-shadow: none;
    outline: none;
    height: 20px;
    width: calc(100% - 30px);
    padding-right: 30px;
  }

  .signup {
    font-size: 14px;
    cursor: pointer;
    color: blue;
  }

  .text {
    font-size: 13px;
  }

  .error {
    border: 1px solid red;
  }

  .error-text {
    color: red;
    font-size: 10px;
  }

  .password-ctn {
    position: relative;
  }

  .pass-show-icon {
    position: absolute;
    right: 0;
    top: 1px;
    width: 20px;
    height: 20px;
    cursor: pointer;
  }

  .google-logo {
    width: 20px;
    height: 20px;
  }
`;

export default StyledLogin;
