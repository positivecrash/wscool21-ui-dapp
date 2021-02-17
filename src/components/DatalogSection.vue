<template>
    <div v-if="log" class="log">
        <h4 class="log-title">Datalog</h4>

        <div class="log-content">

          <p v-if="log.length === 0" class="error">Not found</p>

          <details v-for="(item, k) in log" :key="k" class="box" :open="k === 0">
              <summary>{{ item[0] }}</summary>
              <pre>{{ item[1] }}</pre>
          </details>
        </div>
    </div>
</template>

<script>

export default {

  props: {
    log: {
      type: Array
    }
  },

}

</script>

<style>

.log {
  text-align: left;
  margin: var(--space) auto;
  width: 100%;
}

.log-content {
  border: 1px solid var(--color-gray);
  max-height: 500px;
  overflow-y: auto;
  padding: var(--space);
  background-color: var(--color-gray-middark);
  outline: 1px solid #fff;
  box-shadow: 0 0 60px 20px #fff inset;
}

.log-title {
  color: var(--color-gray-dark);
  font-weight: 300;
  font-family: var(--font-family-code);

  border-bottom: 1px solid var(--color-gray);
}

.log .box {
  margin-bottom: var(--space);
}

details {
  transition: 0.2s all ease;
}

details summary {
  cursor: pointer;
}

details.box {
  padding-top: 0;
  padding-bottom: 0;
}

details.box[open] {
  padding-bottom: calc(var(--space)*0.5);
}

details.box:focus {
  box-shadow: 0 0 5px var(--color-gray)
}

details.box summary {
  padding-top: calc(var(--space)*0.5);
  padding-bottom: calc(var(--space)*0.5);
}

details.box[open] summary {
  border-bottom: 1px solid var(--color-dark);
  margin-bottom: calc(var(--space)*0.5);
  font-weight: 500;
}

.log details.box summary {
  font-family: var(--font-family-code);
}

</style>