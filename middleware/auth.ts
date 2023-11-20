export default defineNuxtRouteMiddleware(async (to) => {
	const userStore = useUserStore();
	const filterStore = useFilterStore();
	const tierStore = useTierStore();

	if (to.query.min != null && Number(to.query.min) != 0 && Number(to.query.min) <= 10) filterStore.setMinimumRange(Number(to.query.min));
	if (to.query.max != null && Number(to.query.max) != 10 && Number(to.query.max) >= 0) filterStore.setMaximumRange(Number(to.query.max));

	if (userStore.getUser.isLogged && to.params.username === userStore.getUsername) {
		console.log("User completed new entries : " + userStore.getUser.lastCompletedAt);
		const completedDate: Date = new Date(userStore.getUser.lastCompletedAt);
		const formattedDate: number = Number(completedDate.toISOString().slice(0, 10).replace(/-/g, ""));
		console.log("Date : " + formattedDate);

		const result = await tierStore.fetchEntriesByCompletedDate(to.params.username as string, formattedDate);
		const entries: Array<any> = result || new Array();

		if (entries.length > 0) {
			tierStore.addUnrankedTierEntries(entries);
		} else {
			console.log("User Logged and no new entries found : ");
		}
	} else {
		console.log("User not logged : " + to.params.username);

		tierStore.removeAllTiersEntries();
		await userStore.fetchUserData(to.params.username as string).catch((e) => {
			console.log("Error : " + e);
			navigateTo("/");
		});

		await tierStore.fetchAllEntries(to.params.username as string, to.query.franchise != null && to.query.franchise == "true").catch((e) => {
			console.log("Error : " + e);
		});
		tierStore.changeTiersTemplate(tierStore.templates[tierStore.currentTemplate]);
		if (to.query.auto != null ? true : false) {
			tierStore.autoRankTiers();
		}
	}
});
