import DateTimePicker, { type DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Calendar } from "lucide-react-native";
import { useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import { COLORS } from "@/constants/COLORS";
import { formatDate } from "@/src/utils/date-utils";

export default function DatePicker({ date, setDate }: { date: Date; setDate: (date: Date) => void }) {
	const [show, setShow] = useState(false);

	// biome-ignore lint/correctness/noUnusedFunctionParameters: needed for DateTimePickerEvent, no logic needed
	const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
		setShow(Platform.OS === "ios"); // Na iOS zůstává picker otevřený
		if (selectedDate) {
			setDate(selectedDate);
		}
	};

	const showDatepicker = () => {
		setShow(true);
	};

	return (
		<View>
			<Pressable
				className="flex h-13 flex-row items-center gap-4 rounded-xl bg-secondary px-4 py-3"
				onPress={showDatepicker}
			>
				<Calendar color={COLORS.muted} size={20} />
				<Text className="text-base text-white">{formatDate(date, "dd.MM.yyyy")}</Text>
			</Pressable>
			{show && (
				<DateTimePicker
					className="bg-darker"
					display="default"
					mode="date"
					onChange={onChange}
					value={date}
				/>
			)}
		</View>
	);
}
