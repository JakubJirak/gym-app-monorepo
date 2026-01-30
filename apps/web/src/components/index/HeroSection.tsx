import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button.tsx";

const HeroSection = () => {
	const handleScrollToDownload = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		const downloadSection = document.getElementById("download");
		if (downloadSection) {
			downloadSection.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	};

	return (
		<section className="items-cente my-20 flex flex-col px-6 md:my-50 lg:my-70 lg:px-0 xl:pt-20" id="home">
			<p className="mx-auto mb-2 text-center text-lg md:text-2xl lg:text-3xl">
				Získejte kontrolu nad svým tréninkem pomocí aplikace
			</p>
			<h1 className="mx-auto text-center font-bold text-5xl md:text-7xl lg:text-[100px]">GYM TRACKER</h1>
			<div className="mx-auto mt-10 flex flex-col gap-4 md:mt-16 md:flex-row md:gap-6 lg:mt-20">
				<Link className="inline-flex" to="/login">
					<Button
						className="w-full cursor-pointer bg-orange font-semibold text-white hover:bg-orange/80 md:w-auto"
						size="lg"
					>
						Vytvořte si účet
					</Button>
				</Link>
				<div className="inline-flex">
					<Button
						className="inline-flex w-full cursor-pointer md:w-auto"
						onClick={handleScrollToDownload}
						size="lg"
						variant="outline-accent"
					>
						Stáhnout aplikaci
					</Button>
				</div>
			</div>
			<p className="mx-auto mt-5 text-center text-[#757575] text-sm">
				Celá aplikace je zdarma a kompletně bez reklam.
			</p>
		</section>
	);
};

export default HeroSection;
