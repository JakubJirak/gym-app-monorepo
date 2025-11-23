import { createFileRoute } from "@tanstack/react-router";
import About from "@/components/index/About";
import Contact from "@/components/index/Contact";
import Footer from "@/components/index/Footer";
import Functions from "@/components/index/Functions";
import HeroSection from "@/components/index/HeroSection";
import News from "@/components/index/News";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	return (
		<div className="relative mx-auto flex max-w-[500px] flex-col items-center text-center">
			<HeroSection />
			<Functions />
			<About />
			<News />
			<Contact />
			<Footer />
		</div>
	);
}
