import FunctionsCard from "@/components/index/FunctionsCard.tsx";

const Functions = () => (
	<section className="w-full bg-secondary py-12">
		<h3 className="font-bold text-3xl">FUNKCE</h3>
		<div className="mx-auto mt-12 w-[90%] space-y-4">
			<FunctionsCard
				text="Sestav si vlastní tréninky přesně podle svých potřeb – vyber cviky z databáze nebo si přidej vlastní. Každý cvik můžeš kdykoliv upravit, mazat či přidávat nové série i opakování."
				title="Tvorba a správa tréninků"
			/>
			<FunctionsCard
				text="Přidej si vlastní cviky a ulož si je. Ke každému cviku si vybereš jakou svalovou partii cvičí. Poté u každého tréninku uvidíš statistiky s grafem pro jednotlivé svalové partie."
				title="Vlastní cviky vždy po ruce"
			/>
			<FunctionsCard
				text="Sleduj detailní statistiky pro všechny cviky i celé tréninky – grafy a přehledy tvého posunu. U trojbojových cviků navíc uvidíš výpočet poměru síly k tělesné váze (BW ratio)."
				title="Statistiky a progres"
			/>
			<FunctionsCard
				text="Získej detailní přehled všech svých tréninků v kalendáři a nastav si cíle pro své Powerlifting PR."
				title="Kalendář a cíle"
			/>
		</div>
	</section>
);

export default Functions;
