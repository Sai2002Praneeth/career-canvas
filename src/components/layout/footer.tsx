import { Sparkles } from "lucide-react";
import { LayoutContainer } from "@/components/layout/container";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <LayoutContainer className="flex flex-col items-start justify-between gap-6 py-12 md:flex-row md:items-center">
        <div className="flex items-center gap-2 text-foreground">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground text-background">
            <Sparkles className="size-3.5" />
          </span>
          <span className="text-sm font-semibold tracking-tight">InterviewFlow</span>
        </div>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} InterviewFlow. Built for modern hiring.
        </p>
      </LayoutContainer>
    </footer>
  );
}
