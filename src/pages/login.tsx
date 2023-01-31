import { NextPage } from "next";
import { Button, TextField } from "@mui/material";
import { signIn } from "next-auth/react";
import { useRef } from "react";

const LoginPage: NextPage = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  return (
    <div className="container grid h-screen place-items-center">
      <div className="mx-auto  w-1/2 -translate-y-2.5 rounded border-2 border-gray-500">
        <div className=" w-full p-8">
          <h1 className="text-4xl font-bold">Login</h1>
          <div className="mt-6 flex flex-col gap-10">
            <TextField label="Email" required inputRef={emailRef}></TextField>
            <TextField
              label="Password"
              type="password"
              required
              inputRef={passwordRef}
            ></TextField>
          </div>
          <div className="flex justify-between">
            <div></div>
            <Button
              size="large"
              className="mt-6 mr-6"
              onClick={() => {
                signIn("credentials", {
                  callbackUrl: "/",
                  email: emailRef?.current?.value,
                  password: passwordRef.current?.value,
                });
              }}
            >
              Login
            </Button>
          </div>
        </div>
      </div>
      <div className="h-1/12"></div>
    </div>
  );
};

export default LoginPage;
