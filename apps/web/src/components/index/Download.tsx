import { Button } from "../ui/button";

const Download = () => (
	<section className="w-full bg-background px-6 pb-20 md:px-20 md:pb-32 lg:px-32 lg:pb-42" id="download">
		<div className="mx-auto flex max-w-[75%] flex-col xl:max-w-[900px]">
			<h3 className="mb-6 w-full pt-20 font-bold text-2xl md:mb-8 md:pt-32 md:text-4xl lg:pt-42 lg:text-5xl/14">
				Stáhněte si ZDARMA mobilní aplikaci GYM TRACKER
			</h3>
			<p className="font mb-8 w-full font-light text-base text-muted-foreground leading-relaxed md:mb-16 md:text-xl lg:mb-20">
				Aplikace je prozatím dostupná pouze pro Android zařízení, na verzi pro IOS se pracuje. Aplikace
				bohužel není na Google Play.
			</p>
			<a href="https://install.gym.jirak.dev/">
				<Button
					className="w-full self-start bg-orange font-semibold text-white hover:bg-orange/80 md:w-auto"
					size="lg"
				>
					Stáhnout aplikaci
				</Button>
			</a>
		</div>
	</section>
);

export default Download;
