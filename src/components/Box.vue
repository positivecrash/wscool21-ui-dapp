<template>
    <section class="box" :class="classList">
        <slot />
    </section>
</template>

<script>

export default {

  props: {
    classList: {
      type: String
    },
  },

};
</script>

<style>
    /*
    Global styles required for css variables from variables.css
    */

    .box {
        background-color: var(--color-light);
        border: 1px solid var(--color-dark);
        padding: calc(var(--space)*0.5) var(--space);
        box-shadow: 2px 2px 0 var(--color-dark);
        margin-bottom: calc(var(--space)*1.5);
    }
</style>