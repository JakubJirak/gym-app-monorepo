import { Separator } from "@/components/ui/separator.tsx";

type UserAccInfoProps = {
	account: {
		name: string;
		email: string;
		createdAt: number;
	};
};

const UserAccInfo = ({ account }: UserAccInfoProps) => {
	const createdDate = new Intl.DateTimeFormat("cs-CZ", {
		dateStyle: "medium",
		timeZone: "Europe/Prague",
	}).format(new Date(account.createdAt));

	return (
		<div className="p-2">
			<div className="space-y-3">
				<div className="space-y-1">
					<p className="text-muted-foreground">Uživatelské jméno</p>
					<p>{account.name}</p>
				</div>
				<Separator />
				<div className="space-y-1">
					<p className="text-muted-foreground">Email</p>
					<p>{account.email}</p>
				</div>
				<Separator />
				<div className="space-y-1">
					<p className="text-muted-foreground">Založení účtu</p>
					<p>{createdDate}</p>
				</div>
			</div>
		</div>
	);
};

export default UserAccInfo;
