export default defineNuxtRouteMiddleware(async (to, from) => {
	const nuxtApp = useNuxtApp();

	const userStore = useUserStore();
	const store = useEntriesStore();
	const filterStore = useFilterStore();
	const tierStore = useTierStore();

	if (to.query.min != null && Number(to.query.min) != 0 && Number(to.query.min) <= 10) filterStore.setMinimumRange(Number(to.query.min));
	if (to.query.max != null && Number(to.query.max) != 10 && Number(to.query.max) >= 0) filterStore.setMaximumRange(Number(to.query.max));

	if (userStore.getUser.isLogged) {
		if (to.params.username !== userStore.getUser.username) {
			tierStore.removeAllTiersEntries();
		} else if (userStore.getUser.lastCompletedAt > userStore.getUser.previousCompletedAt) {
			// add new entries in the store with custom query containing previous completed at as completed at filter
			return navigateTo(to.fullPath);
		}
	}

	await userStore.fetchUserData(to.params.username as string).catch((e) => {
		console.log("Error : " + e);
		navigateTo("/");
	});

	await store.fetchAllData(to.params.username as string);

	if (to.query.franchise != null && to.query.franchise == "true") {
		store.setEntriesByFranchise();
	} else {
		store.setEntriesBySeasons();
	}

	store.sortEntriesByScore();
	tierStore.changeTiersTemplate(tierStore.templates[tierStore.currentTemplate]);
	tierStore.setAutoRank(to.query.auto != null ? true : false);
	tierStore.setTiers(store.getAllEntries);
});
