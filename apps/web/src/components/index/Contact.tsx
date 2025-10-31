import { Card } from "../ui/card";

const Contact = () => (
	<section className="w-full bg-background py-12">
		<h3 className="font-bold text-3xl">KONTAKT</h3>
		<div className="mx-auto mt-12 w-[90%] space-y-4">
			<a href="https://github.com/JakubJirak" rel="noreferrer" target="_blank">
				<Card>
					<p className="text-center font-bold text-xl tracking-wide">github.com/JakubJirak</p>
				</Card>
			</a>
		</div>
	</section>
);

export default Contact;
