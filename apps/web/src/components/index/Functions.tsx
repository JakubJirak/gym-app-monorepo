import FunctionRow from "./FunctionRow";

const Functions = () => (
	<section className="w-full scroll-mt-20 bg-bg px-6 py-16 md:px-20 md:py-32 lg:py-50" id="funkce">
		<div className="mx-auto flex max-w-[950px] flex-col gap-24 md:gap-32 lg:gap-40">
			<FunctionRow
				desc="Jednoduše a rychle si zaznamenávejte své tréninky se všemi cviky a sériemi. Ke každému trénkinku nebo cviku si můžete přidat poznámky."
				heading="Zapište si své tréninky"
				imageAlt="Treninky"
				imageSrc="/treninky.png"
				ticks={[
					"Jednoduché zapisování",
					"Vlastní cviky",
					"Statistiky pro trénink",
					"Poznámky k tréninku",
					"Filtrace tréninků",
				]}
			/>

			<FunctionRow
				desc="V aplikaci si můžete vytvářet vlastní cviky, kategorie, které vám pomohou lépe organizovat vaše tréninky. Pro ulehčení si můžete vytvořet rutiny, které vám podle vašeho plánu vytvoří trénink s předem nastavenými cviky."
				heading="Vytvořte si vlastní cviky, rutiny a kategorie"
				imageAlt="Cviky"
				imageSrc="/cviky.png"
				reverse
				ticks={["Vlastní cviky", "Vlastní kategorie", "Vlastní rutiny"]}
			/>

			<FunctionRow
				desc="Pomocí grafů a statistik můžete sledovat celkové statistiky tréninků, počet cviků na svalovou partii a statistiky pro všechny vaše cviky."
				heading="Sledujte detailní statistiky výkonu i tréninků"
				imageAlt="Historie"
				imageSrc="/historie.png"
				ticks={[
					"Celkové statistiky",
					"Statistiky tréninku",
					"Statistiky svalových partií",
					"Statistiky cviku",
				]}
			/>

			<FunctionRow
				desc="Pomocí kalendáře si můžete zobrazit celou historii tréninků a rychle najít ten, který hledáte."
				heading="Sledujte historii tréninků pomocí kalendáře"
				imageAlt="Kalendář"
				imageSrc="/kalendar.png"
				reverse
				ticks={["Historie všech tréninků", "Zobrazení dne podle tréninku", "Rychlé hledání tréninku"]}
			/>

			<FunctionRow
				desc="Sledujte svůj pokrok v powerliftingu pomocí tabulky vašich výkonů, která se automaticky aktualizuje. Díky nastavené váze můžete sledovat i svůj bodyweight ratio."
				heading="Získávejte přehled o powerlifting statistikách a výkonech"
				imageAlt="Cíle"
				imageSrc="/cile.png"
				ticks={["Automatické zjištění PR", "Výpočet totalu", "Bodyweight ratio"]}
			/>

			<FunctionRow
				desc="V profilu si můžete nastavit svoji váhu, díky které se vám přepočítají powerlifting PR na bodyweight ratio. Pro powerlifting si také můžete nastavit cíle a sledovat, jak se k nim blížíte. Můžete si také nastavit svoje zaměření."
				heading="Nastavte si váhu, cíle a zaměření podle vašich cílů"
				imageAlt="Profil"
				imageSrc="/profil.png"
				reverse
				ticks={["Nastavení váhy", "Nastavení zaměření", "Nastavení cílů pro powerlifting"]}
			/>
		</div>
	</section>
);

export default Functions;
