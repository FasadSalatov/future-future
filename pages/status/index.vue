
<script setup lang="ts">
import axios from "axios";
import { onMounted, onUnmounted, ref, toRef } from "vue";
import { useUserStore } from "~/store/userStore";
import type { ITask } from "~/types/type";
import { BACK_URL } from "~/utils/api/apiConfig";
import CommonTonbar from './components/common/tonBar.vue';
const user = toRef(useUserStore(), "user");
const isCapcha = toRef(useUserStore(), "isCapcha");
const { setIsCapcha } = useUserStore();

// const isCapcha = ref(false);
const { $telegramInitData } = useNuxtApp();

const backgroundImages = [
  {
    src: "image/start/gt12.jpg",
    id: 0,
  },
  {
    src: "image/start/gt11.jpg",
    id: 1,
  },
  {
    src: "image/start/gt10.jpg",
    id: 2,
  },
  {
    src: "image/start/gt9.jpg",
    id: 3,
  },
  {
    src: "image/start/gt8.jpg",
    id: 4,
  },
  {
    src: "image/start/gt7.jpg",
    id: 5,
  },
  {
    src: "image/start/gt6.jpg",
    id: 6,
  },
  {
    src: "image/start/gt5.jpg",
    id: 7,
  },
  {
    src: "image/start/gt4.jpg",
    id: 8,
  },
  {
    src: "image/start/gt3.jpg",
    id: 9,
  },
  {
    src: "image/start/gt2.jpg",
    id: 10,
  },
  {
    src: "image/start/gt1.jpg",
    id: 11,
  },
    {
    src: "image/start/gt12.jpg",
    id: 11,
  },
];


const currentBackgroundImage = ref(0);
let animationFrameId: number | null = null;

function preloadImages(imageUrls: string[]) {
  imageUrls.forEach((url) => {
    const img = new Image();
    img.src = url;
  });
}

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

const id = $telegramInitData?.user?.id;
const { data, refresh } = useAsyncData<ITask[]>("fetchTasks", async () => {
  const response = await axios.get(`${BACK_URL}/task/${id}`);

  // console.log(response.data);
  return response.data;
});

const checkCapcha = async () => {
  await refresh();

  // isCapcha.value = true;
  console.log(data.value?.some((task) => task.id == 0));
  if (
    data.value &&
    data.value?.length >= 1 &&
    data.value?.some((task) => task.id == 0)
  ) {
    setIsCapcha(true);
  }
};

const naviagateToPrivate = () => {
  console.log("private");
  navigateTo("/private");
};

onMounted(() => {
  // preloadImages(backgroundImages);
  checkCapcha();
  cycleBackgroundImages();
});

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
});
</script>

<template>
  <div>
    <CommonHeader />
    <div class="statt">
        <div class="stat-cont">
        <h1 class="h1stat">СТАТУСЫ</h1>
        <div class="stat-info">
            <div class="statton">
                <v class="status">Статус</v>
                <v class="tonn">5 TON</v>
            </div>
            <p class="opis">Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание </p>
        </div>
                <div class="stat-info">
            <div class="statton">
                <v class="status">Статус</v>
                <v class="tonn">5 TON</v>
            </div>
            <p class="opis">Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание </p>
        </div>
                <div class="stat-info">
            <div class="statton">
                <v class="status">Статус</v>
                <v class="tonn">5 TON</v>
            </div>
            <p class="opis">Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание Описание </p>
        </div>
        
        

    </div>
    
    </div>
    <NuxtImg src="image/start/gt12.jpg" class="background background-active" />
    <NuxtImg
      :key="img.id"
      v-for="img in backgroundImages"
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
.h1stat

    font-family: 'Montserrat'
    font-style: normal
    font-weight: 600
    padding: 10px
    width: 100%
    text-align: left
    font-size: 28px
    line-height: 28px


    color: #020817

.opis 
    margin-top: 15px
    width: 95%
    border-top: 1px solid black
    border-bottom: 1px solid black
    margin-bottom: 15px
    padding: 15px 0 15px 0

.tonn 


    font-family: 'Montserrat'
    font-style: normal
    font-weight: 600
    font-size: 20px
    line-height: 24px

    color: #1A82FF


.status 

    font-family: 'Montserrat'
    ont-style: normal
    font-weight: 500
    font-size: 20px
    line-height: 24px

    color: #020817

.statt 
    margin-top: 1%
    width: 100vw
    display: flex
    justify-content: center
.statton
    display: flex
    width: 95%
    justify-content: space-between
    
.stat-cont
    position: relative
    z-index: 100
    background: rgba(255, 255, 255, 0.8)
    width: 90vw
    border-radius: 15px
.stat-info 
    display: flex
    flex-direction: column
    align-items: center

.background
  width: 100%
  height: 100vh
  background-size: cover
  background-position: center
  position: absolute
  top: 0
  transition: background 1s ease-in-out
  display: none

.background-active
  display: block
</style>
