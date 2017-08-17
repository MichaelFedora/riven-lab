import Vue from 'vue';
import VueMaterial from 'vue-material';

import 'vue-material/dist/vue-material.css';

Vue.use(VueMaterial);

export default (Vue as any).material.registerTheme({
  default: {
    primary: {
      color: 'purple',
      hue: 300,
      textColor: 'white'
    },
    accent: 'light-blue',
    warn: 'deep-orange',
    background: {
      color: 'grey',
      hue: 900,
      textColor: 'white'
    }
  }
});
