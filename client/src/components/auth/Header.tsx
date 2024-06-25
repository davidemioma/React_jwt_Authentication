type Props = {
  label: string;
};

export const Header = ({ label }: Props) => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-semibold">🔐 Auth</h1>

      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
};
