import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button.tsx";

const HeroSection = () => (
	<section className="items-cente my-60 flex flex-col">
		<p className="-mb-2 mx-auto text-3xl">Získejte kontrolu nad svým tréninkem pomocí aplikace</p>
		<h1 className="mx-auto font-bold text-[100px]">GYM TRACKER</h1>
		<div className="mx-auto mt-20 flex gap-6">
			<Link className="inline-flex" to={"/login"}>
				<Button className="cursor-pointer bg-orange font-semibold text-white" size="xl">
					Vytvořte si účet
				</Button>
			</Link>
			<div className="inline-flex">
				<Button className="inline-flex cursor-pointer" size="xl" variant="outline">
					Stáhnout aplikaci
				</Button>
			</div>
		</div>
	</section>
);

export default HeroSection;
