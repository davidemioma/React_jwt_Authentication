import { ZodError } from "zod";
import { toast } from "sonner";
import { api } from "@/lib/api";
import CardWrapper from "./CardWrapper";
import { BeatLoader } from "react-spinners";
import { useCallback, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

type Props = {
  token: string | undefined;
};

const NewEmailForm = ({ token }: Props) => {
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationKey: ["change-email", token],
    mutationFn: async () => {
      if (!token) {
        toast.error("Invalid token!");

        return;
      }

      const res = await api.user["new-email"].$patch({ json: { token } });

      if (!res.ok) {
        const data = await res.json();

        throw new Error(data.error);
      }

      return res;
    },
    onSuccess: (res) => {
      if (res?.ok) {
        toast.success(
          "Email has been verified. Redirecting to sign in page...",
        );

        navigate({ to: "/auth/sign-in" });
      }
    },
    onError: (err) => {
      if (err instanceof ZodError) {
        toast.error(err.issues.map((issues) => issues.message).join(" ,"));
      } else {
        toast.error(err.message);
      }
    },
  });

  const verify = useCallback(() => {
    mutate();
  }, [token]);

  useEffect(() => {
    verify();
  }, [verify]);

  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonLabel="Back to login"
      backButtonHref="/auth/sign-in"
    >
      <div className="flex w-full items-center justify-center">
        {isPending && <BeatLoader />}
      </div>
    </CardWrapper>
  );
};

export default NewEmailForm;
