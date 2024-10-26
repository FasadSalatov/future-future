<script setup lang="ts">
defineProps<{
  clickPromo?: () => void;
  top?: number;
}>();

import axios from "axios";
import { useNuxtApp } from "nuxt/app";
import { ref } from "vue";
import { useUserStore } from "~/store/userStore";
import { BACK_URL } from "~/utils/api/apiConfig";

const { setUser } = useUserStore();
const isOpen = ref(false);
const promoCodeInput = ref("");
const user = toRef(useUserStore(), "user");

const { $telegramInitData } = useNuxtApp();
const isPromoCodeValid = ref<null | boolean>(null);

const id = $telegramInitData?.user?.id || '1052552985';
if (user.value?.presale_active) {
     navigateTo("/private");
     
  }
const togglePromoCode = () => {
     if (user.value?.presale_active) {
     navigateTo("/private");
     isPromoCodeValid.value = true;
  }

  isOpen.value = !isOpen.value;
};

const sendPromoCode = async () => {
  try {
    const response = await axios.post(`${BACK_URL}/privat/active`, {
      user_id: id,
      promo_code: promoCodeInput.value,
    });
    navigateTo("/start");
    refetchUser();
    isPromoCodeValid.value = true;
  } catch (e) {
    console.log(e);
    isPromoCodeValid.value = false;
  }
};

const refetchUser = async () => {
  const response = await axios.get(`${BACK_URL}/user/${id}`);
  setUser(response.data);
};
</script>

<template>
  <section
    class="promo-code"
    id="promo-code"
    :style="{ top: top ? `${top}px` : '' }"
  >
    <div class="promo-code-inner-type" :class="{ 'is-open': isOpen }">
      <p class="promo-code-inner-type-text">Введите код для входа</p>
      <div class="promo-code-inner-type-form">
        <input
          v-model="promoCodeInput"
          class="promo-code-inner-type-form-input"
          type="text"
          placeholder="Код"
          autocomplete="on"
          required
        />
        <button
          class="promo-code-inner-type-form-button"
          type="submit"
          @click="sendPromoCode"
        >
          <NuxtImg
            class="promo-code-inner-type-form-button-icon"
            src="/image/bin/submit.png"
          />
        </button>
      </div>
    </div>
    <div
      :class="[
        'promo-code-inner',
        { 'promo-code-inner-error': isPromoCodeValid === false },
      ]"
    >
      <div class="promo-code-inner-no-active">
        <button
          class="promo-code-inner-button"
          @click="
            () => {
              if (clickPromo) {
                clickPromo();
              } else {
                togglePromoCode();
              }
            }
          "
        >
          <template v-if="user.value?.presale_active">
            Pre-seed раунд
          </template>
          <template v-else>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M2.63604 15.364C6.15076 18.8787 11.8492 18.8787 15.364 15.364C18.8787 11.8493 18.8787 6.15077 15.364 2.63606C11.8492 -0.878663 6.15076 -0.878663 2.63604 2.63606C-0.87868 6.15077 -0.878679 11.8493 2.63604 15.364ZM9.01853 10.4134L12.121 13.5158L13.4984 12.1384L10.3959 9.03598L13.5343 5.89759L12.1024 4.46569L8.96404 7.60409L5.86161 4.50165L4.4842 5.87906L7.58663 8.98149L4.46568 12.1024L5.89757 13.5343L9.01853 10.4134Z" fill="#020817"/>
            </svg>
          </template>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped lang="sass">
.promo-code-inner-type-form-input
  padding: 0.2rem
.promo-code-inner-type-text
  font-family: Inter, sans-serif
  font-size: 1rem
  font-weight: bold
  text-wrap: nowrap
  margin-bottom: -0.5rem
  margin-right: -0.5rem
.promo-code-inner-type 
  position:relative
  background: white
  z-index: 101
  display: flex
  flex-direction: row
  align-items: center
  padding: 16px 32px 16px 16px
  gap: 12px
  display: flex
  flex-direction: column
  transition: width 0.3s ease, max-height 0.3s ease, opacity 0.3s ease
  max-height: 0
  opacity: 0
  width: 0
  overflow: hidden
  position: relative
  border: 2px solid #020817
  backdrop-filter: blur(2px)
  border-right: none
  border-radius: 24px 0px 0px 24px
  pointer-events: all
.promo-code
  position: absolute
  top: 0
  right: 0
  z-index: 1
  display: flex
  align-items: center
  height: 100vh
  
  justify-content: flex-end
  pointer-events: none

  &-inner
    padding: 3rem 0.3rem 3rem
    display: flex
    align-items: center
    gap: 0.2rem
    border-top-left-radius: 2rem
    border-bottom-left-radius: 2rem
    
    border-right-color: var(--color-transparent)
    pointer-events: all
    background: rgba(254, 214, 38, 1)

    &-error
      border-color: red

    &-no-active
      display: flex
      gap: 0.5rem

    &-button
      background-color: var(--color-transparent)
      display: flex
      justify-content: center
      align-items: center
      padding: 1rem 0 1rem 0.2rem
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
          margin-left: 33px
          position: relative
          color: black
          display: flex
          flex-direction: row
          justify-content: space-between
          align-items: center
          
          gap: 10px

          height: 24px

          background: rgba(107, 125, 148, 0.2)
          border-radius: 10px



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
