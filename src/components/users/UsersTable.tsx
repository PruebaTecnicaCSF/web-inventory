"use client";

import { Search, ShieldCheck, UserRound } from "lucide-react";
import { useMemo, useState } from "react";

import { EmptyTable } from "@/src/components/ui/emptytable/EmptyTable";

import type { UserDto } from "@/src/types/users/user.dto";

interface UsersTableProps {
  users: UserDto[];
}

export function UsersTable({ users }: UsersTableProps) {
  const [search, setSearch] = useState("");

  const filteredUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return users;
    }

    return users.filter((user) => {
      return (
        user.name.toLowerCase().includes(normalizedSearch) ||
        user.email.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [search, users]);

  const activeUsers = users.filter((user) => user.rowStatus).length;

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat("es-PE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    [],
  );

  return (
    <section className="panel table-panel users-table-panel">
      <div className="table-toolbar users-table-toolbar">
        <div>
          <div className="users-table-title">
            <UserRound />

            <div>
              <strong>Usuarios registrados</strong>
              <span>
                {activeUsers} activos de {users.length} usuarios
              </span>
            </div>
          </div>
        </div>

        <div className="search-box users-search">
          <Search />

          <input
            type="search"
            placeholder="Buscar por nombre o correo..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      <EmptyTable>
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Correo</th>
            <th>Registro</th>
            <th>Estado</th>
            <th>
              <span className="sr-only">Acciones</span>
            </th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.length === 0 ? (
            <tr>
              <td colSpan={5}>
                {search.trim()
                  ? "No se encontraron usuarios con ese criterio."
                  : "No hay usuarios registrados."}
              </td>
            </tr>
          ) : (
            filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="table-product">
                    <div className="users-avatar">
                      <UserRound />
                    </div>

                    <div>
                      <strong>{user.name}</strong>
                      <span>{user.id}</span>
                    </div>
                  </div>
                </td>

                <td>{user.email}</td>

                <td>{dateFormatter.format(new Date(user.createdAt))}</td>

                <td>
                  <span
                    className={`status ${
                      user.rowStatus ? "status-green" : "status-orange"
                    }`}
                  >
                    <i />

                    {user.rowStatus ? "Activo" : "Inactivo"}
                  </span>
                </td>

                <td>
                  <span className="users-pending-action">
                    <ShieldCheck />
                    Próximamente
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </EmptyTable>

      <div className="table-footer">
        <span>
          Mostrando {filteredUsers.length} de {users.length} usuarios
        </span>
      </div>
    </section>
  );
}
