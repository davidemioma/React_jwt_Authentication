import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

type Props = {
  label: string;
  href: string;
};

export const BackBtn = ({ label, href }: Props) => {
  return (
    <Button className="w-full" variant="link" size="sm" asChild>
      <Link to={href}>{label}</Link>
    </Button>
  );
};
