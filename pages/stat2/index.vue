<script setup lang="ts">
import axios from "axios";
import { onMounted, onUnmounted, ref, toRef } from "vue";
import { useUserStore } from "~/store/userStore";
import type { ITask } from "~/types/type";
import { BACK_URL } from "~/utils/api/apiConfig";


const user = toRef(useUserStore(), "user");
const isCapcha = toRef(useUserStore(), "isCapcha");
const { setIsCapcha } = useUserStore();
const { $telegramInitData } = useNuxtApp();

// Переменные для данных из API
const x100cost = ref(0);  

// ID пользователя
const id = $telegramInitData?.user?.id;

// Массив изображений фона
const backgroundImages = [
  { src: "image/start/gt12.jpg", id: 0 },
  { src: "image/start/gt11.jpg", id: 1 },
  { src: "image/start/gt10.jpg", id: 2 },
  { src: "image/start/gt9.jpg", id: 3 },
  { src: "image/start/gt8.jpg", id: 4 },
  { src: "image/start/gt7.jpg", id: 5 },
  { src: "image/start/gt6.jpg", id: 6 },
  { src: "image/start/gt5.jpg", id: 7 },
  { src: "image/start/gt4.jpg", id: 8 },
  { src: "image/start/gt3.jpg", id: 9 },
  { src: "image/start/gt2.jpg", id: 10 },
  { src: "image/start/gt1.jpg", id: 11 },
];

const currentBackgroundImage = ref(0);
let animationFrameId: number | null = null;

// Функция для циклической смены фонов
function cycleBackgroundImages() {
  let imageIndex = 0;
  const updateBackground = () => {
    currentBackgroundImage.value = backgroundImages[imageIndex].id;
    imageIndex = (imageIndex + 1) % backgroundImages.length;
    setTimeout(() => {
      animationFrameId = requestAnimationFrame(updateBackground);
    }, 100);
  };
  updateBackground();
}

// Загрузка данных об оплате из API
const loadPaymentSettings = async () => {
  try {
    const response = await axios.get("https://test.futurum-app.site/api/payment/setting");
    x100cost.value = response.data.x100cost;
  } catch (error) {
    console.error("Ошибка загрузки настроек оплаты:", error);
  }
};

// Загрузка задач
const { data, refresh } = useAsyncData<ITask[]>("fetchTasks", async () => {
  const response = await axios.get(`${BACK_URL}/task/${id}`);
  return response.data;
});

// Проверка капчи
const checkCapcha = async () => {
  await refresh();
  if (data.value?.some((task) => task.id == 0)) {
    setIsCapcha(true);
  }
};

// Навигация на приватную страницу
const naviagateToPrivate = () => {
  navigateTo("/private");
};

// Инициализация функций при монтировании компонента
onMounted(async () => {
  await loadPaymentSettings();
  checkCapcha();
  cycleBackgroundImages();
});

// Очистка при размонтировании компонента
onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
});
</script>

<template>
  <div>
    <CommonHeader />
    <CommonTonBar />
    
    <!-- Активный фон и фоновая анимация -->
    <NuxtImg src="image/start/gt12.jpg" class="background background-active" />
    <NuxtImg
      v-for="img in backgroundImages"
      :key="img.id"
      :src="img.src"
      class="background"
      :class="{ 'background-active': currentBackgroundImage === img.id }"
      preload
    />
    
    <IndexLeave />
    <CommonNavBarPrivat2 />
  </div>
</template>

<style scoped lang="sass">
.background
  width: 100%
  height: 100vh
  background-size: cover
  background-position: center
  position: absolute
  top: 0
  transition: opacity 1s ease-in-out
  opacity: 0
  display: none

.background-active
  opacity: 1
  display: block
</style>
