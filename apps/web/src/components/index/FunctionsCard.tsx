import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";

interface Props {
	title: string;
	text: string;
}

const FunctionsCard = ({ title, text }: Props) => (
	<Card>
		<CardHeader>
			<CardTitle>{title}</CardTitle>
		</CardHeader>
		<CardContent>
			<p className="-mt-3 font-light text-base/7 tracking-wider">{text}</p>
		</CardContent>
	</Card>
);

export default FunctionsCard;
