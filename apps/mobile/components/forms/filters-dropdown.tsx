import { useQuery } from "convex/react";
import { Check, ChevronDown } from "lucide-react-native";
import { useRef, useState } from "react";
import {
	Animated,
	Dimensions,
	Easing,
	findNodeHandle,
	type LayoutChangeEvent,
	Modal,
	Platform,
	ScrollView,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	UIManager,
	View,
	type ViewStyle,
} from "react-native";
import { COLORS } from "@/constants/COLORS";
import { api } from "../../../../packages/convex/convex/_generated/api";

export type Option = {
	_id: string;
};

type Props = {
	value?: string;
	onChange: (value: string) => void;
	maxHeight?: number;
	popupOffset?: number;
	variant: "darker" | "modal";
};

const DEFAULT_MAX_HEIGHT = 240;

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: it is not
export default function FilterDropdown({
	value,
	onChange,
	maxHeight = DEFAULT_MAX_HEIGHT,
	popupOffset = 6,
	variant,
}: Props) {
	const [modalVisible, setModalVisible] = useState(false);
	const [open, setOpen] = useState(false);
	const [menuPos, setMenuPos] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
	const [contentNaturalHeight, setContentNaturalHeight] = useState<number>(0);
	const [dropdownHeight, setDropdownHeight] = useState<number>(Math.min(maxHeight, DEFAULT_MAX_HEIGHT));
	const [openAbove, setOpenAbove] = useState<boolean>(false);

	const options = useQuery(api.filters.getAllFilters) || [];

	const touchRef = useRef<typeof TouchableOpacity | null>(null);

	const animOpacity = useRef(new Animated.Value(0)).current;
	const animTranslate = useRef(new Animated.Value(6)).current;
	const animRotate = useRef(new Animated.Value(0)).current;

	const windowHeight = Dimensions.get("window").height;

	function measureInput(): Promise<{ x: number; y: number; width: number; height: number } | null> {
		return new Promise((resolve) => {
			// @ts-expect-error
			const node = findNodeHandle(touchRef.current);
			if (!(node && UIManager && UIManager.measureInWindow)) {
				resolve(null);
				return;
			}
			UIManager.measureInWindow(node, (x: number, y: number, width: number, height: number) => {
				const pos = { x, y, width, height };
				resolve(pos);
			});
		});
	}

	const openDropdown = async () => {
		const pos = await measureInput();
		if (!pos) {
			setMenuPos(null);
			setModalVisible(true);
			setOpen(true);
			animOpacity.setValue(0);
			animTranslate.setValue(6);
			Animated.parallel([
				Animated.timing(animOpacity, {
					toValue: 1,
					duration: 180,
					easing: Easing.out(Easing.cubic),
					useNativeDriver: true,
				}),
				Animated.timing(animTranslate, {
					toValue: 0,
					duration: 200,
					easing: Easing.out(Easing.cubic),
					useNativeDriver: true,
				}),
				Animated.timing(animRotate, {
					toValue: 1,
					duration: 180,
					easing: Easing.out(Easing.cubic),
					useNativeDriver: true,
				}),
			]).start();
			return;
		}

		setMenuPos(pos);
		setModalVisible(true);
		requestAnimationFrame(() => {
			setOpen(true);
			animOpacity.setValue(0);
			animTranslate.setValue(6);
			Animated.parallel([
				Animated.timing(animOpacity, {
					toValue: 1,
					duration: 180,
					easing: Easing.out(Easing.cubic),
					useNativeDriver: true,
				}),
				Animated.timing(animTranslate, {
					toValue: 0,
					duration: 200,
					easing: Easing.out(Easing.cubic),
					useNativeDriver: true,
				}),
				Animated.timing(animRotate, {
					toValue: 1,
					duration: 180,
					easing: Easing.out(Easing.cubic),
					useNativeDriver: true,
				}),
			]).start();
		});
	};

	const closeDropdown = () => {
		Animated.parallel([
			Animated.timing(animOpacity, {
				toValue: 0,
				duration: 140,
				easing: Easing.in(Easing.cubic),
				useNativeDriver: true,
			}),
			Animated.timing(animTranslate, {
				toValue: openAbove ? -6 : 6,
				duration: 160,
				easing: Easing.in(Easing.cubic),
				useNativeDriver: true,
			}),
			Animated.timing(animRotate, {
				toValue: 0,
				duration: 160,
				easing: Easing.in(Easing.cubic),
				useNativeDriver: true,
			}),
		]).start(() => {
			setOpen(false);
			setModalVisible(false);
		});
	};

	const toggle = () => {
		if (open) {
			closeDropdown();
		} else {
			openDropdown();
		}
	};

	function handleSelect(opt: Option) {
		onChange(opt._id);
		closeDropdown();
	}

	function onContentLayout(e: LayoutChangeEvent) {
		const h = e.nativeEvent.layout.height;
		if (h !== contentNaturalHeight) {
			setContentNaturalHeight(h);
		}
	}

	if (menuPos) {
		const natural = contentNaturalHeight > 0 ? contentNaturalHeight : maxHeight;
		const usableBelow = windowHeight - (menuPos.y + menuPos.height) - popupOffset;
		const usableAbove = menuPos.y - popupOffset;

		let wantOpenAbove = false;
		let finalHeight = Math.min(natural, maxHeight);

		if (usableBelow >= finalHeight) {
			wantOpenAbove = false;
			finalHeight = Math.min(finalHeight, usableBelow);
		} else if (usableAbove >= finalHeight) {
			wantOpenAbove = true;
			finalHeight = Math.min(finalHeight, usableAbove);
		} else {
			if (usableBelow >= usableAbove) {
				wantOpenAbove = false;
				finalHeight = Math.max(0, usableBelow);
			} else {
				wantOpenAbove = true;
				finalHeight = Math.max(0, usableAbove);
			}
			finalHeight = Math.max(64, Math.min(finalHeight, maxHeight));
		}

		if (openAbove !== wantOpenAbove) {
			setOpenAbove(wantOpenAbove);
		}
		if (dropdownHeight !== finalHeight) {
			setDropdownHeight(finalHeight);
		}
	}

	const selected = options.find((o) => o._id === value);

	const rotate = animRotate.interpolate({
		inputRange: [0, 1],
		outputRange: ["0deg", "180deg"],
	});

	const menuStyle: ViewStyle | undefined = menuPos
		? {
				position: "absolute",
				left: menuPos.x,
				top: openAbove
					? Math.max(8, menuPos.y - popupOffset - dropdownHeight)
					: menuPos.y + menuPos.height + popupOffset,
				width: menuPos.width,
				...(Platform.OS === "android" ? { elevation: 20 } : { zIndex: 9999 }),
			}
		: {
				position: "absolute",
				left: 20,
				right: 20,
				top: Dimensions.get("window").height / 3,
				...(Platform.OS === "android" ? { elevation: 20 } : { zIndex: 9999 }),
			};

	return (
		<>
			<TouchableOpacity
				activeOpacity={0.85}
				className="flex-row items-center justify-between rounded-xl bg-secondary px-3 py-3.5"
				collapsable={false}
				onPress={toggle}
				// @ts-expect-error
				ref={touchRef}
			>
				<View className="flex-row items-center">
					{selected ? (
						<View
							style={{
								width: 16,
								height: 16,
								borderRadius: 10,
								backgroundColor: selected.color,
								marginRight: 12,
							}}
						/>
					) : null}

					<Text className={`${selected ? "text-text" : "text-muted"} text-base`}>
						{selected ? selected.name : "Vyberte filtr..."}
					</Text>
				</View>

				<Animated.View style={{ transform: [{ rotate }] }}>
					<ChevronDown color={COLORS.muted} size={20} />
				</Animated.View>
			</TouchableOpacity>

			<Modal animationType="none" onRequestClose={closeDropdown} transparent visible={modalVisible}>
				<TouchableWithoutFeedback onPress={() => closeDropdown()}>
					<View style={{ flex: 1 }}>
						<View style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0 }} />

						<Animated.View
							style={[
								menuStyle,
								{ opacity: animOpacity, transform: [{ translateY: animTranslate }] },
							]}
						>
							<View
								className={`${variant === "darker" ? "" : "border border-secondary"} overflow-hidden rounded-xl bg-darker`}
							>
								<ScrollView
									showsVerticalScrollIndicator={false}
									style={{ maxHeight: dropdownHeight }}
								>
									<View onLayout={onContentLayout}>
										{options.map((opt) => {
											const isSelected = value === opt._id;
											return (
												<TouchableOpacity
													activeOpacity={0.8}
													className={`${isSelected && "bg-secondary"} flex-row items-center justify-between p-3`}
													key={opt._id}
													onPress={() => handleSelect(opt)}
												>
													<View className="flex-row items-center">
														<View
															style={{
																width: 16,
																height: 16,
																borderRadius: 10,
																backgroundColor:
																	opt.color,
																marginRight: 12,
															}}
														/>
														<Text className="text-base text-text">
															{opt.name}
														</Text>
													</View>

													{isSelected ? (
														<Check
															color={COLORS.muted}
															size={20}
														/>
													) : null}
												</TouchableOpacity>
											);
										})}
									</View>
								</ScrollView>
							</View>
						</Animated.View>
					</View>
				</TouchableWithoutFeedback>
			</Modal>
		</>
	);
}
