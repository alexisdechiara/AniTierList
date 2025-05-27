export default defineNuxtRouteMiddleware(async (to) => {
	const userStore = useUserStore()
	const tierStore = useTierStore()
	const pageStore = usePageStore()

	if (tierStore.getSkipFetch) {
		console.log("Skip fetch detected")
		tierStore.setSkipFetch(false)
	}
	else {
		pageStore.setIsLoading(true)
		if (userStore.getUser.isLogged && to.params.username == userStore.getUsername) {
			console.log("User Logged and same username detected, trying to fetch new entries")
			const completedDate: Date = new Date(userStore.getUser.lastCompletedAt)
			const formattedDate: number = Number(completedDate.toISOString().slice(0, 10).replace(/-/g, ""))
			const result = await tierStore.fetchEntriesByCompletedDate(to.params.username as string, formattedDate)
			const entries: Array<any> = result || []
			console.log("Last completed date : " + formattedDate)

			if (entries.length > 0) {
				console.log("New entries found, adding to unranked tier")
				tierStore.addUnrankedTierEntries(entries)
			}
			else {
				console.log("No new entries found")
			}
		}
		else {
			console.log("User not logged or different username detected, trying to fetch all entries")
			// tierStore.removeAllTiersEntries() should be called BEFORE attempting to load new user and their entries.
			// This ensures that if a user exists, their new data isn't mixed with old data.
			// If userStore.fetchUserData fails and sets userLoadError, then we won't load new entries anyway.
			tierStore.removeAllTiersEntries()

			await userStore.fetchUserData(to.params.username as string)
			// Removed .catch block and navigateTo("/")
			// console.log("Unknown user : " + e) is removed as error is handled in store

			if (!userStore.userLoadError) {
				console.log(`User ${to.params.username} fetched successfully. Proceeding to fetch their entries.`)
				await tierStore.fetchAllEntries(to.params.username as string).catch((e) => {
					console.log("Error fetching entries: " + e) 
					// Potentially set another error state here in tierStore or a general error store if needed
				})

				tierStore.changeTiersTemplate(tierStore.templates[tierStore.currentTemplate])
				if (to.query.auto != null ? true : false) { // This condition seems a bit complex, could be (to.query.auto != null)
					tierStore.autoRankTiers()
				}
			} else {
				console.log(`User ${to.params.username} not found or error loading user. Error: ${userStore.userLoadError}. Skipping fetching entries.`)
				// Navigation proceeds to /[username].vue, which will handle the display of userLoadError
			}
		}
		pageStore.setIsLoading(false)
	}
})
