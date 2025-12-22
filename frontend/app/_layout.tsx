import { Slot } from "expo-router"
import { BaseScreen } from "../conponents/BaseScreen"

export default function HomeLayout() {
	return (
		<BaseScreen>
			<Slot />
		</BaseScreen>
	)
}
