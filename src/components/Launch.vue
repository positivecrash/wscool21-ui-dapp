<template>
  <div>
    <div class="tools">
      <img class="launch-drone inline-block" alt="drone" src="../assets/images/drone.png" :class="[status ? 'on' : 'off']"/>

      <input v-model="robot" :disabled="isWrite" placeholder="Robot address" class="large inline-block"/>

      <div class="toggler inline-block">
        <input v-model="parameter" :disabled="isWrite" type="checkbox" checked id="robot-switch" />
        <label for="robot-switch"><span></span></label>
      </div>

      <button @click="launch" :disabled="isWrite" class="secondary button__large inline-block">Confirm</button>
    </div>

    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="log.length > 0" class="log">
      <h4 class="log-title">Datalog</h4>

      <div class="log-content">
        <div v-for="(item, k) in log" :key="k" class="box">
          sender: <b>{{ item.sender }}</b>
          <br />
          robot: <b>{{ item.robot }}</b>
          <br />
          parameter: <b>{{ item.parameter ? true : false }}</b>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["api", "account"],
  data() {
    return {
      robot: this.account,
      parameter: false,
      log: [],
      isWrite: false,
      error: "",
      unsubscribe: null,
      status: false
    };
  },
  async created() {
    this.unsubscribe = await this.api.query.system.events(events => {
      events.forEach(record => {
        const { event } = record;
        if (event.section === "launch" && event.method === "NewLaunch") {
          const sender = event.data[0].toString();
          const robot = event.data[1].toString();
          const parameter = event.data[2].toHuman();
          this.log.push({
            sender,
            robot,
            parameter
          });
          if (this.robot === robot) {
            this.status = parameter
          }
        }
      });
    });
  },
  destroyed() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  },
  methods: {
    async launch() {
      try {
        this.error = "";
        this.isWrite = true;

        const tx = await this.api.tx.launch
          .launch(this.robot, this.parameter === true)
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
}
.log .row {
  margin: 10px;
}*/

.tools {
  position: relative;
  padding-left: 120px;
  text-align: left;
  display: inline-block;
}

.launch-drone {
  position: absolute;
  width: 100px;
  left: 0;
  filter: grayscale(1);
  transition: 1s all ease-in;
}

.launch-drone.on {
  filter: grayscale(0);
  animation: DroneLaunch 10s linear infinite;
}

@keyframes DroneLaunch {
  0%, 20%, 40%, 60%, 80%, 100% {
    transform: translateY(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateY(-20%);
  }
}
</style>
