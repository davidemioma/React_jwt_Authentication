import NewEmailForm from "@/components/auth/NewEmailForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/new-email")({
  component: () => {
    const urlSearchString = window.location.search;

    const params = new URLSearchParams(urlSearchString);

    const token = params.get("token") || undefined;

    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
        <NewEmailForm token={token} />
      </div>
    );
  },
});
