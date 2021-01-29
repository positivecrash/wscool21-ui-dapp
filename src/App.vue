<template>
  <div id="app">

  <div class="top">
        <h1>dApp Robonomics Demo</h1>
        <i>Winter School 2021</i>

        <img class="label" alt="" src="./assets/images/robonomics-winter-school-2021-logo-3.png"/>
  </div>

  <div class="content" :class="{ load: load }">
    
    <template v-if="load">
      
      <div class="logo-animated">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="196.9px" height="170.3px" viewBox="0 0 196.9 170.3" style="enable-background:new 0 0 196.9 170.3;" xml:space="preserve">
                <g transform="translate(2530 155)">
                  <path class="line" d="M-2523.4,7.9l184.2,0.5l-91.7-158.1L-2523.4,7.9z"/>

                  <circle class="dot" cx="-2339.7" cy="8.7" r="6.6"/>
                  <circle class="dot" cx="-2523.4" cy="8.2" r="6.6"/>
                  <circle class="dot" cx="-2430.8" cy="-148.4" r="6.6"/>
                  
                  <path class="triangle-1" d="M-2477.3-18.3l92.1,0.3l-45.8-79L-2477.3-18.3z"/>
                  <path class="triangle-2" d="M-2431.2-18.1l46,0.1l-45.8-79L-2431.2-18.1z"/>
                  <path class="triangle-3" d="M-2477.3-18.3l92.1,0.3l-46-20.3L-2477.3-18.3z"/>
                </g>
            </svg>
        </div>

    </template>

    <template v-else>

      <div v-if="error" class="error">{{ error }}</div>

      <template v-else-if="api && account">

        <div class="layout">

          <div class="box account">
            <div class="account__address">
              <Identicon
                :value="account"
                :theme="'polkadot'"
                :size="40"
                :class="'inline-block'"
              />
              <code class="inline-block">{{ AccountAddress }}</code>
              
            </div>
            <div class="account__balance">{{ balance }}</div>
            <button @click="faucet" class="primary button__large">
              <Icon icon="faucet" />
              <span class="inline-block">Faucet</span>
            </button>
          </div>

          <div>
            <div class="tabs">
              <button @click="tab = 'demo'" :class="{ active: tab === 'demo' }">
                demo
              </button>

              <button
                @click="tab = 'launch'"
                :class="{ active: tab === 'launch' }"
              >
                launch
              </button>

              <button
                @click="tab = 'datalog'"
                :class="{ active: tab === 'datalog' }"
              >
                datalog
              </button>
              
              
            </div>
            <div class="tabs-content">
              <Demo v-if="tab === 'demo'" :api="api" :account="account" />
              <Launch v-if="tab === 'launch'" :api="api" :account="account" />
              <Datalog v-if="tab === 'datalog'" :api="api" :account="account" /> 
            </div>
          </div>
        </div>

      </template>
    </template>
  </div>
</div>

</template>

<script>
import Datalog from "./components/Datalog";
import Launch from "./components/Launch";
import Demo from "./components/Demo";
import { initApi, initAccount, getBalance, faucet } from "./utils/api";
import { formatBalance } from "@polkadot/util";

// generating avatar for Polkadot account
import Identicon from '@vue-polkadot/vue-identicon';

// svg code icons
import Icon from "./components/Icon";

// tabs for steps


export default {
  name: "App",
  components: {
    Datalog,
    Launch,
    Demo,
    Identicon,
    Icon
  },
  data() {
    return {
      load: false,
      api: null,
      account: null,
      balance: 0,
      error: null,
      tab: "demo"
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      try {
        this.load = true;
        this.api = await initApi();
        this.account = await initAccount();
        getBalance(this.account, balance => {
          this.balance = formatBalance(balance);
        });
        this.load = false;
      } catch (error) {
        this.error = error.message;
        this.load = false;
      }
    },
    faucet() {
      faucet(this.account);
    }
  },
  computed: {
    AccountAddress() {
      return this.account.slice(0, 6) + "..." + this.account.slice(-4);
    }
  }
};
</script>

<style lang="css">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
button {
  font-size: 14px;
  padding: 5px 12px;
}
button:hover {
  cursor: pointer;
}
input {
  font-size: 14px;
  padding: 5px;
}
select {
  font-size: 14px;
  padding: 5px;
}
button:focus,
input:focus {
  outline: none;
}
.error {
  color: rgb(151, 31, 31);
  font-weight: bold;
  text-align: center;
  margin: 10px 0;
}
/*.tabs button {
  font-size: 14px;
  padding: 10px 20px;
  font-weight: bold;
  background: #ececec;
  border: 1px solid #aaa;
}
.tabs button:hover {
  background: #bfbfbf;
}
.tabs button:last-child {
  border-left: none;
}
.tabs button.active {
  background: #ced5e2;
}*/


/* See new overwriting styles in `/src/assets/styles` folder */

</style>
