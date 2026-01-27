import { createFileRoute } from "@tanstack/react-router";
import Contact from "@/components/index/Contact";
import Download from "@/components/index/Download";
import Footer from "@/components/index/Footer";
import Functions from "@/components/index/Functions";
import HeroSection from "@/components/index/HeroSection";
import News from "@/components/index/News";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	return (
		<div className="scroll-smooth">
			<HeroSection />
			<Functions />
			<Download />
			<News />
			<Contact />
			<Footer />
		</div>
	);
}
