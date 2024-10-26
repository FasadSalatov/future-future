<script setup lang="ts">
import axios from "axios";
import { BACK_URL } from "~/utils/api/apiConfig";
import { useUserStore } from "~~/store/userStore";
import { defineProps, computed } from "vue";
import { ref, watch, toRef } from "vue";

const { user, setUser } = useUserStore();
const { $telegramInitData } = useNuxtApp();

const userBalance = toRef(useUserStore(), "user");
const balance = ref(user?.buy_coin || 0);
const props = defineProps<{ rank: string }>();

const avatarSrc = computed(() => {
  console.log("Current rank:", props.rank); // No need to access rank.rank
  if (props.rank === "Старт") {
    return "/image/start/1.mp4";
  } else if (props.rank === "Средний") {
    return "/image/start/2.mp4";
  } else if (props.rank === "Чемпион") {
    return "/image/start/3.mp4";
  }
  return "/image/start/1.mp4"; // default video
});




const counterAnimation = (nextBalance: number) => {
  let startBalance = balance.value;
  let interval = 100;

  const animation = () => {
    if (startBalance < nextBalance) {
      startBalance++;
      balance.value = startBalance;

      setTimeout(() => {
        requestAnimationFrame(animation);
      }, interval);
    }
  };
  animation();
};

watch(
  () => userBalance.value?.balance_coin,
  (newVal) => {
    newVal && counterAnimation(newVal);
  },
  { immediate: true }
);

try {
  const id = $telegramInitData?.user?.id;
  const response = await axios.get(`${BACK_URL}/user/${id}`);
  setUser(response.data);
  counterAnimation(response.data.balance_coin);
} catch (e) {}
</script>

<template>
  <section class="balance" id="balance">
    <div class="imgcont">
      <video
        class="avaimg"
        :src="avatarSrc"
        autoplay
        muted
        loop
        playsinline
      ></video>
    </div>
    <div class="balance-inner">
      <div class="balance-inner-container">
        <NuxtImg
          class="balance-inner-container-coin"
          src="/image/bin/coin.png"
        />
        <span class="balance-inner-container-text">{{ balance }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped lang="sass">
.imgcont
  display: flex
  flex-direction: row
  align-items: center
  padding: 10px
  gap: 12px
  justify-content: center
  width: 45vw
  height: 20vh
  background: rgba(255, 255, 255, 0.6)
  border: 2px solid #020817
  backdrop-filter: blur(2px)
  border-radius: 12px

.avaimg 
  height: 110%
  border-radius: 15px !important
  

.balance-inner-container-text
  display: flex
  align-items: center
  justify-content: center

.balance
  position: relative
  z-index: 100
  background-color: var(--color-transparent)
  height: auto
  width: 90vw
  display: flex
  align-items: flex-end
  justify-content: space-between
  margin-bottom: 15px
  margin-left: 5vw

  &-inner
    &-container
      padding: 0.2rem 0.35rem 0.2rem 0.35rem
      background-color: var(--color-white-60)
      border-radius: 2rem
      width: 140px
      display: flex
      margin: 0 auto
      justify-content: center
      align-items: center
      gap: 0.5rem
      border: 0.15em solid var(--color-black)

      &-coin
        width: 36px
        height: 36px
      &-text
        font-size: 32px
        font-weight: bolder
        font-family: 'Montserrat', sans-serif
        color: var(--color-white)
        margin-bottom: -3px
        text-shadow: 2px 2px 0 var(--color-black), -2px -2px 0 var(--color-black), 2px -2px 0 var(--color-black), -2px 2px 0 var(--color-black)
</style>
