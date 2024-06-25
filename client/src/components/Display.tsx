import { Button } from "@/components/ui/button";
import LoginBtn from "@/components/auth/LoginBtn";

const Display = () => {
  return (
    <main className="flex h-screen w-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-6 rounded-md border p-4 text-center shadow-md sm:p-6">
        <h1 className="text-6xl font-semibold drop-shadow-md">🔐 Auth</h1>

        <p className="text-lg">A simple authentication service.</p>

        <div>
          <LoginBtn mode="modal" asChild>
            <Button size="lg" variant="default">
              Sign In
            </Button>
          </LoginBtn>
        </div>
      </div>
    </main>
  );
};

export default Display;
