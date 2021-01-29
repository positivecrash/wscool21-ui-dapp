import Vue from 'vue'
import App from './App.vue'

import './assets/styles/reset.css'
import './assets/styles/typography.css'
import './assets/styles/variables.css'
import './assets/styles/LogoAnimated.css'
import './assets/styles/animation.css'
import './assets/styles/button.css'
import './assets/styles/app.css'
import './assets/styles/demo.css'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
