import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

import uniFly from 'unifly';

uniFly.baseUrl = 'https://dfl.yinshangjituan.com/app';

uniFly.headers['Content-Type'] = 'application/x-www-form-urlencoded';

Vue.prototype.uniFly = uniFly

const app = new Vue({
	...App
})

app.$mount()
