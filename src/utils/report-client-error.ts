import { apiService } from '@/api/api';

type ClientError = {
    message: string;
    stack?: string;
    source?: string;
};

export function reportClientError(error: ClientError) {
    const payload = {
        ...error,
        url: window.location.href,
        userAgent: navigator.userAgent,
    };

    void apiService
        .post('/client-errors', payload)
        .catch((reportError) => {
            // No generar otro reporte si falla el propio reporte.
            console.warn(
                'No se pudo enviar el error al backend',
                reportError,
            );
        });
}