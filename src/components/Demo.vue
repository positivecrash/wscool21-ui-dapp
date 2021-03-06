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

        <Button :label="robot.state ? 'stop' : 'run'" :disabled="isWrite" size="large" @onClick="run" />

      </div>


      <div v-if="error" class="error">{{ error }}</div>

      <DatalogSection :log="log"/>
      
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

  components: {
    Button: () => import("./Button"),
    DatalogSection: () => import("./DatalogSection")
  },

  async created() {
    this.robot = new Robot("//Alice", this.api);
    await this.robot.subscribeLog(r => {
      this.log = r.reverse().map(item => {
        return [new Date(Number(item[0])).toLocaleString(), JSON.parse(u8aToString(item[1]))];
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
.demo {
    --h: 120px;
    --color-yellow: #F2F209;

    background-color: #AFCCD3;

    background: linear-gradient(#010123, #4baac7);

    position: relative;
    height: 500px;
    overflow: hidden;

    border-width: 2px 2px 2px 15px;
    border-style: solid;
    border-color: var(--color-yellow);
    
}

.demo:before {
    content: '[ Delamain cabs rental DEMO ]';
    background-color: var(--color-yellow);
    color: #000;

    position: absolute;
    top: 0;
    left: 0;
    padding: .5rem 1rem;

    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 300;

    border-width: 0 6px 2px 0;
    border-style: solid;
    border-color: #7B186E;
}

div[class^=demo-back-], div[class^=demo-city-] {
    position: absolute;
    left: 0;
    width: 100%;
    z-index: 2;
}

div[class^=demo-back-]{
    border-top: 1px solid #364444;
}

div[class^=demo-city-] {
    background-repeat: repeat-x;
    background-size: cover;
    background-position: 100% 0;

    height: 300px;
    bottom: var(--h);

    animation: 50s MoveCity infinite linear 1.5s;
}

div.demo-back-1 {
    background-color: #060236;
    background: linear-gradient(#7B186E, #060236);
    height: var(--h);
    bottom: 0;
}

div.demo-back-2 {
    background-color: #c515ae;
    border-width: 2px 0;
    border-style: solid;
    border-color: #69045c;

    height: 20px;
    bottom: var(--h);
    z-index: 10;
}

div.demo-city-1 {
    background-image: url(../assets/images/city-1.png);
}

.demo-car {
    background-image: url(../assets/images/car.png);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: 100% 0;

    width: calc(508px * 0.5);
    height: calc(257px * 0.5);
    position: absolute;
    bottom: calc(var(--h) + 4px);
    z-index: 10;

    transform: translateX(-100px);
    animation: MoveCar 50s infinite 1.5s linear;
}

.demo.play div[class^=demo-city-], .demo.play .demo-car { animation-play-state: running; }
.demo.stop div[class^=demo-city-], .demo.stop .demo-car { animation-play-state: paused; }

.demo.play .demo-car {
    background-image: url(../assets/images/car-ride.png);
}


.demo button {
    background-color: var(--color-yellow);
    border-color: var(--color-yellow);
    color: #000;

    position: absolute;
    bottom: 30px;
    right: 30px;
    z-index: 1000;
}

.demo-data {
    position: absolute;
    bottom: 30px;
    left: 30px;
    z-index: 1000;

    background-color: rgba(0, 0, 0, .5);
    color: #fff;
    padding: .5rem;
    font-family: var(--font-family-code);

    transition: 0.2s all ease;
}

.demo-data-lines {
    max-width: 400px;
}

.demo-data-line {
    display: grid;
    grid-template-columns: 100px auto;
    gap: .5rem;
    text-align: left;
}

.demo-data-line div:first-child {
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 700;
}

.demo-data-driver {
    margin-right: 1rem;
}

.demo-data-driver img {
    display: block;
    max-width: 100px;

    visibility: hidden;
    opacity: 0;
    animation: FadeInBlink .3s cubic-bezier(0.075, 0.82, 0.165, 1) 0.6s forwards;
}

.demo-data-welcome {
    text-align: left;
    padding-top: .5rem;
}

.demo-data-welcome span {
    visibility: hidden;
    opacity: 0;

    animation-name: FadeIn;
    animation-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
    animation-duration: 0.6s;
    animation-fill-mode: forwards;
}

.demo-data-welcome span:nth-child(1) { animation-delay: 1.5s; }
.demo-data-welcome span:nth-child(2) { animation-delay: 2.5s; }
.demo-data-welcome span:nth-child(3) { animation-delay: 3.2s; }


@keyframes MoveCity
{
  100% {
    background-position: -1000px 0;
  }
}

@keyframes MoveCar
{
    0% {
        transform: translateX(-100px);
    }
    100% {
        transform: translateX(960px);
    }
}
</style>
