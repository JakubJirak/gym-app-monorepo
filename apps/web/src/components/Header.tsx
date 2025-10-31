import { Link, useNavigate } from "@tanstack/react-router";
import { GiWeightLiftingUp } from "react-icons/gi";
import { MdLogout } from "react-icons/md";
import { Button } from "@/components/ui/button.tsx";
import { authClient } from "@/lib/auth-client.ts";

interface HeaderProps {
	page: string;
}

const Header = ({ page }: HeaderProps) => {
	const { data: session } = authClient.useSession();
	const navigate = useNavigate();

	if (!session)
		return (
			<p className="mt-10 text-center text-lg">
				Pro přístup se musíš{" "}
				<Link className="ml-2" to={"/login"}>
					<Button>PŘIHLÁSIT</Button>
				</Link>
			</p>
		);

	const handleSignOut = async () => {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					navigate({ to: "/" });
				},
			},
		});
	};

	return (
		<header className="mx-auto mb-6 grid h-16 max-w-[550px] grid-cols-[40px_1fr_40px] items-center justify-center justify-items-center rounded-b-2xl bg-foreground px-3">
			<Link to={"/menu"}>
				<GiWeightLiftingUp className="text-background" size={40} />
			</Link>
			<p className="font-bold text-background text-xl">{page}</p>
			<Link to={"/"}>
				<Button onClick={handleSignOut} size="icon-lg" variant="secondary-icon">
					<MdLogout />
				</Button>
			</Link>
		</header>
	);
};

export default Header;
