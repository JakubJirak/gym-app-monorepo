import { Button } from "../ui/button";

const Contact = () => (
	<section className="w-full bg-background px-6 py-16 md:px-20 md:py-28 lg:px-64 lg:py-40">
		<p className="w-full font-light text-base leading-relaxed md:w-3/4 md:text-xl lg:w-1/2 lg:text-2xl/9">
			Repozitář této aplikace je dostupný na GitHubu. Pokud najdete v aplikaci nějaké chyby, můžete založit
			issue. Pokud vás napadne způsob, jak aplikaci vylepšit nebo nová funkcionalita, obraťte se na mě.
		</p>
		<div className="mt-10 flex flex-col gap-4 md:mt-16 md:flex-row md:gap-6 lg:mt-20">
			<a href="https://github.com/JakubJirak/gym-app-monorepo" rel="noopener noreferrer" target="_blank">
				<Button
					className="w-full bg-orange font-bold text-white hover:bg-orange/80 md:w-auto"
					size="lg"
				>
					Repozitář
				</Button>
			</a>
			<a href="https://github.com/JakubJirak" rel="noopener noreferrer" target="_blank">
				<Button className="w-full md:w-auto" size="lg" variant="outline">
					Github profil
				</Button>
			</a>
		</div>
	</section>
);

export default Contact;
