import { Check } from "lucide-react";

type FunctionRowProps = {
	imageSrc: string;
	imageAlt: string;
	heading: string;
	desc: string;
	ticks: string[];
	reverse?: boolean;
};

const FunctionRow = ({ imageSrc, imageAlt, heading, desc, ticks, reverse = false }: FunctionRowProps) => (
	<div
		className={`flex flex-col items-center gap-8 sm:gap-10 md:items-start md:gap-12 lg:gap-16 xl:gap-24 ${reverse ? "md:flex-row-reverse" : "md:flex-row"}`}
	>
		<div className="w-full max-w-[280px] overflow-hidden rounded-lg shadow-lg md:w-1/2">
			<img
				alt={imageAlt}
				className="h-auto w-full object-cover"
				height="100%"
				src={imageSrc}
				width="100%"
			/>
		</div>
		<div className="flex w-[75%] flex-col md:w-full">
			<h5 className="mb-4 font-semibold text-lg sm:text-xl md:mb-8 md:text-2xl lg:text-3xl xl:text-4xl">
				{heading}
			</h5>
			<p className="mb-6 text-muted-foreground text-sm sm:text-base md:mb-10 md:text-lg">{desc}</p>
			<div className="space-y-4 md:space-y-5">
				{ticks.map((tick) => (
					<div className="flex items-center gap-3 sm:gap-4" key={tick}>
						<div className="rounded-full bg-orange p-1">
							<Check className="size-4 sm:size-5 md:size-6" />
						</div>
						<p className="text-sm sm:text-base md:text-lg lg:text-xl">{tick}</p>
					</div>
				))}
			</div>
		</div>
	</div>
);

export default FunctionRow;
