import type { AuthQuery } from "#gql";
import { ScoreFormat, UserTitleLanguage } from "#gql/default";
import { defineStore } from "pinia";

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
	}),
	actions: {
		async fetchUserData(username: string) {
			const { data } = await useAsyncGql({
				operation: "auth",
				variables: { username: username },
			});
			const user: AuthQuery["User"] = data.value.User;
			if (user) {
				this.id = user.id;
				this.username = username;
				this.avatar = user.avatar;
				this.url = user.siteUrl || "";
				this.titleLanguage = user.options?.titleLanguage || UserTitleLanguage.ENGLISH;
				this.displayAdultContent = user.options?.displayAdultContent || false;
				this.profileColor = user.options?.profileColor || "blue";
				if (this.scoreFormat == "DEFAULT") {
					this.scoreFormat = user.mediaListOptions?.scoreFormat || ScoreFormat.POINT_10_DECIMAL;
				}
				this.rowOrder = user.mediaListOptions?.rowOrder || "UPDATED_AT";
				this.isLogged = true;
			} else throw Error("User not found");
		},
		setLastCompletedAt(value: number) {
			this.lastCompletedAt = value;
		},
		setScoreFormat(value: ScoreFormat | string) {
			this.scoreFormat = value;
		},
	},
	getters: {
		getUser: (state) => state,
		getUsername: (state) => state.username,
		getTitleLanguage: (state) => state.titleLanguage,
		getScoreFormat: (state) => state.scoreFormat.toString(),
	},
	persist: {
		storage: persistedState.localStorage,
	},
});

interface Avatar {
	large: string;
	medium: string;
}
