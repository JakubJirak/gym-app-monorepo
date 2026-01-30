const News = () => (
	<section
		className="w-full scroll-mt-20 space-y-12 bg-bg px-6 py-16 md:space-y-20 md:px-20 md:py-28 lg:space-y-26 lg:px-32 lg:py-40"
		id="novinky"
	>
		<div className="mx-auto flex max-w-[75%] flex-col gap-16 xl:max-w-[900px]">
			<h3 className="font-bold text-2xl md:text-4xl lg:text-5xl/14">NOVINKY</h3>

			<div className="">
				<div className="mb-3 flex items-center gap-3 md:mb-4">
					<div className="size-4 rounded-full bg-orange" />
					<p className="font-medium text-lg uppercase md:text-xl lg:text-2xl">
						VERZE 1.1 - 20.12.2025
					</p>
				</div>

				<div className="ml-8">
					<div className="my-4 md:my-5">
						<p className="mb-2 text-base uppercase md:mb-3 md:text-lg">Mobilní aplikace</p>
						<ul className="space-y-2 pl-1 md:space-y-2.5">
							<li className="relative pl-6 text-foreground/90 text-sm leading-relaxed before:absolute before:top-[0.6em] before:left-0 before:size-1.5 before:rounded-full before:bg-primary md:text-base">
								Gym tracker je nyní dostupný i jako mobilní aplikace pro Android
							</li>
						</ul>
					</div>

					<div className="my-4 md:my-5">
						<p className="mb-2 text-base uppercase md:mb-3 md:text-lg">Hlavní novinky</p>
						<ul className="space-y-2 pl-1 md:space-y-2.5">
							<li className="relative pl-6 text-foreground/90 text-sm leading-relaxed before:absolute before:top-[0.6em] before:left-0 before:size-1.5 before:rounded-full before:bg-primary md:text-base">
								Rutiny - uživatel si vytvoří rutinu, podle které se dá vytvořit trénink
								už s předem přidanými cviky
							</li>
							<li className="relative pl-6 text-foreground/90 text-sm leading-relaxed before:absolute before:top-[0.6em] before:left-0 before:size-1.5 before:rounded-full before:bg-primary md:text-base">
								Kategorie - každý trénink a rutina má nyní svoji kategorii, podle které
								je můžete filtrovat
							</li>
							<li className="relative pl-6 text-foreground/90 text-sm leading-relaxed before:absolute before:top-[0.6em] before:left-0 before:size-1.5 before:rounded-full before:bg-primary md:text-base">
								Editace tréninku - uživatel má pokročilejší možnosti editace tréninku a
								jeho cviků
							</li>
							<li className="relative pl-6 text-foreground/90 text-sm leading-relaxed before:absolute before:top-[0.6em] before:left-0 before:size-1.5 before:rounded-full before:bg-primary md:text-base">
								Statistiky - v mobilní aplikaci se nachází nový radio graf pro zobrazení
								četnosti tréninku svalových skupin
							</li>
						</ul>
					</div>

					<div>
						<p className="mb-2 text-base uppercase md:mb-3 md:text-lg">Ostatí</p>
						<ul className="space-y-2 pl-1 md:space-y-2.5">
							<li className="relative pl-6 text-foreground/90 text-sm leading-relaxed before:absolute before:top-[0.6em] before:left-0 before:size-1.5 before:rounded-full before:bg-primary md:text-base">
								Názvy tréninků - tréninky nemají nyní názvy, ten vyměnil jeho datum.
								Můžete si ale přidat ke každému tréninku poznámku
							</li>
							<li className="relative pl-6 text-foreground/90 text-sm leading-relaxed before:absolute before:top-[0.6em] before:left-0 before:size-1.5 before:rounded-full before:bg-primary md:text-base">
								Synchronizace - zlepšena stabilita synchronizace mezi webovou a mobilní
								aplikací
							</li>
						</ul>
					</div>
				</div>
			</div>
			<div className="">
				<div className="mb-3 flex items-center gap-3 md:mb-4">
					<div className="size-4 rounded-full bg-orange" />
					<p className="font-medium text-lg uppercase md:text-xl lg:text-2xl">
						VERZE 1.0 - srpen 2025
					</p>
				</div>
				<p className="ml-8 text-sm md:text-base">První oficiální verze GYM TRACKERU</p>
			</div>
		</div>
	</section>
);

export default News;
