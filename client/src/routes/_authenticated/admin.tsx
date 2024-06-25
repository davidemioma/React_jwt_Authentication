import { api } from "@/lib/api";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import ProtectedLayout from "@/components/ProtectedLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/admin")({
  component: () => {
    const [message, setMessage] = useState<string | null>(null);

    const { mutate, isPending } = useMutation({
      mutationKey: ["test-admin"],
      mutationFn: async () => {
        const res = await api.user["admin-only"].$get();

        const data = await res.json();

        if (!res.ok) {
          setMessage(data.message);

          throw new Error(data.message);
        }

        return data;
      },
      onSuccess: (data) => {
        setMessage(data.message);
      },
      onError: (error) => {
        setMessage(error.message);
      },
    });

    return (
      <ProtectedLayout>
        <Card className="w-full max-w-[600px]">
          <CardHeader>
            <p className="text-center text-2xl font-semibold">🔑 Admin</p>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-3 shadow-md">
              <p className="text-sm font-medium">Admin-only API Route</p>

              <Button onClick={() => mutate()} disabled={isPending}>
                Click to test
              </Button>
            </div>

            {message && (
              <p className="text-center text-xl font-bold">{message}</p>
            )}
          </CardContent>
        </Card>
      </ProtectedLayout>
    );
  },
});
