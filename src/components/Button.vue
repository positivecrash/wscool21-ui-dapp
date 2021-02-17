<template>
  <button type="button" :class="classList" @click="onClick" :disabled="disabled" class="inline-block">
    <template v-if="icon != 'none'">
      <Icon :icon="icon" />
      <span v-if="label != ''" class="inline-block">{{ label }}</span>
    </template>
    <template v-if="icon == 'none' & label != ''">
      {{ label }}
    </template>
  </button>
</template>

<script>

export default {

  components: {
    Icon: () => import("./Icon")
  },

  props: {
    label: {
      type: String,
    },
    type: {
      type: String,
      default: 'primary',
      validator: function (value) {
        return ['primary', 'secondary'].indexOf(value) !== -1;
      }
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: 'medium',
      validator: function (value) {
        return ['small', 'medium', 'large'].indexOf(value) !== -1;
      }
    },
    icon: {
      type: String,
      default: 'none'
    }
  },

  computed: {
    classList() {
      return {
        'button': true,
        [`${this.type}`]: true,
        [`button__${this.size}`]: true,
      };
    },
  },

  methods: {
    onClick() {
      this.$emit('onClick');
    },
  },

};
</script>

<style>
    /*
    Global styles required for css variables from variables.css
    */

    .button {
        appearance: none;
        -webkit-appearance: none;
        outline: 0;
        border: 0;

        transition: 0.1s all linear;

        padding: .15rem 0.6rem;
        border-width: 1px;
        border-style: solid;
        border-radius: .25rem;
  
        cursor: pointer;

        font-family: var(--font-family);
        font-size: calc(var(--font-size)*0.9);
        line-height: 1;
        font-weight: 500;

        text-transform: uppercase;
        letter-spacing: 1px;
    }   

    .button:not([disabled]):hover {
    filter: saturate(1.5);
    }

    .button[disabled] {
        cursor: default;
        opacity: 0.6;
    }

    button.primary {
        border-color: var(--color-green);
        background-color: var(--color-green);
        color: var(--color-light);
    }

    button.secondary {
        border-color: var(--color-blue);
        color: var(--color-blue);
    }

    button.secondary:not([disabled]):hover {
        background-color: var(--color-blue);
        color: var(--color-light);
    }

    .button__small {
        font-size: .85rem;
        padding: .1rem 0.45rem;
    }

    .button__large {
        font-size: 1.2rem;
        padding: .5rem 1.7rem;
    }

    .button .icon-fill path {
      fill: var(--color-light);
    }

    .button > *:not(:last-child) {
      margin-right: calc(var(--space)/2);
    }

</style>