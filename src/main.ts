import Vue, { ComponentOptions } from 'vue';

import './components/component-module';
import './theme';

import './styles.scss';

import VeeValidate, { Validator } from 'vee-validate';
import moment from 'moment';

Validator.installDateTimeValidators(moment);
Vue.use(VeeValidate);

import VueRouter from 'vue-router';
Vue.use(VueRouter);

import AppComponent from './app/app';

console.log('Environment:', process.env.NODE_ENV);

const v = new Vue({
  router: new VueRouter({ mode: 'history' }),
  el: '#app',
  components: { AppComponent },
  render: h => h(AppComponent)
} as ComponentOptions<Vue>)
