export default defineNuxtRouteMiddleware(async (to) => {
	const userStore = useUserStore();
	const tierStore = useTierStore();
	const pageStore = usePageStore();

	if (tierStore.getSkipFetch) {
		console.log("Skip fetch detected");
		tierStore.setSkipFetch(false);
	} else {
		pageStore.setIsLoading(true);
		if (userStore.getUser.isLogged && to.params.username == userStore.getUsername) {
			console.log("User Logged and same username detected, trying to fetch new entries");
			const completedDate: Date = new Date(userStore.getUser.lastCompletedAt);
			const formattedDate: number = Number(completedDate.toISOString().slice(0, 10).replace(/-/g, ""));
			const result = await tierStore.fetchEntriesByCompletedDate(to.params.username as string, formattedDate);
			const entries: Array<any> = result || new Array();
			console.log("Last completed date : " + formattedDate);

			if (entries.length > 0) {
				console.log("New entries found, adding to unranked tier");
				tierStore.addUnrankedTierEntries(entries);
			} else {
				console.log("No new entries found");
			}
		} else {
			console.log("User not logged or different username detected, trying to fetch all entries");
			await userStore.fetchUserData(to.params.username as string).catch((e) => {
				console.log("Unknown user : " + e);
				navigateTo("/");
			});

			tierStore.removeAllTiersEntries();

			await tierStore.fetchAllEntries(to.params.username as string).catch((e) => {
				console.log("Error : " + e);
			});

			tierStore.changeTiersTemplate(tierStore.templates[tierStore.currentTemplate]);
			if (to.query.auto != null ? true : false) {
				tierStore.autoRankTiers();
			}
		}
		pageStore.setIsLoading(false);
	}
});
