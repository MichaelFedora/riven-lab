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
  { name: 'Braton', type: 0 },
  { name: 'Lenz', type: 0 },
  { name: 'Vectis', type: 0 },

  { name: 'Lato', type: 1 },
  { name: 'Lex', type: 1 },
  { name: 'Twin Grakatas', type: 1 },
  { name: 'AkZani', type: 1 },

  { name: 'Bo', type: 2 },
  { name: 'War', type: 2 },
  { name: 'Orthos', type: 2 },
  { name: 'Reaper Prime', type: 2 },
  { name: 'Nikana', type: 2 },
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

  polarityIdx: number;

  polarities: string[];
  statTypes: typeof statTypes;

  updatedRoute: boolean;

  negatives: number;
  hasDuplicates: boolean;
  incompats: string[];

  randomize(): void;
  setFromRoute(): void;
  updateQuery(): void;
  updateSelectText(): void;
  reroll(): void;
}

export default {
  name: 'app',
  data: () => {
    return {
      itemName: '',
      itemType: 0,
      cost: 10,
      stats: [],

      polarityIdx: 0,

      polarities: polarities,
      statTypes: statTypes,

      updatedRoute: false,
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
    itemType(n, o) {
      this.updateSelectText();
    },
    stats(n, o) {
      this.updateSelectText();
    },
    cost(n, o) {
      if(o < 10 || o > 18) return;
      if(n < 10) { this.$nextTick(() => this.cost = 10); n = 10; }
      if(n > 18) { this.$nextTick(() => this.cost = 18); n = 18; }
      o -= 9;
      n -= 9;
      this.stats.forEach((a, i) => a.value = a.value / o * n);
    },
    $route(n, o) {
      if(this.updatedRoute) { this.updatedRoute = false; return; }

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
      if(stats.length > 0 && !stats.every((a, ai) => this.stats[ai] && stats[ai].name === this.stats[ai].name))
        this.$nextTick(() => this.stats.splice(0, this.stats.length, ...stats));
    }
  },
  created() {

    const fromRoute = this.setFromRoute();

    if(!fromRoute)
      this.randomize();

    this.$nextTick(() => this.updateQuery());
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
    randomize() {
      const sampleItem = sampleItems[Math.floor(Math.random() * sampleItems.length)];

      this.itemName = sampleItem.name;
      this.itemType = sampleItem.type;
      this.cost = 10 + Math.floor(Math.random() * 9);
      this.polarityIdx = Math.floor(Math.random() * polarities.length);
      this.$nextTick(() => this.reroll()); // gets around getting multiplied by cost twice & updates the query already
    },
    reroll() {
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
      this.updateQuery();
    },
    reset() {
      this.itemName = '';
      this.itemType = 0;
      this.cost = 10;
      this.polarityIdx = 0;
      this.stats.splice(0, this.stats.length);
      this.updateQuery();
    },
    updateSelectText() {
      const statDOM = document.body.querySelectorAll('div.stat');
      for(let i = 0; i < statDOM.length && i < this.stats.length; i++) {

        const statSelectDOM = statDOM.item(i).querySelector('span.md-select-value');
        if(!statSelectDOM) { console.error(`Couldn't find the stat select dome!'`); return; }
        const r = rivenMap[this.stats[i].name].display_name;
        statSelectDOM.textContent = r instanceof Array ? r[this.itemType] : r;
      }
    },
    updateQuery() {
      const query: {[key: string]: string} = {
        itemName: this.itemName,
        itemType: '' + this.itemType,
        cost: '' + this.cost,
        polarity: polarities[this.polarityIdx],
      };
      this.stats.forEach(a => query[a.name] = a.value.toFixed(2));
      this.$router.replace({ path: this.$route.path, query: query });
      this.updatedRoute = true;
    },
    getDisplayName(stat) {
      if(stat.display_name instanceof Array) return stat.display_name[this.itemType];
      else return stat.display_name;
    },
    removeStat(idx) {
      const deleted = this.stats.splice(idx, 1);
      this.updateQuery();
    },
    addStat() {
      let s = statTypes[Math.floor(Math.random() * statTypes.length)];
      while(this.stats.find(a => a.name === s.name) || !isCompat(this.itemType, s.type))
        s = statTypes[Math.floor(Math.random() * statTypes.length)];

      let val = Math.round((Math.random() * 200 + 100) * (this.cost - 9)) / 10;

      if(!this.negatives && (this.stats.length === 3 || (this.stats.length === 2 && Math.round(Math.random()))))
        val = -val;

      this.stats.push({ name: s.name, value: val });
      this.updateQuery();
    }
  }
} as ComponentOptions<IApp>;
