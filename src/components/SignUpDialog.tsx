import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useRouter } from "next/router";
import React from "react";

export interface SignUpDialogProps extends React.ComponentProps<any> {
  open: boolean;
  onClose: () => void;
}

const SignUpDialog = (props: SignUpDialogProps) => {
  const router = useRouter();
  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>Missing Account</DialogTitle>
      <DialogContent>
        <DialogContentText>
          This feature is only available to user with an Account, Sign Up or
          Login to get the full experience
        </DialogContentText>
        <DialogActions>
          <Button onClick={() => router.push("/signup")}>Sign Up</Button>
          <Button onClick={() => router.push("/login")} autoFocus>
            Login
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default SignUpDialog;
