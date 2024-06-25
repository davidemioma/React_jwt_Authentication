import { BeatLoader } from "react-spinners";
import Display from "@/components/Display";
import { Badge } from "@/components/ui/badge";
import { authUserQueryOptions } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import ProtectedLayout from "@/components/ProtectedLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/profile")({
  component: () => {
    const { data: user, isLoading, error } = useQuery(authUserQueryOptions);

    if (isLoading) {
      return (
        <div className="flex w-40 items-center justify-center p-4">
          <BeatLoader />
        </div>
      );
    }

    if (error) {
      return <Display />;
    }

    return (
      <ProtectedLayout>
        <Card className="w-full max-w-[600px] shadow-md">
          <CardHeader>
            <p className="text-center text-2xl font-semibold">Profile</p>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <p className="text-sm font-medium">ID</p>

              <p className="max-w-[180px] truncate rounded-md bg-slate-100 p-1 font-mono text-xs">
                {user?.id}
              </p>
            </div>

            <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <p className="text-sm font-medium">Name</p>

              <p className="max-w-[180px] truncate rounded-md bg-slate-100 p-1 font-mono text-xs">
                {user?.name}
              </p>
            </div>

            <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <p className="text-sm font-medium">Email</p>

              <p className="max-w-[180px] truncate rounded-md bg-slate-100 p-1 font-mono text-xs">
                {user?.email}
              </p>
            </div>

            <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <p className="text-sm font-medium">Role</p>

              <p className="max-w-[180px] truncate rounded-md bg-slate-100 p-1 font-mono text-xs">
                {user?.role}
              </p>
            </div>

            <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <p className="text-sm font-medium">Two Factor Authentication</p>

              <Badge
                variant={user?.isTwoFactorEnabled ? "success" : "destructive"}
              >
                {user?.isTwoFactorEnabled ? "ON" : "OFF"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </ProtectedLayout>
    );
  },
});
