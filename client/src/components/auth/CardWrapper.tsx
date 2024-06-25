import React from "react";
import { Header } from "./Header";
import { BackBtn } from "./BackBtn";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

type Props = {
  children: React.ReactNode;
  showSocial?: boolean;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
};

const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
}: Props) => {
  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader>
        <Header label={headerLabel} />
      </CardHeader>

      <CardContent>{children}</CardContent>

      <CardFooter>
        <BackBtn label={backButtonLabel} href={backButtonHref} />
      </CardFooter>
    </Card>
  );
};

export default CardWrapper;
