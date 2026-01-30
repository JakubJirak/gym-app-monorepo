import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

const Navbar = () => {
	const scrollToSection = (sectionId: string) => {
		if (sectionId === "home") {
			window.scrollTo({ top: 0, behavior: "smooth" });
		} else {
			const section = document.getElementById(sectionId);
			if (section) {
				section.scrollIntoView({ behavior: "smooth", block: "start" });
			}
		}
	};

	return (
		<nav className="fixed top-0 z-50 hidden w-full bg-secondary px-6 py-3 shadow-md lg:block">
			<div className="relative flex items-center">
				<div className="flex items-center gap-2">
					<span className="font-semibold text-lg">GYM TRACKER</span>
					<span className="text-muted-foreground text-sm">v1.1</span>
				</div>

				<ul className="-translate-x-1/2 absolute left-1/2 flex items-center gap-6">
					<li>
						<button
							className="cursor-pointer text-primary/90 transition-colors hover:text-primary"
							onClick={() => scrollToSection("home")}
							type="button"
						>
							Domů
						</button>
					</li>
					<li className="h-4 w-px bg-muted-foreground/30" />
					<li>
						<button
							className="cursor-pointer text-primary/90 transition-colors hover:text-primary"
							onClick={() => scrollToSection("funkce")}
							type="button"
						>
							Funkce
						</button>
					</li>
					<li className="h-4 w-px bg-muted-foreground/30" />
					<li>
						<button
							className="cursor-pointer text-primary/90 transition-colors hover:text-primary"
							onClick={() => scrollToSection("download")}
							type="button"
						>
							Stáhnout
						</button>
					</li>
					<li className="h-4 w-px bg-muted-foreground/30" />
					<li>
						<button
							className="cursor-pointer text-primary/90 transition-colors hover:text-primary"
							onClick={() => scrollToSection("novinky")}
							type="button"
						>
							Novinky
						</button>
					</li>
					<li className="h-4 w-px bg-muted-foreground/30" />
					<li>
						<button
							className="cursor-pointer text-primary/90 transition-colors hover:text-primary"
							onClick={() => scrollToSection("kontakt")}
							type="button"
						>
							Kontakt
						</button>
					</li>
				</ul>

				<Link className="ml-auto" to="/login">
					<Button className="bg-orange font-semibold text-white hover:bg-orange/80" size="sm">
						Přihlásit se
					</Button>
				</Link>
			</div>
		</nav>
	);
};

export default Navbar;
