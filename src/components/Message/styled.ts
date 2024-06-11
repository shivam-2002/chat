import styled from "styled-components";

const StyledMessage = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .container {
    width: 500px;
    height: 600px;
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
    position: relative;
  }

  .logout-ctn {
    position: absolute;
    right: 0px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #642de3;
    width: 100px;
    color: #fff;
    cursor: pointer;
  }

  .body {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .input-ctn {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin: 5px;
    align-items: center;
  }

  .parent-ctn {
    display: flex;
  }

  .col1 {
    width: 100px;
    display: flex;
    flex-direction: column;
  }

  .c1 {
    padding: 10px;
    background: #2ed1ab;
    border-bottom: 1px dashed grey;
    border-top: 1px dashed grey;
    cursor: pointer;
  }

  .msg-ctn {
    width: 100%;
    height: 560px;
    display: flex;
    // justify-content: center;
    // align-items: center;
    flex-direction: column;
    overflow-y: auto;
    background: #ebbdae;
    position: relative;
  }

  .send-ctn {
    position: absolute;
    bottom: 0px;
    width: 100%;
    margin: 0px;
    height: 40px;
    display: grid;
    justify-content: center;
    align-items: center;
    grid-template-columns: 3fr 1fr;
    gap: 5px;
  }

  .send {
    width: 80%;
    text-align: center;
    border: 1px solid #fff;
    cursor: pointer;
    padding-top: 5px;
    padding-bottom: 5px;
    border-radius: 5px;
  }

  .msg-input {
    height: 20px;
    padding: 5px;
    border: 1px solid grey;
    border-radius: 5px;
    outline: none;
    box-shadow: none;
    margin-left: 5px;
  }

  .active {
    background: #ebbdae;
  }

  .right {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }

  .left {
    width: 100%;
    display: flex;
    justify-content: flex-start;
  }

  .w-100 {
    width: 100%;
  }

  .msg-text {
    display: flex;
    flex-direction: column;
    margin: 5px;
    gap: 3px;
    align-items: center;
  }

  .add-email {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    background: #4287f5;
    padding: 10px 0;
    color: white;
    cursor: pointer;
  }

  .h-90 {
    height: 90%;
    overflow-y: auto;
  }

  .time-stamp {
    font-size: 12px;
    background: #a39590;
    padding: 2px;
    border-radius: 3px;
    color: #fff;
  }

  .message-text {
    font-size: 14px;
  }

  .h-90::-webkit-scrollbar {
    width: 5px; /* Set the width of the scrollbar */
  }

  /* Track */
  .h-90::-webkit-scrollbar-track {
    background: #f1f1f1; /* Color of the scrollbar track */
  }

  /* Handle */
  .h-90::-webkit-scrollbar-thumb {
    background: #c5c9ce; /* Color of the scrollbar handle */
    border-radius: 6px; /* Rounded corners */
  }

  /* Handle on hover */
  .h-90::-webkit-scrollbar-thumb:hover {
    background: #555; /* Color of the scrollbar handle on hover */
  }

  .user-name {
    font-size: 20px;
    font-weight: 500;
    margin: 10px;
  }
`;

export default StyledMessage;
