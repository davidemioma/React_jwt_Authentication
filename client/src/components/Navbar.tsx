import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import UserBtn from "@/components/auth/UserBtn";

const Navbar = () => {
  const pathname = window.location.pathname;

  return (
    <div className="flex w-full max-w-[600px] items-center justify-between rounded-xl bg-white p-4 shadow-sm">
      <div className="flex flex-wrap gap-2">
        <Button
          asChild
          variant={pathname === "/client" ? "default" : "outline"}
        >
          <Link to="/profile">Profile</Link>
        </Button>

        <Button asChild variant={pathname === "/admin" ? "default" : "outline"}>
          <Link to="/admin">Admin</Link>
        </Button>

        <Button
          asChild
          variant={pathname === "/settings" ? "default" : "outline"}
        >
          <Link to="/settings">Settings</Link>
        </Button>
      </div>

      <UserBtn />
    </div>
  );
};

export default Navbar;
