import { defineStore } from "pinia"
import type { AuthQuery } from "#gql"
import { ScoreFormat, UserTitleLanguage } from "#gql/default"

export const useUserStore = defineStore({
	id: "User",
	state: () => ({
		id: null as number | null,
		username: "" as string,
		avatar: {
			large: "" as string,
			medium: "" as string,
		} as Avatar,
		url: "" as string,
		titleLanguage: "" as UserTitleLanguage,
		displayAdultContent: false as boolean,
		profileColor: "" as string,
		scoreFormat: "DEFAULT" as ScoreFormat | string,
		rowOrder: "" as string,
		isLogged: false as boolean,
		lastCompletedAt: Date.now() as number,
		displayTransition: true as boolean,
		userLoadError: null as string | null, // New state property
	}),
	actions: {
		setUserLoadError(error: string | null) {
			this.userLoadError = error;
		},
		clearUserLoadError() {
			this.userLoadError = null;
		},
		clearCurrentUser() {
			this.id = null;
			this.username = "";
			this.avatar = { large: "", medium: "" };
			this.url = "";
			this.titleLanguage = UserTitleLanguage.ENGLISH; // Or your default
			this.displayAdultContent = false;
			this.profileColor = "blue"; // Or your default
			this.scoreFormat = "DEFAULT"; // Or your default
			this.rowOrder = ""; // Or your default
			this.isLogged = false;
			this.lastCompletedAt = Date.now(); // Or reset to null/initial value if more appropriate
			// this.displayTransition = true; // Assuming this is a general UI setting, not user-specific
			this.clearUserLoadError();
		},
		async fetchUserData(username: string) {
			this.clearCurrentUser(); // Clear previous user data and error state

			const { data } = await useAsyncGql({
				operation: "auth",
				variables: { username: username },
			})
			const user: AuthQuery["User"] = data.value.User
			if (user) {
				this.id = user.id
				this.username = username
				this.avatar = {
					large: user.avatar?.large || "",
					medium: user.avatar?.medium || "",
				}
				this.url = user.siteUrl || ""
				this.titleLanguage = user.options?.titleLanguage || UserTitleLanguage.ENGLISH
				this.displayAdultContent = user.options?.displayAdultContent || false
				this.profileColor = user.options?.profileColor || "blue"
				if (this.scoreFormat == "DEFAULT") {
					this.scoreFormat = user.mediaListOptions?.scoreFormat || ScoreFormat.POINT_10_DECIMAL
				}
				this.rowOrder = user.mediaListOptions?.rowOrder || "UPDATED_AT"
				this.isLogged = true
				this.clearUserLoadError(); // User found, clear any previous error
			}
			else {
				this.setUserLoadError('User not found'); // Set error state
				// Do not throw Error, let the function complete
			}
		},
		setLastCompletedAt(value: number) {
			this.lastCompletedAt = value
		},
		setScoreFormat(value: ScoreFormat | string) {
			this.scoreFormat = value
		},
	},
	getters: {
		getUser: state => state,
		getUsername: state => state.username,
		getTitleLanguage: state => state.titleLanguage,
		getScoreFormat: state => state.scoreFormat.toString(),
	},
	persist: {
		storage: persistedState.localStorage,
	},
})

interface Avatar {
	large: string
	medium: string
}
