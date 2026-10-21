import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { AppHeader } from "../../../features/me/AppHeader.tsx";
import { BackButton } from "../../../features/me/BackButton.tsx";
import { plainText } from "../../../features/me/plain-text.ts";
import { AccessFilter } from "../../../features/users/AccessFilter.tsx";
import { accessCounts, passesFilter } from "../../../features/users/access-filter.ts";
import type { AccessFilterId } from "../../../features/users/access-filter.ts";
import { AddUserForm } from "../../../features/users/AddUserForm.tsx";
import { EnrollmentQr } from "../../../features/users/EnrollmentQr.tsx";
import { userExamples } from "../../../features/users/user-examples.ts";
import { useUsers } from "../../../features/users/useUsers.ts";
import { UserRow } from "../../../features/users/UserRow.tsx";
import { UserSearch } from "../../../features/users/UserSearch.tsx";
import { UserSearchEmpty } from "../../../features/users/UserSearchEmpty.tsx";
import { Button } from "../../../ui/Button.tsx";
import { Icon } from "../../../ui/Icon.tsx";
import { SkeletonOf } from "../../../ui/SkeletonOf.tsx";

// The course has about thirty people, all of them in one read: searching and
// filtering happen here, without asking the API again.
const UsersRoute = () => {
  const users = useUsers();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<AccessFilterId>("all");
  const [adding, setAdding] = useState(false);
  const [showingQr, setShowingQr] = useState(false);

  const all = users.data ?? [];
  const term = plainText(search.trim());

  const shown = all.filter(
    (user) =>
      passesFilter(user, filter) && plainText(`${user.name ?? ""} ${user.email}`).includes(term),
  );

  return (
    <main className="pb-8">
      <div className="px-8 pt-[26px] pb-1">
        <AppHeader
          leading={<BackButton to="/admin" label="Volver a las sesiones" />}
          title="Usuarios"
        />
      </div>
      <div className="max-w-[900px] pt-[18px] pr-8 pl-[86px]">
        <div className="flex items-center gap-2.5">
          <UserSearch value={search} onChange={setSearch} />
          <Button variant="pill" onClick={() => setShowingQr(true)}>
            <Icon name="scan" size={16} />
            QR de registro
          </Button>
          <Button variant="pill-dark" onClick={() => setAdding(true)}>
            <Icon name="plus" size={16} />
            Agregar por email
          </Button>
        </div>
        <AccessFilter
          counts={users.data == null ? undefined : accessCounts(users.data)}
          value={filter}
          onChange={setFilter}
        />
        {users.data != null && shown.length === 0 ? <UserSearchEmpty /> : null}
        {users.data == null ? (
          <SkeletonOf>
            <ul className="mt-3.5 flex flex-col gap-2">
              {userExamples.map((user) => (
                <UserRow key={user.id} user={user} />
              ))}
            </ul>
          </SkeletonOf>
        ) : (
          <ul aria-label="Usuarios" className="mt-3.5 flex flex-col gap-2">
            {shown.map((user) => (
              <UserRow key={user.id} user={user} />
            ))}
          </ul>
        )}
      </div>
      {adding ? <AddUserForm onClose={() => setAdding(false)} /> : null}
      {showingQr ? <EnrollmentQr onClose={() => setShowingQr(false)} /> : null}
    </main>
  );
};

export const Route = createFileRoute("/_app/admin/usuarios")({ component: UsersRoute });
