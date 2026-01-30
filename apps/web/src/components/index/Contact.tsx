import { Button } from "../ui/button";

const Contact = () => (
	<section
		className="w-full scroll-mt-20 bg-background px-6 py-16 md:px-20 md:py-28 lg:px-32 lg:py-40"
		id="kontakt"
	>
		<div className="mx-auto flex max-w-[75%] flex-col xl:max-w-[900px]">
			<h3 className="mb-8 font-bold text-2xl md:mb-12 md:text-4xl lg:text-5xl/14">KONTAKT</h3>
			<p className="w-full font-light text-base leading-relaxed md:text-xl">
				Tato aplikace je open source a její repozitář je dostupný na GitHubu. Pokud najdete v aplikaci
				nějaké chyby, můžete založit issue. Pokud vás napadne způsob, jak aplikaci vylepšit nebo nová
				funkcionalita, kontaktujte mě.
			</p>
			<div className="mt-10 flex flex-col gap-4 md:mt-16 md:flex-row md:gap-6 lg:mt-20">
				<a
					href="https://github.com/JakubJirak/gym-app-monorepo"
					rel="noopener noreferrer"
					target="_blank"
				>
					<Button
						className="w-full bg-orange font-bold text-white hover:bg-orange/80 md:w-auto"
						size="lg"
					>
						Repozitář
					</Button>
				</a>
				<a href="https://github.com/JakubJirak" rel="noopener noreferrer" target="_blank">
					<Button className="w-full md:w-auto" size="lg" variant="outline-accent">
						Github profil
					</Button>
				</a>
			</div>
		</div>
	</section>
);

export default Contact;
