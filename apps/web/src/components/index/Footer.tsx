const Footer = () => (
	<footer className="flex w-full items-center justify-center gap-2 bg-bg py-6">
		<a
			className="text-lg hover:underline"
			href="https://jakub.jirak.dev/"
			rel="noopener noreferrer"
			target="_blank"
		>
			Jakub Jirák
		</a>
		<p className="text-lg">| {new Date().getFullYear()}</p>
	</footer>
);

export default Footer;
