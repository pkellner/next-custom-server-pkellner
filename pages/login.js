import React from "react";

function Login(props) {
  return (
    <form action="/login" method="POST">
        <br/>
      username: <input type="text" name="username" /><br/>
      password: <input type="password" name="password" /><br/>
      <input type="submit" />
    </form>
  );
}

export default Login;
