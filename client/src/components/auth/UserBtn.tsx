import Display from "../Display";
import LogoutBtn from "./LogoutBtn";
import { User } from "lucide-react";
import { BeatLoader } from "react-spinners";
import { ExitIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { authUserQueryOptions } from "@/lib/api";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const UserBtn = () => {
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
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user?.image || ""} />

          <AvatarFallback className="bg-sky-500">
            <User className="text-white" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-40" align="end">
        <LogoutBtn>
          <DropdownMenuItem>
            <ExitIcon className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </LogoutBtn>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserBtn;
