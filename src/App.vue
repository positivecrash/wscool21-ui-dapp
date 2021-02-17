<template>
  <div id="app">

    <div class="top">
        <h1>dApp Robonomics Demo</h1>
        <i>Winter School 2021</i>
        <img class="label" alt="" src="./assets/images/robonomics-winter-school-2021-logo.png"/>
    </div>


    <div class="content" :class="{ load: load }">

      <Loader v-if="load" />

      <template v-else>
        <div v-if="error" class="error">{{ error }}</div>
        <template v-else-if="api && account">

          <div class="layout">
            <Box :classList="'account'">
              
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

              <Button label="Faucet" size="large" icon="faucet" @onClick="faucet" />

            </Box>

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

export default {
  name: "App",
  components: {
    Datalog,
    Launch,
    Demo,
    Loader: () => import("./components/AnimatedRobonomicsLogo"),
    Box: () => import("./components/Box"),
    Button: () => import("./components/Button"),
    Identicon: () => import("@vue-polkadot/vue-identicon"),
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
