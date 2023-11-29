export const usePageStore = defineStore({
	id: "Page",
	state: () => ({
		isLoading: false as boolean,
	}),
	getters: {
		getIsLoading(): boolean {
			return this.isLoading;
		},
	},
	actions: {
		setIsLoading(value: boolean) {
			this.isLoading = value;
		},
	},
});
