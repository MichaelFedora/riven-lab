import Vue, { ComponentOptions } from 'vue';

import rivenMap from '../../data/riven-map';

interface IRiven extends Vue {
  cost: number;
  polarity: string;
  itemName: string;
  itemType: number;
  stats: { name: string, value: number }[];
}

export default {
  name: 'riven',
  props: {
    cost: { type: Number, required: true },
    polarity: { type: String, required: true },
    itemName: { type: String, required: true },
    itemType: { type: Number, required: true },
    stats: { type: Array, required: true }, // {name: string, value: number}
  },
  computed: {
    title() {
      let ret = '';
      let length = 0;
      let count = 0;
      this.stats.forEach(a => a.value > 0 && length++); // wow so cheap
      for(let i = 0, stat = this.stats[0]; i < this.stats.length; i++, stat = this.stats[i]) {
        if(stat.value < 0) continue;
        count++;
        if(i === 0)
          ret += rivenMap[stat.name].p;
        else if(count >= length)
          ret += rivenMap[stat.name].s.toLocaleLowerCase();
        else
          ret += '-' + rivenMap[stat.name].p.toLocaleLowerCase();
      };
      return ret;
    },
    statList() {
      const ret: string[] = [];

      for(const stat of this.stats) {
        const v = (stat.value > 0 ? '+' : '') + (Math.round(stat.value * 10) / 10);
        const s = rivenMap[stat.name];
        let statName = s.display_name;
        if(statName instanceof Array)
          statName = statName[this.itemType];
        ret.push(`${v}${s.display_amt_suffix} ${statName}`);
      }

      return ret;
    },
  }
} as ComponentOptions<IRiven>;
