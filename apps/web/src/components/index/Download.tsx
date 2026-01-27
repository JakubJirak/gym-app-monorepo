import { Button } from "../ui/button";

const Download = () => (
	<section className="w-full bg-background px-6 pb-20 md:px-20 md:pb-32 lg:pb-42 xl:px-64" id="download">
		<h3 className="mb-6 w-full pt-20 font-bold text-2xl leading-tight md:mb-8 md:w-3/4 md:pt-32 md:text-4xl lg:pt-42 lg:text-5xl/14 xl:w-1/2">
			Stáhněte si ZDARMA mobilní aplikaci GYM TRACKER
		</h3>
		<p className="mb-12 w-full text-left font-light text-base leading-relaxed md:mb-16 md:w-3/4 md:text-xl lg:mb-24 lg:w-[45%] lg:text-2xl/9">
			Aplikace je prozatím dostupná pouze pro Android zařízení, na verzi pro IOS se pracuje. Aplikace
			bohužel není na Google Play.
		</p>
		<Button className="w-full bg-orange font-semibold text-white hover:bg-orange/80 md:w-auto" size="lg">
			Stáhnout aplikaci
		</Button>
	</section>
);

export default Download;
