const Category = ({ name, color }: { name: string; color: string }) => (
	<div className="flex h-6 items-center gap-4">
		<div className={"h-full w-1 rounded-xl"} style={{ backgroundColor: color }} />
		<p className="text-lg">{name}</p>
	</div>
);

export default Category;
