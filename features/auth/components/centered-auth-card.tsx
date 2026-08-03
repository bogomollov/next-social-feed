import { Badge } from "@/shared/ui/badge";
import { Separator } from "@/shared/ui/separator";

type CenteredAuthCardProps = {
  badge: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

export function CenteredAuthCard({
  badge,
  title,
  description,
  children,
}: CenteredAuthCardProps) {
  return (
    <main className="app-shell flex min-h-[calc(100vh-2rem)] items-center justify-center">
      <div className="w-full max-w-md rounded-[calc(var(--radius)+0.5rem)] border border-border bg-card p-5 shadow-[var(--shadow-sm)] sm:p-6 lg:p-8">
        <div className="mb-6 flex flex-col gap-3">
          <Badge variant="outline" className="w-fit">
            {badge}
          </Badge>
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
        <Separator className="mb-6" />
        {children}
      </div>
    </main>
  );
}
