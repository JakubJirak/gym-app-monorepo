import { EditExercise } from "./EditExercise";

export default function Exercise({ name, id, editable }: { name: string; id: string; editable: boolean }) {
	return (
		<div className="my-2 flex items-center justify-between rounded-xl bg-secondary px-3 py-2 text-base">
			<p>{name}</p>
			{editable && <EditExercise defaultName={name} id={id} />}
		</div>
	);
}
