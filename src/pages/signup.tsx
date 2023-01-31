import { NextPage } from "next";
import { Button, TextField } from "@mui/material";
import { api } from "../utils/api";
import { useRef, useState } from "react";
import { UserRoleEnum } from "@prisma/client";
import { signIn } from "next-auth/react";

const SignUpPage: NextPage = () => {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const [errMsg, setErrMsg] = useState("Invalid Input");
  const [tempErr, setTempErr] = useState(false);
  const signUpMutation = api.user.signUp.useMutation({
    onSuccess: (data) => {
      signIn("credentials", {
        callbackUrl: "/",
        email: data.email,
        password: data.password,
        role: data.role,
      });
    },
  });

  const signUpFn = async () => {
    if (
      !nameRef.current?.value ||
      !emailRef.current?.value ||
      !passwordRef.current?.value ||
      !confirmPasswordRef.current?.value ||
      passwordRef.current.value !== confirmPasswordRef.current?.value
    ) {
      return setTempErr(true);
    }
    signUpMutation.mutate({
      name: nameRef.current?.value,
      email: emailRef.current?.value,
      password: passwordRef.current?.value,
    });
  };
  return (
    <div className="container grid h-screen place-items-center">
      <div className="mx-auto  w-1/2 -translate-y-2.5 rounded border-2 border-gray-500">
        <div className=" w-full p-8">
          <h1 className="text-4xl font-bold">Sign Up</h1>
          {tempErr && (
            <div className="mt-4 text-lg text-red-500">{errMsg} </div>
          )}
          <div className="mt-6 flex flex-col gap-10">
            <TextField label="Name" required inputRef={nameRef}></TextField>
            <TextField label="Email" required inputRef={emailRef}></TextField>
            <TextField
              label="Password"
              type="password"
              required
              inputRef={passwordRef}
            ></TextField>
            <TextField
              label="Confirm Password"
              type="password"
              required
              inputRef={confirmPasswordRef}
            ></TextField>
          </div>
          <div className="flex justify-between">
            <div></div>
            <Button
              size="large"
              className="mt-6 mr-6"
              onClick={signUpFn}
              disabled={signUpMutation.isLoading}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>
      <div className="h-1/12"></div>
    </div>
  );
};

export default SignUpPage;
