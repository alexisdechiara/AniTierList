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
		scoreFormat: ScoreFormat.POINT_10_DECIMAL as ScoreFormat,
		rowOrder: "" as string,
		isLogged: false as boolean,
		lastCompletedAt: Date.now() as number,
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
				this.url = user.siteUrl;
				this.titleLanguage = user.options.titleLanguage;
				this.displayAdultContent = user.options.displayAdultContent;
				this.profileColor = user.options.profileColor;
				this.scoreFormat = user.mediaListOptions.scoreFormat;
				this.isLogged = true;
			} else throw Error("User not found");
		},
		setLastCompletedAt(value: number) {
			this.lastCompletedAt = value;
		},
	},
	getters: {
		getUser: (state) => state,
		getUsername: (state) => state.username,
		getTitleLanguage: (state) => state.titleLanguage,
	},
	persist: {
		storage: persistedState.localStorage,
	},
});

interface Avatar {
	large: string;
	medium: string;
}
