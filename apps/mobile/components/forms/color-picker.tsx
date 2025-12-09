/** biome-ignore-all lint/style/useTemplate: more readable */
/** biome-ignore-all lint/suspicious/noArrayIndexKey: its grid */
import { Pencil } from "lucide-react-native";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { type GestureResponderEvent, type LayoutChangeEvent, Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";

type PickerProps = {
	size?: number;
	columns?: number;
	rows?: number;
	initialHex?: string;
	onColorChange?: (hex: string) => void; // called on pick and when "Nastavit barvu" pressed
	className?: string;
	visible: boolean;
	setVisible: (v: boolean) => void;
};

function hsvToRgb(h: number, s: number, v: number) {
	const hh = ((h % 360) + 360) % 360;
	const c = v * s;
	const x = c * (1 - Math.abs(((hh / 60) % 2) - 1));
	const m = v - c;
	let r = 0,
		g = 0,
		b = 0;
	if (hh < 60) {
		r = c;
		g = x;
		b = 0;
	} else if (hh < 120) {
		r = x;
		g = c;
		b = 0;
	} else if (hh < 180) {
		r = 0;
		g = c;
		b = x;
	} else if (hh < 240) {
		r = 0;
		g = x;
		b = c;
	} else if (hh < 300) {
		r = x;
		g = 0;
		b = c;
	} else {
		r = c;
		g = 0;
		b = x;
	}
	return {
		r: Math.round((r + m) * 255),
		g: Math.round((g + m) * 255),
		b: Math.round((b + m) * 255),
	};
}

function rgbToHex({ r, g, b }: { r: number; g: number; b: number }) {
	const toHex = (n: number) => {
		const s = n.toString(16);
		return s.length === 1 ? "0" + s : s;
	};
	return ("#" + toHex(r) + toHex(g) + toHex(b)).toUpperCase();
}

function normalizeHex(h: string) {
	if (!h) {
		return null;
	}
	let s = h.replace("#", "").trim();
	if (s.length === 3) {
		s = s
			.split("")
			.map((c) => c + c)
			.join("");
	}
	// biome-ignore lint/performance/useTopLevelRegex: ok here
	if (!/^[0-9A-Fa-f]{6}$/.test(s)) {
		return null;
	}
	return "#" + s.toUpperCase();
}

export default function ColorPickerBottomSheet({
	size = 300,
	columns = 36,
	rows = 36,
	initialHex = "#FF0000",
	onColorChange,
	className = "",
	visible,
	setVisible,
}: PickerProps) {
	const [selectedHex, setSelectedHex] = useState(() => normalizeHex(initialHex) || "#FF0000");
	const layoutRef = useRef({ width: size, height: size, x: 0, y: 0 });

	// build grid once
	const [grid] = useState<string[][]>(() => {
		const g: string[][] = [];
		for (let r = 0; r < rows; r++) {
			const row: string[] = [];
			for (let c = 0; c < columns; c++) {
				const h = (c / (columns - 1)) * 360;
				const v = 1 - r / (rows - 1);
				const rgb = hsvToRgb(h, 1, v);
				row.push(rgbToHex(rgb));
			}
			g.push(row);
		}
		return g;
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: want to run only once
	useLayoutEffect(() => {
		// biome-ignore lint/nursery/noUnusedExpressions: only once
		onColorChange ? onColorChange(selectedHex) : null;
	}, []);

	const onLayout = (e: LayoutChangeEvent) => {
		const { width, height, x, y } = e.nativeEvent.layout;
		layoutRef.current = { width, height, x, y };
	};

	const pickColorAt = useCallback(
		(evt: GestureResponderEvent) => {
			const { locationX, locationY } = evt.nativeEvent;
			const w = layoutRef.current.width;
			const h = layoutRef.current.height;
			if (w <= 0 || h <= 0 || locationX == null || locationY == null) {
				return;
			}
			const cx = Math.min(columns - 1, Math.max(0, Math.floor((locationX / w) * columns)));
			const ry = Math.min(rows - 1, Math.max(0, Math.floor((locationY / h) * rows)));
			const hex = grid[ry] ? grid[ry][cx] : null;
			if (hex) {
				setSelectedHex(hex);
				// biome-ignore lint/nursery/noUnusedExpressions: only once
				onColorChange ? onColorChange(hex) : null;
			}
		},
		[columns, rows, grid, onColorChange]
	);

	const cellWidth = size / columns;
	const cellHeight = size / rows;

	const close = () => setVisible(false);

	const confirm = () => {
		// biome-ignore lint/nursery/noUnusedExpressions: only once
		onColorChange ? onColorChange(selectedHex) : null;
		setVisible(false);
	};

	return (
		<Modal
			backdropOpacity={0.5}
			hideModalContentWhileAnimating
			isVisible={visible}
			onBackButtonPress={close}
			onBackdropPress={close}
			onSwipeComplete={close}
			propagateSwipe
			style={{ justifyContent: "flex-end", margin: 0 }}
			swipeDirection={["down"]}
			useNativeDriver
			useNativeDriverForBackdrop
		>
			<View
				className={`${className}rounded-t-2xl h-[65%] bg-darker p-4`}
				style={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
			>
				<View className="mb-4 h-1 w-10 self-center rounded-full bg-modalPicker" />

				<View
					onLayout={onLayout}
					onResponderGrant={pickColorAt}
					onResponderMove={pickColorAt}
					onStartShouldSetResponder={() => true}
					onStartShouldSetResponderCapture={() => true}
					pointerEvents="box-only"
					style={{
						width: size,
						height: size,
						overflow: "hidden",
						borderRadius: 8,
						alignSelf: "center",
					}}
				>
					{grid.map((row, rIdx) => (
						<View key={`row-${rIdx}`} style={{ flexDirection: "row" }}>
							{row.map((hex, cIdx) => (
								<View
									key={`cell-${rIdx}-${cIdx}`}
									style={{
										width: cellWidth,
										height: cellHeight,
										backgroundColor: hex,
									}}
								/>
							))}
						</View>
					))}
				</View>

				{/* Preview + hex */}
				<View className="mt-4 flex-row items-center justify-between">
					<View
						className="mr-4 h-11 w-[40%] rounded-xl"
						style={{
							backgroundColor: selectedHex,
						}}
					/>

					<View className="flex-row">
						<TouchableOpacity
							className="mr-1 flex flex-row items-center gap-2 rounded-xl bg-accent px-4 py-2"
							onPress={confirm}
						>
							<Pencil color="white" size={16} />
							<Text className="font-semibold text-lg text-text">Nastavit barvu</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
}
