<template>
  <div class="logo-animated" :style="{transform: 'scale('+scale+')'}">
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="196.9px" height="170.3px" viewBox="0 0 196.9 170.3" style="enable-background:new 0 0 196.9 170.3;" xml:space="preserve">
		<g transform="translate(2530 155)">
            <path class="line" d="M-2523.4,7.9l184.2,0.5l-91.7-158.1L-2523.4,7.9z"/>

            <circle class="dot" cx="-2339.7" cy="8.7" r="6.6"/>
            <circle class="dot" cx="-2523.4" cy="8.2" r="6.6"/>
            <circle class="dot" cx="-2430.8" cy="-148.4" r="6.6"/>
            
            <path class="triangle-1" d="M-2477.3-18.3l92.1,0.3l-45.8-79L-2477.3-18.3z"/>
            <path class="triangle-2" d="M-2431.2-18.1l46,0.1l-45.8-79L-2431.2-18.1z"/>
            <path class="triangle-3" d="M-2477.3-18.3l92.1,0.3l-46-20.3L-2477.3-18.3z"/>
          </g>
	</svg>
  </div>
</template>

<script>

export default {

  props: {
    scale: {
      type: String,
      default: '1'
    },
  },

};
</script>

<style scoped>
    /*
    Global styles required:
    FadeIn - keyframe animation from animation: .css
    all --color- variables from variables.css
    */

    .logo-animated {
        transform-origin: 0 0;
    }

    .logo-animated .dot {
        fill: var(--color-blue);
        visibility: hidden;
        opacity: 0;
        animation: 1s FadeIn 0.3s ease forwards;
    }

    .logo-animated .line {
        fill: transparent;
        stroke: var(--color-blue);
        stroke-miterlimit:10;
        stroke-dasharray: 700;
        stroke-dashoffset: 700;
        animation: 1s DrawSvgPath 0.5s ease-in-out forwards; 
    }

    .logo-animated .triangle-1 {
        fill: var(--color-blue);
        visibility: hidden;
        opacity: 0;
        animation: 0.5s FadeIn 0.3s ease forwards, 5s logo-triangle-1 0.1s linear infinite;
    }

    .triangle-2 {
        fill: var(--color-violet-light);
        visibility: hidden;
        opacity: 0;
        animation: 0.5s FadeIn 0.3s ease forwards, 5s logo-triangle-2 0.1s linear infinite;
    }

    .triangle-3 {
        fill: var(--color-violet-mid);
        visibility: hidden;
        opacity: 0;
        animation: 0.5s FadeIn 0.3s ease forwards, 5s logo-triangle-3 0.1s linear infinite;
    }


    @keyframes DrawSvgPath
        {
        to {
            stroke-dashoffset: 0;
        }
        }

    @keyframes logo-triangle-1
    {
        0% { fill: var(--color-blue); }
        25% { fill: var(--color-blue); }
        50% { fill: var(--color-blue); }
        75% { fill: var(--color-violet-light); }
        100% { fill: var(--color-blue); }
    }

    @keyframes logo-triangle-2
    {
        0% { fill: var(--color-violet-light); }
        25% { fill: #E0BDED; }
        50% { fill: var(--color-blue); }
        75% { fill: var(--color-blue); }
        100% { fill: var(--color-violet-light); }
    }

    @keyframes logo-triangle-3
    {
        0% { fill: var(--color-violet-mid); }
        25% { fill: var(--color-violet-light); }
        50% { fill: var(--color-violet-light); }
        75% { fill: var(--color-violet-dark); }
        100% { fill: var(--color-violet-mid); }
    }
</style>