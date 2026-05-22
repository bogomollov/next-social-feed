import { cn } from "@/shared/lib/utils";

type PageShellProps = {
  children: React.ReactNode;
  className?: string;
};

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
};

type SectionHeaderProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
};

export function PageShell({ children, className }: PageShellProps) {
  return <div className={cn("app-shell", className)}>{children}</div>;
}

export function PageBody({ children, className }: PageShellProps) {
  return <div className={cn("page-shell", className)}>{children}</div>;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  children,
  className,
}: PageHeaderProps) {
  return (
    <header className={cn("page-header", className)}>
      <div className="page-header-row">
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          {eyebrow ? <p className="page-eyebrow">{eyebrow}</p> : null}
          <div className="flex flex-col gap-2">
            <h1 className="page-title">{title}</h1>
            {description ? <p className="page-description">{description}</p> : null}
          </div>
        </div>
        {actions ? <div className="page-actions">{actions}</div> : null}
      </div>
      {children}
    </header>
  );
}

export function SectionHeader({
  title,
  description,
  actions,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("section-header", className)}>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h2 className="section-title">{title}</h2>
        {description ? <p className="section-description">{description}</p> : null}
      </div>
      {actions ? <div className="page-actions">{actions}</div> : null}
    </div>
  );
}
