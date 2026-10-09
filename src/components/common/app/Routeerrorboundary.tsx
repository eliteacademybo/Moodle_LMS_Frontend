import {
    useNavigate,
    useRouteError,
    isRouteErrorResponse,
} from "react-router-dom";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { MascotError } from "@/components/common/mascots";
import { reportClientError } from "@/utils/report-client-error";

export function RouteErrorBoundary() {
    const error = useRouteError();
    const navigate = useNavigate();

    useEffect(() => {
        console.error("[RouteErrorBoundary] Error original:", error);

        if (error instanceof Error) {
            console.error("[RouteErrorBoundary] Stack:", error.stack);
        }
        reportClientError({
            message:
                error instanceof Error
                    ? error.message
                    : isRouteErrorResponse(error)
                        ? `Error ${error.status}: ${error.statusText}`
                        : "Error desconocido en React Router",
            stack: error instanceof Error ? error.stack : undefined,
            source: "RouteErrorBoundary",
        });
    }, [error]);

    const mensaje = isRouteErrorResponse(error)
        ? `Error ${error.status}: ${error.statusText}`
        : "Ocurrió un error inesperado al cargar esta página.";

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6 text-center">
            <MascotError className="h-36 w-auto" />

            <div>
                <p className="text-lg font-semibold">Algo salió mal</p>

                <p className="mt-1 text-sm text-muted-foreground">
                    {mensaje}
                </p>
            </div>

            <div className="flex gap-2">
                <Button
                    variant="outline"
                    onClick={() => navigate(-1)}
                >
                    Volver atrás
                </Button>

                <Button
                    onClick={() => navigate("/panel/inicio")}
                >
                    Ir a Inicio
                </Button>
            </div>
        </div>
    );
}