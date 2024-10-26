<script setup lang="ts">
defineProps<{
  clickPromo?: () => void;
  top?: number;
}>();

import { useRouter } from "vue-router";

const router = useRouter();

const navigateHome = () => {
  router.push("/");
};
</script>


<template>
  <section
    class="promo-code"
    id="promo-code"
    :style="{ top: top ? `${top}px` : '' }"
  >
    <div class="promo-code-inner">
      <div class="promo-code-inner-no-active">
        <button
          class="promo-code-inner-button"
          @click="navigateHome"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 19 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="0.5"
              y="0.5"
              width="18"
              height="18"
              rx="9"
              fill="#020817"
            />
            <path
              d="M11 13.5L7 9.5L11 5.5"
              stroke="#FED626"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  </section>
</template>


<style scoped lang="sass">
.promo-code
  position: absolute
  top: 0
  right: 0
  z-index: 1
  display: flex
  align-items: center
  height: 30vh
  justify-content: flex-end
  pointer-events: none

  &-inner
    padding: 1.5rem 0.4rem 1.5rem 0.5rem
    background-color: #FED626
    display: flex
    align-items: center
    gap: 0.5rem
    border-top-left-radius: 1.5rem
    border-bottom-left-radius: 1.5rem
    
    border-right-color: var(--color-transparent)
    pointer-events: all

    &-error
      border-color: red

    &-no-active
      display: flex
      gap: 0.5rem

    &-button
      background-color: var(--color-black)
      display: flex
      justify-content: center
      align-items: center
      padding: 0.2rem
      border-radius: 50%
      cursor: pointer

      &-icon
        width: 1.9rem
        height: 1.9rem

    &-type
      display: flex
      flex-direction: column
      transition: width 0.3s ease, max-height 0.3s ease, opacity 0.3s ease
      max-height: 0
      opacity: 0
      width: 0
      overflow: hidden
      position: relative

      &.is-open
        display: flex
        width: 200px
        max-height: 500px
        opacity: 1

        &-text
          font-family: Inter, sans-serif
          font-weight: bold
          text-wrap: nowrap
          margin-bottom: 0.2rem

      &-form
        background-color: var(--color-white-60)
        border-radius: 1em
        overflow: hidden
        display: flex
        justify-content: center
        padding: 0 0.4rem

        &-input
          outline: none
          background-color: transparent
          margin-left: 33px
          position: relative
          color: black

        &-button
          outline: none
          background-color: var(--color-transparent)
          padding: 0.3rem
          position: absolute
          right: 0
          cursor: pointer

          &-icon
            width: 0.9rem
            height: 0.9rem
</style>
