import { EditFilter } from "./EditFilter";

const Category = ({ name, color, id }: { name: string; color: string; id: string }) => (
	<div className="flex items-center gap-4 rounded-xl bg-secondary px-3 py-2.5">
		<div className={"size-4 rounded-xl"} style={{ backgroundColor: color }} />
		<p className="text-lg">{name}</p>
		<div className="ml-auto">
			<EditFilter defColor={color} defName={name} filterId={id} />
		</div>
	</div>
);

export default Category;
