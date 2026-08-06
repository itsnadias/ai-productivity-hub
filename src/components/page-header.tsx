import type { LucideIcon } from "lucide-react";

export function PageHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <header className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-4">
      <div className="bg-brand-gradient grid size-11 shrink-0 place-items-center rounded-2xl text-primary-foreground shadow-soft">
        <Icon className="size-5" />
      </div>
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </header>
  );
}
