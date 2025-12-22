import { KeyboardAvoidingView, Platform, ScrollView } from "react-native"

export const ScreenScroll = ({ children }: { children: React.ReactNode }) => {
	return (
		<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
			<ScrollView contentContainerStyle={{ padding: 24 }} keyboardShouldPersistTaps="handled">
				{children}
			</ScrollView>
		</KeyboardAvoidingView>
	)
}
