import type { AuthQuery } from "#gql";
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
		titleLanguage: "" as string,
		displayAdultContent: false as boolean,
		profileColor: "" as string,
		scoreFormat: "" as string,
		isLogged: false as boolean,
		lastCompletedAt: Date.now() as number,
		previousCompletedAt: Date.now() as number,
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
				this.username = user.name;
				this.avatar = user.avatar;
				this.url = user.siteUrl;
				this.titleLanguage = user.options.titleLanguage;
				this.displayAdultContent = user.options.displayAdultContent;
				this.profileColor = user.options.profileColor;
				this.scoreFormat = user.options.scoreFormat;
				this.isLogged = true;
			} else throw Error("User not found");
		},
		setPreviousCompletedAt(value: number) {
			this.previousCompletedAt = value;
		},
		setLastCompletedAt(value: number) {
			this.lastCompletedAt = value;
		},
	},
	getters: {
		getUser: (state) => state,
	},
	persist: {
		storage: persistedState.localStorage,
	},
});

interface Avatar {
	large: string;
	medium: string;
}
