import NewPasswordForm from "@/components/auth/NewPasswordForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/new-password")({
  component: () => {
    const urlSearchString = window.location.search;

    const params = new URLSearchParams(urlSearchString);

    const token = params.get("token") || undefined;

    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
        <NewPasswordForm token={token} />
      </div>
    );
  },
});
