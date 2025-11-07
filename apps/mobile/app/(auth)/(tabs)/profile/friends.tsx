import { useState } from "react";
import { Text, View } from "react-native";
import ComponentHeader from "@/components/component-header";
import DatePicker from "@/components/forms/date-picker";

export default function Friends() {
	const [date, setDate] = useState(new Date());

	return (
		<View className="flex-1 bg-primary px-4">
			<ComponentHeader text="Přátelé" />
			<Text className="text-white">Date selected: {date.toISOString()}</Text>
			<DatePicker date={date} setDate={setDate} />
		</View>
	);
}
