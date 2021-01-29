<template>
  <div>
    <template v-if="robot">

      <div class="demo" :class="[robot.state ? 'play' : 'stop']">
        <div class="demo-back-1"></div>
        <div class="demo-back-2"></div>
        <div class="demo-city-1"></div>
        <div class="demo-car"></div>

        <div class="demo-data">
          <div class="demo-data-driver inline-block">
            <img alt="Driver's avatar" src="../assets/images/cabman.png" v-if="robot.state"/>
          </div>
          <div class="demo-data-lines inline-block">
            <div class="demo-data-line">
                <div>Robot</div>
                <div>[ {{ addressShort(robot.address) }} ]</div>
            </div>

            <div class="demo-data-line" v-if="robot.state">
                <div>Passenger</div>
                <div>[ {{ addressShort(robot.driver) }} ]</div>
            </div>

            <div class="demo-data-welcome" v-if="robot.state">
                <span>Hello, passenger. </span>
                <span>I've linked to the vehicle. </span>
                <span>Your ride begins, congrats! </span>
            </div>
          </div>

        </div>

        <button @click="run" :disabled="isWrite" class="primary button__large">
            <template v-if="!robot.state">run</template>
            <template v-else>stop</template>
        </button>
      </div>

      <div v-if="error" class="error">{{ error }}</div>


      <div v-if="log" class="log">
        <h4 class="log-title">Datalog</h4>

        <div class="log-content">

          <p v-if="log.length === 0" class="error">Not found</p>

          <details v-for="(item, k) in log" :key="k" class="box" :open="k === 0">
              <summary>{{ item[0] | dateFormat }}</summary>
              <pre>{{ item[1] | dataFormat }}</pre>
          </details>
        </div>
    </div>


    </template>
  </div>
</template>

<script>
import { u8aToString } from "@polkadot/util";
import Robot from "../utils/robot";

export default {
  props: ["api", "account"],
  data() {
    return {
      isWrite: false,
      error: "",
      robot: null,
      log: []
    };
  },
  filters: {
    dateFormat: function(v) {
      return new Date(Number(v)).toLocaleString();
    },
    dataFormat: function(v) {
      return JSON.parse(u8aToString(v));
    }
  },
  async created() {
    this.robot = new Robot("//Alice", this.api);
    await this.robot.subscribeLog(r => {
      this.log = r.reverse().map(item => {
        return [item[0], item[1]];
      });
    });
  },
  destroyed() {
    this.robot.destroy();
  },
  methods: {
    async run() {
      try {
        this.error = "";
        this.isWrite = true;

        const tx = await this.api.tx.launch
          .launch(this.robot.account.address, !this.robot.state)
          .signAsync(this.account);

        await tx.send(result => {
          if (result.status.isInBlock) {
            this.isWrite = false;
          }
        });
      } catch (error) {
        this.error = error.message;
        this.isWrite = false;
      }
    },

    addressShort(address) {
      return address.slice(0, 6) + "..." + address.slice(-4);
    }
  }
};
</script>

<style scoped>
/*.log {
  border: 1px solid #eee;
  text-align: left;
  width: 800px;
  margin: 20px auto;
  height: 500px;
  overflow-y: auto;
}
.log .row {
  margin: 10px;
  border-bottom: 1px solid #eee;
}

.road {
  width: 1000px;
  margin: 20px auto;
  background-color: #eee;
  padding: 20px 0;
  border: 5px solid #a5a5a5;
  border-left: 0;
  border-right: 0;
  position: relative;
}
.road::before {
  content: " ";
  width: 1000px;
  border-top: 5px dashed #a5a5a5;
  position: absolute;
  top: 50%;
  left: 0;
}
@keyframes move {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100%);
  }
}
.robot {
  height: 100px;
  width: 100px;
  color: #fff;
  font-weight: bold;
  font-style: 14px;
  animation: move 30s linear infinite;
  border-radius: 0 10px 10px 0;
  background: url("../assets/car.png") no-repeat 0 0;
  background-size: cover;
}
.robot-play {
  animation-play-state: running;
}
.robot-stop {
  animation-play-state: paused;
}*/
</style>
