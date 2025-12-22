import { SafeAreaView } from "react-native-safe-area-context"

type ScreenProps = {
	children: React.ReactNode
	edges?: ("top" | "bottom" | "left" | "right")[]
}

export const BaseScreen = ({ children, edges = ["top", "left", "right"] }: ScreenProps) => {
	return (
		<SafeAreaView edges={edges} style={{ flex: 1 }}>
			{children}
		</SafeAreaView>
	)
}
