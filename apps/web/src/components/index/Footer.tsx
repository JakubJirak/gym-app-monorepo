const Footer = () => (
	<footer className="flex w-full items-center justify-center gap-2 bg-secondary py-6">
		<a className="text-lg tracking-wider hover:underline" href="https://jakub.jirak.dev/">
			Jakub Jirák
		</a>
		<p className="text-lg tracking-wider">| {new Date().getFullYear()}</p>
	</footer>
);

export default Footer;
