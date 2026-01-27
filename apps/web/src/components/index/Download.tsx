import { Button } from "../ui/button";

const Download = () => (
	<section className="w-full bg-background px-64 pb-42">
		<h3 className="mb-8 w-1/2 pt-42 font-bold text-5xl/14" id="download">
			Stáhněte si ZDARMA mobilní aplikaci GYM TRACKER
		</h3>
		<p className="mb-24 w-[45%] text-left font-light text-2xl/9">
			Aplikace je prozatím dostupná pouze pro Android zařízení, na verzi pro IOS se pracuje. Aplikace
			bohužel není na Google Play.
		</p>
		<Button className="bg-orange font-semibold text-white" size="xl">
			Stáhnout aplikaci
		</Button>
	</section>
);

export default Download;
