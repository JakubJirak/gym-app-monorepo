import { Separator } from "@/components/ui/separator.tsx";
import { authClient } from "@/lib/auth-client.ts";

const UserAccInfo = () => {
  const { data: session } = authClient.useSession();


  if (!session) return null;
  const createdDate = new Date(session.user.createdAt).toLocaleDateString();

  return (
    <div className="p-2">
      <div className="space-y-3">
        <div className="space-y-1">
          <p className="text-muted-foreground">Uživatelské jméno</p>
          <p>{session.user.name}</p>
        </div>
        <Separator />
        <div className="space-y-1">
          <p className="text-muted-foreground">Email</p>
          <p>{session.user.email}</p>
        </div>
        <Separator />
        <div className="space-y-1">
          <p className="text-muted-foreground">Založení účtu</p>
          <p>{createdDate}</p>
        </div>
        <p>{session.user.id}</p>
      </div>
    </div>
  );
};

export default UserAccInfo;
