type NewsContent = {
	title: string;
	releases: (
		| {
				title: string;
				sections: {
					title: string;
					items: string[];
				}[];
		  }
		| {
				title: string;
				description: string;
		  }
	)[];
};

const newsContent: NewsContent = {
	title: "NOVINKY",
	releases: [
		{
			title: "VERZE 1.3 - 23.7.2026",
			sections: [
				{
					title: "Hlavní novinky",
					items: ["Zlepšení designu, rychlosti a user experience webové aplikace"],
				},
			],
		},
		{
			title: "VERZE 1.2 - 22.5.2026",
			sections: [
				{
					title: "Hlavní novinky",
					items: [
						"Sdílení tréninků - Přidání možnosti sdílet trénink s ostatními lidmi bez nutnosti mít účet",
					],
				},
				{
					title: "Mobilní aplikace",
					items: ["Nová verze mobilní aplikace s vylepšenými barvami, animacemi a stabilitou."],
				},
				{
					title: "Ostatí",
					items: ["Oprava stability a funkčnosti webové apklikace."],
				},
			],
		},
		{
			title: "VERZE 1.1 - 20.12.2025",
			sections: [
				{
					title: "Hlavní novinky",
					items: [
						"Rutiny - uživatel si vytvoří rutinu, podle které se dá vytvořit trénink už s předem přidanými cviky",
						"Kategorie - každý trénink a rutina má nyní svoji kategorii, podle které je můžete filtrovat",
						"Editace tréninku - uživatel má pokročilejší možnosti editace tréninku a jeho cviků",
						"Statistiky - v mobilní aplikaci se nachází nový radio graf pro zobrazení četnosti tréninku svalových skupin",
					],
				},

				{
					title: "Mobilní aplikace",
					items: ["Gym tracker je nyní dostupný i jako mobilní aplikace pro Android"],
				},
				{
					title: "Ostatí",
					items: [
						"Názvy tréninků - tréninky nemají nyní názvy, ten vyměnil jeho datum. Můžete si ale přidat ke každému tréninku poznámku",
						"Synchronizace - zlepšena stabilita synchronizace mezi webovou a mobilní aplikací",
					],
				},
			],
		},
		{
			title: "VERZE 1.0 - srpen 2025",
			description: "První oficiální verze GYM TRACKERU",
		},
	],
};

const News = () => (
	<section
		className="w-full scroll-mt-20 space-y-12 bg-bg px-6 py-16 md:space-y-20 md:px-20 md:py-28 lg:space-y-26 lg:px-32 lg:py-40"
		id="novinky"
	>
		<div className="mx-auto flex max-w-[75%] flex-col gap-16 xl:max-w-225">
			<h3 className="font-bold text-2xl md:text-4xl lg:text-5xl/14">{newsContent.title}</h3>

			{newsContent.releases.map((release) => (
				<div key={release.title}>
					<div className="mb-3 flex items-center gap-3 md:mb-4">
						<div className="size-4 rounded-full bg-orange" />
						<p className="font-medium text-lg uppercase md:text-xl lg:text-2xl">
							{release.title}
						</p>
					</div>

					{"sections" in release && (
						<div className="ml-8">
							{release.sections.map((section, sectionIndex) => (
								<div
									className={
										sectionIndex < release.sections.length - 1
											? "my-4 md:my-5"
											: undefined
									}
									key={section.title}
								>
									<p className="mb-2 text-base uppercase md:mb-3 md:text-lg">
										{section.title}
									</p>
									<ul className="space-y-2 pl-1 md:space-y-2.5">
										{section.items.map((item) => (
											<li
												className="relative pl-6 text-foreground/90 text-sm leading-relaxed before:absolute before:top-[0.6em] before:left-0 before:size-1.5 before:rounded-full before:bg-primary md:text-base"
												key={item}
											>
												{item}
											</li>
										))}
									</ul>
								</div>
							))}
						</div>
					)}

					{"description" in release && (
						<p className="ml-8 text-sm md:text-base">{release.description}</p>
					)}
				</div>
			))}
		</div>
	</section>
);

export default News;
