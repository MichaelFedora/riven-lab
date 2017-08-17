import Vue, { ComponentOptions } from 'vue';
import rivenMap from '../data/riven-map';

function isCompat(itemType: number, rivenType: string) {
  return !rivenType ||
        (rivenType === 'Projectile' && itemType < 2) ||
        (rivenType === 'Melee' && itemType === 2);
}

const statTypes: {
  name: string,
  p: string,
  s: string,
  type: '' | 'Projectile' | 'Melee',
  display_name: string | string[],
  display_amt_suffix: string
}[] = [];

for(const key in rivenMap) if(rivenMap[key] && typeof rivenMap[key] === 'object') {
  statTypes.push(Object.assign({ name: key }, rivenMap[key]));
}

const sampleItems = [
  { name: 'Opticor', type: 0 },
  { name: 'Paris', type: 0 },
  { name: 'Lato', type: 1 },
  { name: 'Twin Grakatas', type: 1 },
  { name: 'Bo', type: 2 },
  { name: 'War', type: 2 },
];

const polarities = [
  'madurai',
  'naramon',
  'vazarin',
  'zenurik'
];

interface IApp extends Vue {
  itemName: string;
  itemType: number;
  cost: number;
  polarity: string;
  stats: { name: string, value: number }[];

  costStr: string;
  polarityIdx: number;

  polarities: string[];
  statTypes: typeof statTypes;

  statValueStr: string[];
  query: {[key: string]: string};
  updateQuery: boolean;

  negatives: number;
  hasDuplicates: boolean;
  incompats: string[];

  setFromRoute(): void;
}

