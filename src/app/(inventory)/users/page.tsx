import { Heading } from "@/src/components/ui/heading/Heading";
import { UsersPage } from "@/src/components/users/UsersPage";
import { getUsers } from "@/src/services/users/users.service";

export default async function UsersRoute() {
  const response = await getUsers();

  return (
    <div className="content-wrap">
      <Heading
        eyebrow="Administración"
        title="Usuarios"
        description="Gestiona las cuentas que tienen acceso al sistema de inventario."
      />
      <UsersPage users={response.data} />
    </div>

  );
}
