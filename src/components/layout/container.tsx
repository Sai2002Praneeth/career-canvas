import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

export function LayoutContainer({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-6 lg:px-8", className)} {...props}>
      {children}
    </div>
  );
}

export function SectionWrapper({
  className,
  children,
  id,
}: {
  className?: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className={cn("py-24 lg:py-32", className)}>
      <LayoutContainer>{children}</LayoutContainer>
    </section>
  );
}
