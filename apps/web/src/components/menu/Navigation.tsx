import { Link } from "@tanstack/react-router";
import { TableProperties, Trophy } from "lucide-react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { GiWeightLiftingUp } from "react-icons/gi";
import { IoIosStats } from "react-icons/io";
import { LuClipboardList, LuDumbbell } from "react-icons/lu";
import { Card } from "@/components/ui/card.tsx";

const Navigation = () => (
	<div className="mx-auto mt-3 flex w-[90%] max-w-[500px] flex-col gap-3.5 pb-8">
		<Link to={"/treninky"}>
			<Card className="flex flex-row items-center p-3.5">
				<GiWeightLiftingUp size={35} />
				<p className="text-xl">TRÉNINKY</p>
			</Card>
		</Link>
		<Link to={"/statistiky"}>
			<Card className="flex flex-row items-center p-3.5">
				<IoIosStats size={35} />
				<p className="text-xl">STATISTIKY</p>
			</Card>
		</Link>
		<Link to={"/kalendar"}>
			<Card className="flex flex-row items-center p-3.5">
				<FaRegCalendarAlt size={35} />
				<p className="text-xl">KALENDÁŘ</p>
			</Card>
		</Link>
		<Link to={"/rutiny"}>
			<Card className="flex flex-row items-center p-3.5">
				<LuClipboardList size={35} />
				<p className="text-xl">RUTINY</p>
			</Card>
		</Link>
		<Link to={"/powerlifting"}>
			<Card className="flex flex-row items-center p-3.5">
				<Trophy size={35} />
				<p className="text-xl">POWERLIFTING</p>
			</Card>
		</Link>
		<Link to={"/cviky"}>
			<Card className="flex flex-row items-center p-3.5">
				<LuDumbbell size={35} />
				<p className="text-xl">CVIKY</p>
			</Card>
		</Link>
		<Link to={"/kategorie"}>
			<Card className="flex flex-row items-center p-3.5">
				<TableProperties size={35} />
				<p className="text-xl">KATEGORIE</p>
			</Card>
		</Link>
		<Link to={"/profil"}>
			<Card className="flex flex-row items-center p-3.5">
				<FaUser size={35} />
				<p className="text-xl">PROFIL</p>
			</Card>
		</Link>
	</div>
);

export default Navigation;
