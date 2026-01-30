const Functions = () => (
	<section className="w-full scroll-mt-20 bg-bg px-6 py-16 md:px-20 md:py-32 lg:py-50" id="funkce">
		<div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-10 md:grid-cols-3 md:gap-12 md:px-0 lg:gap-40 lg:gap-y-24">
			{/* Treninky */}
			<div className="flex flex-col items-center gap-12 text-center">
				<div className="w-full max-w-[180px] overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105 sm:max-w-[200px] md:max-w-[140px] lg:max-w-[180px] xl:max-w-[250px]">
					<img
						alt="Treninky"
						className="h-auto w-full object-cover"
						height="100%"
						src="/treninky.png"
						width="100%"
					/>
				</div>
				<p className="font-medium text-base md:text-xl lg:text-2xl">
					Sestavuj vlastní tréninky a upravuj v nich cviky i série
				</p>
			</div>

			{/* Cviky */}
			<div className="flex flex-col items-center gap-12 text-center">
				<div className="w-full max-w-[180px] overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105 sm:max-w-[200px] md:max-w-[140px] lg:max-w-[180px] xl:max-w-[250px]">
					<img
						alt="Cviky"
						className="h-auto w-full object-cover"
						height="100%"
						src="/cviky.png"
						width="100%"
					/>
				</div>
				<p className="font-medium text-base md:text-xl lg:text-2xl">
					Vytvářej si vlastní cviky a přehledné kategorie
				</p>
			</div>

			{/* Historie */}
			<div className="flex flex-col items-center gap-12 text-center">
				<div className="w-full max-w-[180px] overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105 sm:max-w-[200px] md:max-w-[140px] lg:max-w-[180px] xl:max-w-[250px]">
					<img
						alt="Historie"
						className="h-auto w-full object-cover"
						height="100%"
						src="/historie.png"
						width="100%"
					/>
				</div>
				<p className="font-medium text-base md:text-xl lg:text-2xl">
					Sleduj detailní statistiky výkonu i tréninků
				</p>
			</div>

			{/* Kalendar */}
			<div className="flex flex-col items-center gap-12 text-center">
				<div className="w-full max-w-[180px] overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105 sm:max-w-[200px] md:max-w-[140px] lg:max-w-[180px] xl:max-w-[250px]">
					<img
						alt="Kalendář"
						className="h-auto w-full object-cover"
						height="100%"
						src="/kalendar.png"
						width="100%"
					/>
				</div>
				<p className="font-medium text-base md:text-xl lg:text-2xl">
					Plánuj své tréninky v zabudovaném kalendáři
				</p>
			</div>

			{/* Cile */}
			<div className="flex flex-col items-center gap-12 text-center">
				<div className="w-full max-w-[180px] rounded-lg shadow-lg transition-transform hover:scale-105 sm:max-w-[200px] md:max-w-[140px] lg:max-w-[180px] xl:max-w-[250px]">
					<img alt="Cíle" className="h-auto w-full" height="100%" src="/cile.png" width="100%" />
				</div>
				<p className="font-medium text-base md:text-xl lg:text-2xl">
					Získávej přehled o powerlifting statistikách a výkonech
				</p>
			</div>

			{/* Profil */}
			<div className="flex flex-col items-center gap-12 text-center">
				<div className="w-full max-w-[180px] overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105 sm:max-w-[200px] md:max-w-[140px] lg:max-w-[180px] xl:max-w-[250px]">
					<img
						alt="Profil"
						className="h-auto w-full object-cover"
						height="100%"
						src="/profil.png"
						width="100%"
					/>
				</div>
				<p className="font-medium text-base md:text-xl lg:text-2xl">
					Nastav si váhu, cíle a zaměření podle své aktuální formy
				</p>
			</div>
		</div>
	</section>
);

export default Functions;
