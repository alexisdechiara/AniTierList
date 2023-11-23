import { ScoreFormat } from "#gql/default";
export default defineNuxtRouteMiddleware(async (to) => {
	const userStore = useUserStore();
	const filterStore = useFilterStore();
	const tierStore = useTierStore();

	if (to.query.min != null) filterStore.setMinimumRange(Number(to.query.min));
	if (to.query.max != null) filterStore.setMaximumRange(Number(to.query.max));

	if (userStore.getUser.isLogged && to.params.username === userStore.getUsername) {
		console.log("User completed new entries : " + userStore.getUser.lastCompletedAt);
		const completedDate: Date = new Date(userStore.getUser.lastCompletedAt);
		const formattedDate: number = Number(completedDate.toISOString().slice(0, 10).replace(/-/g, ""));
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

		if (to.query.scoring != null) userStore.setScoreFormat(to.query.scoring as ScoreFormat);

		await tierStore.fetchAllEntries(to.params.username as string, userStore.getScoreFormat ? userStore.getScoreFormat : ScoreFormat.POINT_10_DECIMAL, to.query.franchise != null && to.query.franchise == "true").catch((e) => {
			console.log("Error : " + e);
		});
		tierStore.changeTiersTemplate(tierStore.templates[tierStore.currentTemplate]);
		if (to.query.auto != null ? true : false) {
			tierStore.autoRankTiers();
		}
	}
});
