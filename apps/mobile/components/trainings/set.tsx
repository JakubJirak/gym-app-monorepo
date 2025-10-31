import { Text, View } from "react-native";

type ExerciseSetProps = {
      order: number;
      weight: number;
      reps: number;
};

export default function ExerciseSet({ order, weight, reps }: ExerciseSetProps) {
      return (
            <View className="my-1.5 flex-row rounded-xl bg-secondary px-4 py-2.5">
                  <Text className="flex-1 text-white">{order + 1}. série</Text>
                  <Text className="font-semibold text-white">
                        {weight}kg × {reps}
                  </Text>
            </View>
      );
}
