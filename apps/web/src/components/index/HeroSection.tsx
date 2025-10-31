import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button.tsx";

const HeroSection = () => (
	<section className="flex h-dvh flex-col items-center">
		<h1 className="mx-auto mt-[10dvh] w-[80%] text-left font-bold text-[5.3dvh]/[6.7dvh]">
			Získejte kontrolu nad svým tréninkem
		</h1>
		<p className="mx-auto mt-[4dvh] w-[80%] text-left font-light text-[2.8dvh]/[4.7dvh] tracking-wider">
			Jednoduše si zapisujte tréninky a sledujte svůj progres v přehledných statistikách a souhrnech.
			Profesionální nástroj pro každého, kdo to s pohybem myslí vážně.
		</p>
		<div className="mx-auto mt-[6dvh] flex w-[80%] flex-col justify-between gap-[2dvh]">
			<Link className="inline-flex" to={"/login"}>
				<Button className="cursor-pointer" size="xl">
					Přihlaste se
				</Button>
			</Link>
			<Link className="inline-flex" to={"/register"}>
				<Button className="cursor-pointer" size="xl" variant="outline">
					Vytvořte si účet
				</Button>
			</Link>
		</div>
	</section>
);

export default HeroSection;
