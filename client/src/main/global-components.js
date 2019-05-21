import Vue from 'vue';
import ElementUI from 'element-ui';
import headTop from '../components/headTop.vue';
import userfoot from '../userviews/userfoot.vue';
import userhead from '../userviews/userhead.vue';

Vue.use(ElementUI);
Vue.component('headTop', headTop);
Vue.component('userfoot', userfoot);
Vue.component('userhead', userhead);