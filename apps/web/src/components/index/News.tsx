const News = () => (
	<section
		className="w-full scroll-mt-20 space-y-12 bg-bg px-6 py-16 md:space-y-20 md:px-20 md:py-28 lg:space-y-26 lg:px-32 lg:py-40"
		id="novinky"
	>
		<div className="mx-auto flex max-w-[75%] flex-col gap-16 xl:max-w-1/2">
			<div className="">
				<p className="mb-3 font-bold text-xl uppercase md:mb-4 md:text-2xl lg:text-3xl">
					mobilní aplikace - 20.12.2025
				</p>
				<p className="text-sm md:text-base">
					Společně s webovou verzí 1.1 byla vydána i nová mobilní aplikace!
				</p>
			</div>
			<div className="">
				<p className="mb-3 font-bold text-xl md:mb-4 md:text-2xl lg:text-3xl">VERZE 1.1 - 20.12.2025</p>
				<div className="my-4 md:my-5">
					<p className="mb-2 font-semibold text-base uppercase md:mb-3 md:text-lg">
						Hlavní novinky
					</p>
					<ul className="space-y-2 pl-1 md:space-y-2.5">
						<li className="relative pl-6 text-foreground/90 text-sm leading-relaxed before:absolute before:top-[0.6em] before:left-0 before:size-1.5 before:rounded-full before:bg-primary md:text-base">
							Rutiny - uživatel si vytvoří rutinu, podle které se dá vytvořit trénink už s
							předem přidanými cviky
						</li>
						<li className="relative pl-6 text-foreground/90 text-sm leading-relaxed before:absolute before:top-[0.6em] before:left-0 before:size-1.5 before:rounded-full before:bg-primary md:text-base">
							Kategorie - každý trénink a rutina má nyní svoji kategorii, podle které je
							můžete filtrovat
						</li>
						<li className="relative pl-6 text-foreground/90 text-sm leading-relaxed before:absolute before:top-[0.6em] before:left-0 before:size-1.5 before:rounded-full before:bg-primary md:text-base">
							Editace tréninku - uživatel má pokročilejší možnosti editace tréninku a jeho
							cviků
						</li>
						<li className="relative pl-6 text-foreground/90 text-sm leading-relaxed before:absolute before:top-[0.6em] before:left-0 before:size-1.5 before:rounded-full before:bg-primary md:text-base">
							Statistiky - v mobilní aplikaci se nachází nový radio graf pro zobrazení
							četnosti tréninku svalových skupin
						</li>
					</ul>
				</div>
				<div>
					<p className="mb-2 font-semibold text-base uppercase md:mb-3 md:text-lg">Ostatí</p>
					<ul className="space-y-2 pl-1 md:space-y-2.5">
						<li className="relative pl-6 text-foreground/90 text-sm leading-relaxed before:absolute before:top-[0.6em] before:left-0 before:size-1.5 before:rounded-full before:bg-primary md:text-base">
							Názvy tréninků - tréninky nemají nyní názvy, ten vyměnil jeho datum. Můžete si
							ale přidat ke každému tréninku poznámku
						</li>
						<li className="relative pl-6 text-foreground/90 text-sm leading-relaxed before:absolute before:top-[0.6em] before:left-0 before:size-1.5 before:rounded-full before:bg-primary md:text-base">
							Synchronizace - zlepšena stabilita synchronizace mezi webovou a mobilní
							aplikací
						</li>
					</ul>
				</div>
			</div>
			<div className="">
				<p className="mb-3 font-bold text-xl md:mb-4 md:text-2xl lg:text-3xl">VERZE 1.0 - srpen 2025</p>
				<p className="text-sm md:text-base">První oficiální verze GYM TRACKERU</p>
			</div>
		</div>
	</section>
);

export default News;
