import { toast } from "sonner";
import { api } from "@/lib/api";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

type Props = {
  children?: React.ReactNode;
};

const LogoutBtn = ({ children }: Props) => {
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationKey: ["sign-out"],
    mutationFn: async () => {
      const res = await api.auth.logout.$get();

      if (!res.ok) {
        throw new Error("Something went wrong!");
      }
    },
    onSuccess: () => {
      navigate({ to: "/auth/sign-in" });
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong!");
    },
  });

  return (
    <Button
      variant="ghost"
      onClick={() => mutate()}
      className="w-full cursor-pointer"
      disabled={isPending}
    >
      {children}
    </Button>
  );
};

export default LogoutBtn;
