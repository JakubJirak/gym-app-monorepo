import FunctionsCard from "@/components/index/FunctionsCard.tsx";

const News = () => (
	<section className="w-full bg-secondary py-12">
		<h3 className="font-bold text-3xl">NOVNIKY</h3>
		<div className="mx-auto mt-12 w-[90%] space-y-4">
			<FunctionsCard
				text="Nově se po kliknutí na libovolný trénink zobrazí nejen všechny cviky,ale také statistiky a grafy pro daný trénink."
				title="Přidání statistik pro každý trénink"
			/>
			<FunctionsCard
				text="Nově si můžete v profilu nastavit cíle pro svoje PR na squat, bench a deadlift. V Powerlifting statistikách poté uvidíte progress bar jak moc blízko jste k dosažení cíle."
				title="Přidání Powerlifting cílů"
			/>
			<FunctionsCard
				text="Pokud máte zaznamenanou v tréninku alespoň jednu sérii dřepu, benche nebo deadliftu, tak nově najdede tabulku s vašimi PR pro daný cvik. Pokud si v profilu nastavíte svoji váhu, přidá se vám přepočet na BW ratio."
				title="Přidání Powerlifting statistik"
			/>
		</div>
	</section>
);

export default News;
