import { Component, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { MascotError } from "../mascots";
import { reportClientError } from "@/utils/report-client-error";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Error de renderizado no controlado:", error, info);

    reportClientError({
      message: error?.message ?? String(error),
      stack: [error?.stack, "Component stack:", info?.componentStack]
        .filter(Boolean)
        .join("\n"),
      source: "AppErrorBoundary",
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
          <MascotError className="h-40 w-auto" />

          <div>
            <p className="text-lg font-semibold">Algo salió mal</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Ocurrió un error inesperado. Intenta recargar la página.
            </p>
          </div>

          <Button onClick={() => window.location.reload()}>Recargar</Button>
        </div>
      );
    }

    return this.props.children;
  }
}
