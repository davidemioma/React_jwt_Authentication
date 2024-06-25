import React from "react";
import LoginForm from "./LoginForm";
import { useNavigate } from "@tanstack/react-router";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

type Props = {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
};

const LoginBtn = ({ children, mode, asChild }: Props) => {
  const navigate = useNavigate();

  if (mode === "modal") {
    return (
      <Dialog>
        <DialogTrigger asChild={asChild}>{children}</DialogTrigger>

        <DialogContent className="w-auto border-none bg-transparent p-0">
          <LoginForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <span
      onClick={() => navigate({ to: "/auth/sign-in" })}
      className="cursor-pointer"
    >
      {children}
    </span>
  );
};

export default LoginBtn;
