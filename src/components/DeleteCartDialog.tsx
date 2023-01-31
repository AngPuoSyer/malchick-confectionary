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

export interface DeleteCartDialogProps extends React.ComponentProps<any> {
  open: boolean;
  proudctName: string;
  onClose: () => void;
  onItemDelete: () => void;
}

const DeleteCartDialog = (props: DeleteCartDialogProps) => {
  const router = useRouter();
  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>Delete {props.proudctName} from cart?</DialogTitle>
      <DialogContent>
        <DialogContentText>This action cannot be undone</DialogContentText>
        <DialogActions>
          <Button onClick={props.onClose} autoFocus color="error">
            No
          </Button>
          <Button onClick={props.onItemDelete}>Yes</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteCartDialog;
