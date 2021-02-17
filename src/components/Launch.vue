<template>
  <div>

    
    <div class="tools">
      <img class="launch-drone inline-block" alt="drone" src="../assets/images/drone.png" :class="[status ? 'on' : 'off']"/>

      <input v-model="robot" :disabled="isWrite" placeholder="Robot address" class="large inline-block"/>

      <div class="toggler inline-block">
        <input v-model="parameter" :disabled="isWrite" type="checkbox" id="robot-switch" />
        <label for="robot-switch"><span></span></label>
      </div>

      <Button label="Confirm" :disabled="isWrite" size="large" type="secondary" @onClick="launch" />
    </div>
    
    <div v-if="error" class="error">{{ error }}</div>

    <DatalogSection :log="log"/>

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
  components: {
    Button: () => import("./Button"),
    DatalogSection: () => import("./DatalogSection")
  },
  async created() {
    this.unsubscribe = await this.api.query.system.events(events => {
      events.forEach(record => {
        const { event } = record;

        if (event.section === "launch" && event.method === "NewLaunch") {
          const sender = event.data[0].toString();
          const robot = event.data[1].toString();
          const parameter = event.data[2].toHuman();
          this.log.push([new Date().toLocaleString(), {
            sender,
            robot,
            parameter
          }]);
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
          .launch(this.robot, this.parameter === "ON")
          .signAsync(this.account);

        await tx.send(result => {
          if (result.status.isInBlock) {
            this.isWrite = false;
            this.status = this.parameter;
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