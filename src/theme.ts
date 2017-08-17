import Vue from 'vue';
import VueMaterial from 'vue-material';

import 'vue-material/dist/vue-material.css';

Vue.use(VueMaterial);

export default (Vue as any).material.registerTheme({
  default: {
    primary: {
      color: 'purple',
      hue: 300,
    },
    accent: {
      color: 'purple',
      hue: 200,
    },
    warn: 'deep-orange',
    background: {
      color: 'grey',
      hue: 900,
    }
  }
});
