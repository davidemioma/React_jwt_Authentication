import ResetForm from "@/components/auth/ResetForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/reset")({
  component: () => (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
      <ResetForm />
    </div>
  ),
});
