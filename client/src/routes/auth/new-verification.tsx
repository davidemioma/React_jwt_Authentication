import NewVerificationForm from "@/components/auth/NewVerificationForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/new-verification")({
  component: () => {
    const urlSearchString = window.location.search;

    const params = new URLSearchParams(urlSearchString);

    const token = params.get("token") || undefined;

    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
        <NewVerificationForm token={token} />
      </div>
    );
  },
});
