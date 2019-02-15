import React from "react";

function Login(props : any) {
  let z = 100;
  let x = 11111;
  if (z) {
    x = 17;
  } else {
    x = 18;
  }
  console.log(x);

  return (
    <form action="/login" method="POST">
      <br />
      username: <input type="text" name="username" />
      <br />
      password: <input type="password" name="password" />
      <br />
      <input type="submit" />
    </form>
  );
}

export default Login;
