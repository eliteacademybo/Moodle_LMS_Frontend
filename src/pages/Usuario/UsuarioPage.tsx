"use client";

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { PageHeader } from "@/components/common/PageHeader";
import { QueryState } from "@/components/common/QueryState";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";

import { UsuarioColumns } from "@/features/Usuario/Components/usuario-columns";
import { DialogUsuario } from "@/features/Usuario/Components/DialogUsuario";
import {
    useGetUsers,
    useDeleteUser,
} from "@/features/Usuario/Hook/UsuarioHook";
import type { UsuarioIndexType } from "@/features/Usuario/Schema/UsuarioSchema";

import { useCrudDialog } from "@/hooks/useCrudDialog";
import { useModulePermissions } from "@/hooks/useModulePermissions";
import { PERMISSIONS } from "@/utils/constants";

export default function UsuarioPage() {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);

    const perPage = 10;
    const dialog = useCrudDialog<UsuarioIndexType>();

    const { puedeCrear, puedeEliminar } = useModulePermissions(
        PERMISSIONS.USUARIOS,
    );

    const { data, isLoading, isError, error } = useGetUsers(page, perPage);
    const deleteUser = useDeleteUser();

    const columns = useMemo(
        () =>
            UsuarioColumns({
                onView: (id: string) => navigate(`/panel/usuario/${id}`),
                onDelete: (id: string) => deleteUser.mutate(id),
                canDelete: puedeEliminar,
            }),
        [navigate, puedeEliminar, deleteUser],
    );

    const usuarios = data?.data ?? [];
    const totalPages = data?.meta.totalPages ?? 1;
    const currentPage = data?.meta.page ?? page;
    const totalUsers = data?.meta.total ?? 0;

    return (
        <div className="w-full min-w-0 space-y-4 p-4 sm:space-y-6 sm:p-6">
            <PageHeader
                title="Usuarios"
                subtitle="Administra y gestiona a los usuarios"
                action={
                    puedeCrear ? (
                        <Button
                            onClick={dialog.openCreate}
                            className="w-full sm:w-auto"
                        >
                            Nuevo Usuario
                        </Button>
                    ) : undefined
                }
            />

            <QueryState
                isLoading={isLoading}
                isError={isError}
                error={error}
            >
                <div className="w-full min-w-0 overflow-x-auto rounded-md border">
                    <div className="min-w-[700px]">
                        <DataTable
                            columns={columns}
                            data={usuarios}
                            filterColumn="username"
                            filterPlaceholder="Buscar usuario..."
                            pageCount={totalPages}
                            pageIndex={currentPage - 1}
                            totalRows={totalUsers}
                            onPaginationChange={(newPage) =>
                                setPage(newPage + 1)
                            }
                        />
                    </div>
                </div>
            </QueryState>

            <DialogUsuario
                open={dialog.open}
                onOpenChange={dialog.setOpen}
                mode={dialog.mode}
                userId={dialog.selected?.id}
            />
        </div>
    );
}
