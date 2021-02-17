<template>
  <div>

    <div class="tools">
      <fieldset>
        <Button label="Read data" size="large" type="secondary" @onClick="read" />
      </fieldset>

      <fieldset>
        <input v-model="data" :disabled="isWrite" class="large" />
        <Button label="Write" :disabled="isWrite" size="large" type="secondary" @onClick="write" />
      </fieldset>
    </div>

    <div v-if="error" class="error">{{ error }}</div>
    
    <DatalogSection :log="log"/>

  </div>
</template>

<script>

import { u8aToString, stringToHex } from "@polkadot/util";

export default {
  props: ["api", "account"],
  data() {
    return {
      data: "data string",
      log: null,
      isWrite: false,
      error: ""
    };
  },

  components: {
    Button: () => import("./Button"),
    DatalogSection: () => import("./DatalogSection")
  },
  
  methods: {
    async read() {
      this.log = (await this.api.query.datalog.datalog(this.account)).toArray().map((item) => {
        return [new Date(Number(item[0])).toLocaleString(), u8aToString(item[1])]
      });
    },
    async write() {
      try {
        this.error = "";
        this.isWrite = true;

        const tx = await this.api.tx.datalog
          .record(stringToHex(this.data))
          .signAsync(this.account);

        await tx.send(result => {
          if (result.status.isInBlock) {
            this.read();
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
