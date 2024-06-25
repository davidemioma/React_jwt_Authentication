import CardWrapper from "./CardWrapper";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

const ErrorCard = () => {
  return (
    <CardWrapper
      headerLabel="Oops! Something went wrong!"
      backButtonHref="/auth/sign-in"
      backButtonLabel="Back to login"
    >
      <div className="flex w-full items-center justify-center">
        <ExclamationTriangleIcon className="text-destructive" />
      </div>
    </CardWrapper>
  );
};

export default ErrorCard;
