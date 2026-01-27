import { Button } from "../ui/button";

const Contact = () => (
	<section className="w-full bg-background px-64 py-40">
		<p className="w-1/2 font-light text-2xl/9">
			Repozitář této aplikace je dostupný na GitHubu. Pokud najdete v aplikaci nějaké chyby, můžete založit
			issue. Pokud vás napadne způsob, jak aplikaci vylepšit nebo nová funkcionalita, obraťte se na mě.
		</p>
		<div className="mt-20 flex gap-6">
			<a href="https://github.com/JakubJirak/gym-app-monorepo" rel="noopener noreferrer" target="_blank">
				<Button className="bg-orange font-bold text-white hover:bg-orange" size="xl">
					Repozitář
				</Button>
			</a>
			<a href="https://github.com/JakubJirak" rel="noopener noreferrer" target="_blank">
				<Button size="xl" variant="outline">
					Github profil
				</Button>
			</a>
		</div>
	</section>
);

export default Contact;
