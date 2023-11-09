import { useEntriesStore } from './entries';
import { defineStore } from 'pinia';
import templatesJSON from "../content/templates.json";


export const useTierStore = defineStore({
  id: 'tierStore',
  state: () => ({
    tiers: [] as Array<Tier>,
    unrankedTier: [] as Array<any>,
    autoRank: false as Boolean,
    templates: templatesJSON as Array<Template>,
    currentTemplate: 0 as number,
  }),
  getters: {
    isAutoRank(): Boolean {
      return this.autoRank;
    }
  },
  actions: {
    setAutoRank(value: boolean) {
      this.autoRank = value;
    },
    setTiers(entries: Array<any>) {
			entries.forEach((entry:any) => {
				if (entry.score != 0 && this.autoRank) {
					this.tiers.forEach((tier: any) => {
						if (entry.score >= tier.range[0] && entry.score <= tier.range[1]) {
							tier.entries.push(entry);
						}
					});
				} else {
					this.unrankedTier.push(entry);
				}
			});
		},
    setTiersAndAutoRank(entries: Array<any>, autorank: boolean) {
      this.setAutoRank(autorank);
      this.setTiers(entries);
    },
    addTier() {
			if (this.tiers.length >= this.templates[this.currentTemplate].value.length) {
        const newTier: Tier = {
          name: "New tier",
          color: "#2B2D42",
          range: [0, 0],
          entries: [],
        };
        this.tiers.push(newTier);
      } else {
				this.tiers.push(this.templates[this.currentTemplate].value[this.tiers.length]);
      }
    },
    removeTier(index: number) {
			this.unrankedTier.push(...this.tiers[index].entries);
			this.tiers.splice(index, 1);
		},
    changeTiersTemplate(template: Template) {
			if (this.tiers.length > 0) {
				this.removeTiersEntries();
				this.tiers = [];
			}
			this.tiers = Array.from(template.value);
			if (this.autoRank) {
        const storeEntries = useEntriesStore();
				this.setTiers(storeEntries.getAllEntries);
			}
		},
		removeUnrankedTierEntries() {
			this.unrankedTier = [];
		},
		removeTiersEntries() {
			this.tiers.forEach((tier: any) => {
				this.unrankedTier.push(...tier.entries);
				tier = new Array();
			});
		},
    removeAllTiersEntries() {
      this.removeTiersEntries();
      this.removeUnrankedTierEntries();
    }
  },
});

// Tier interface 
interface Tier {
  name: String;
  color: String;
  range: Array<Number>;
  entries: Array<any>;
}

// Templates interface
interface Template {
  label: String;
  value: Array<Tier>;
}