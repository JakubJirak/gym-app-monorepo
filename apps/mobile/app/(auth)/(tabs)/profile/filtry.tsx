import { useQuery } from "convex/react";
import { View } from "react-native";
import ComponentHeader from "@/components/component-header";
import { api } from "../../../../../../packages/convex/convex/_generated/api";

export default function Filtry() {
	const filtry = useQuery(api.filters.getAllFilters);


	if (!filtry || filtry === undefined) {
		return null;
	}

	return (
		<View className="flex-1 bg-primary px-4">
			<ComponentHeader text="Filtry" />
		</View>
	);
}