export default {
  name: 'app',
  data: () => {
    return {
      itemName: '',
      itemType: 0,
      cost: 10,
      stats: [],

      costStr: '10',
      polarityIdx: 0,

      polarities: polarities,
      statTypes: statTypes,

      statValueStr: ['', '', '', ''],
      query: {},
      updateQuery: false,
    } as IApp;
  },
  computed: {
    polarity() {
      return polarities[this.polarityIdx];
    },
    negatives() {
      return this.stats.filter(a => a.value < 0).length;
    },
    hasDuplicates() {
      return this.stats.findIndex((a, i, arr) => arr.length - 1 > i && arr.slice(i + 1).findIndex(b => a.name === b.name) >= 0) >= 0;
    },
    incompats() {
      return this.stats.filter(a => !isCompat(this.itemType, rivenMap[a.name].type)).map(a => rivenMap[a.name].display_name);
    }
  },
  watch: {
    itemName(n) {
      this.query['itemName'] = n;
      this.updateQuery = true;
    },
    itemType(n) {
      this.query['itemType'] = n;
      this.updateQuery = true;
    },
    polarityIdx(n) {
      this.query['polarity'] = polarities[n];
      this.updateQuery = true;
    },
    costStr() {
      if('' + this.cost === this.costStr) return;
      const i = Number.parseInt(this.costStr);
      if((i || i === 0) && i >= 10 && i <= 18) this.cost = i;
      else this.costStr = '' + i;
      this.query['cost'] = this.costStr;
      this.updateQuery = true;
    },
    cost(n, o) {
      if('' + this.cost !== this.costStr) { this.query['cost'] = this.costStr = '' + this.cost; }
      o -= 9;
      n -= 9;
      this.stats.forEach((a, i) => {
        a.value = a.value / o * n;
        this.query[a.name] = this.statValueStr[i] = a.value.toFixed(2);
      });
      this.updateQuery = true;
    },
    statValueStr(newSVals) {
      for(let i = 0, statValue = newSVals[i]; i < newSVals.length && i < this.stats.length; i++, statValue = newSVals[i]) {
        if('' + this.stats[i].value === statValue) continue;
        const p = Number.parseFloat(statValue);
        if(p || p === 0) this.stats[i].value = p;
        this.query[this.stats[i].name] = statValue;
        this.updateQuery = true;
      }
    },
    stats(newStats) {
      for(let i = 0, stat = newStats[i]; i < newStats.length; i++, stat = newStats[i]) {
        if(this.statValueStr[i] === stat.value.toFixed(2)) continue;
        this.query[stat.name] = this.statValueStr[i] = stat.value.toFixed(2);
        this.updateQuery = true;
      }
    },
    $route(n, o) {
      if(this.$route.query.itemName && this.$route.query.itemName !== this.itemName)
      this.itemName = this.$route.query.itemName || this.polarity;

      let i = Number.parseInt(this.$route.query.itemType);
      if((i || i === 0) && i !== this.itemType) this.itemType = i;

      i = Number.parseInt(this.$route.query.cost);
      if((i || i === 0) && i !== this.cost) this.cost = i;

      const p = this.$route.query.polarity || this.polarity;
      const pi = polarities.findIndex(a => a === p) || 0;
      if(pi !== this.polarityIdx)
        this.polarityIdx = pi;

      const stats: { name: string, value: number }[] = [];
      for(const key in this.$route.query) if(!['itemName', 'itemType', 'cost', 'polarity'].find(a => a === key) && this.$route.query[key]) {
        const val = Number.parseFloat(this.$route.query[key]);
        if(!val && val !== 0) continue;
        stats.push({ name: key, value: val });
      }
      if(stats.length > 0 && !stats.every((a, ai) => stats[ai].name === this.stats[ai].name))
        this.$nextTick(() => this.stats.splice(0, this.stats.length, ...stats));
    }
  },
  created() {

    const fromRoute = this.setFromRoute();

    if(!fromRoute) {
      const sampleItem = sampleItems[Math.floor(Math.random() * 6)];

      this.itemName = sampleItem.name;
      this.itemType = sampleItem.type;
      this.cost = 10 + Math.floor(Math.random() * 9);
      this.costStr = '' + this.cost;
      this.polarityIdx = Math.floor(Math.random() * polarities.length);
      this.$nextTick(() => { // gets around getting multiplied by cost twice
        this.stats = (() => {
          const amt = Math.floor(Math.random() * 3 + 2);
          const negative = (amt >= 4 || amt === 3 && Math.floor(Math.random())) ? true : false;
          const ret: { name: string, value: number }[] = [];
          for(let i = 0; i < amt; i++) {
            let s = statTypes[Math.floor(Math.random() * statTypes.length)];
            while(ret.find(a => a.name === s.name) || !isCompat(this.itemType, s.type))
              s = statTypes[Math.floor(Math.random() * statTypes.length)];
            const val = Math.round((Math.random() * 200 + 100) * (this.cost - 9)) / 10;
            if(i === amt - 1 && negative) ret.push({ name: s.name, value: -val });
            else ret.push({ name: s.name, value: val });
          }
          return ret;
        })();

        this.stats.forEach((a, i) => this.statValueStr[i] = a.value.toFixed(2));
      });
    }

    this.$nextTick(() => {
      this.query['itemName'] = this.itemName;
      this.query['itemType'] = '' + this.itemType;
      this.query['cost'] = this.costStr;
      this.query['polarity'] = polarities[this.polarityIdx];
      this.stats.forEach(a => this.query[a.name] = a.value.toFixed(2));
      this.updateQuery = true;
    });
  },
  updated() {
    if(this.updateQuery) {
      this.$router.replace({ path: this.$route.fullPath, query: this.query });
      this.updateQuery = false;
    }
  },
  methods: {
    setFromRoute() {
      let changed = this.$route.query.itemName ? true : false;
      this.itemName = this.$route.query.itemName || this.polarity;

      let i = Number.parseInt(this.$route.query.itemType);
      if(i || i === 0) { this.itemType = i; changed = true; }

      i = Number.parseInt(this.$route.query.cost);
      if(i || i === 0) { this.cost = i; changed = true; }

      const p = this.$route.query.polarity || this.polarity;
      this.polarityIdx = polarities.findIndex(a => a === p) || 0;
      changed = changed || (this.$route.query.polarity ? true : false);

      const stats: { name: string, value: number }[] = [];
      for(const key in this.$route.query) if(!['itemName', 'itemType', 'cost', 'polarity'].find(a => a === key) && this.$route.query[key]) {
        const val = Number.parseFloat(this.$route.query[key]);
        if(!val && val !== 0) continue;
        stats.push({ name: key, value: val });
      }
      if(stats.length > 0) {
        changed = true;
        this.$nextTick(() => this.stats.splice(0, this.stats.length, ...stats));
      }

      return changed;
    },
    getDisplayName(stat) {
      if(stat.display_name instanceof Array) return stat.display_name[this.itemType];
      else return stat.display_name;
    },
    removeStat(idx) {
      this.stats.splice(idx, 1);
    },
    addStat() {
      let s = statTypes[Math.floor(Math.random() * statTypes.length)];
      while(this.stats.find(a => a.name === s.name) || !isCompat(this.itemType, s.type))
        s = statTypes[Math.floor(Math.random() * statTypes.length)];

      let val = Math.round((Math.random() * 200 + 100) * (this.cost - 9)) / 10;

      if(!this.negatives && (this.stats.length === 3 || (this.stats.length === 2 && Math.round(Math.random()))))
        val = -val;

      this.stats.push({ name: s.name, value: val });
    }
  }
} as ComponentOptions<IApp>;
