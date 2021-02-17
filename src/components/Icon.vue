<template>
  <div class="icon inline-block" :class="classList">
    <svg v-if="icon == 'faucet'" class="icon-fill" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" :width="SvgWidth(20)"  viewBox="0 0 20 24.9" style="enable-background:new 0 0 20 24.9;" xml:space="preserve">
      <path d="M2.7,24.9c0.2,0,2.4,0,2.4-2.4c0-2-2.2-5.2-2.2-5.2s-2.5,3.3-2.5,5.3C0.4,24.6,2.4,24.9,2.7,24.9z M20,10.8V7.2V3.1h-2.6v2.6h-3.1V1.5h2.6c0.4,0,0.8-0.3,0.8-0.8S17.3,0,16.9,0h-6.7C9.8,0,9.5,0.3,9.5,0.8s0.3,0.8,0.8,0.8h2.6v4.1H7.9c-4.7,0-6.2,3.2-6.3,4.8c0,0,0,0.1,0,0.1v2.8H0v2.1h6.2v-2.1H4.6v-2.7c0-0.3,0.4-1.9,3.3-1.9h9.6v2.1L20,10.8L20,10.8z"/>
    </svg>

  </div>
</template>

<script>

export default {
  props: {
    icon: {
      type: String
    },
    classList: {
      type: String
    },
    scale: {
      type: String,
      default: '1'
    },
  },

  methods: {
    SvgWidth(SvgWidth) {
      return `${SvgWidth * this.scale}px`;
    }
  }
};
</script>

<style>
.icon {
    line-height: 1;
}
</style>
