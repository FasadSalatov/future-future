<script setup lang="ts">
import { ref, computed, onMounted, toRef, watch } from "vue";
import axios from "axios";
import { BACK_URL } from "~/utils/api/apiConfig";
import { useUserStore } from "~~/store/userStore";
const { user, setUser } = useUserStore();
const { $telegramInitData } = useNuxtApp();
const userBalance = toRef(useUserStore(), "user");
const balance = ref(user?.buy_coin || 0);
const tonAmount = ref(3);
const conversionRate = ref(2);
const convertedAmount = computed(() => balance.value / conversionRate.value);
const progress = ref(30);

const buyTokens = async () => {
  const userId = $telegramInitData?.user?.id;
  if (!userId) {
    console.error("User ID not available");
    return;
  }

  try {
    const response = await axios.post("https://test.futurum-app.site/api/payment/create-order", {
      user_id: userId,
      ton: tonAmount.value,
    });

    const paymentUrl = response.data.paymentUrl;
    if (paymentUrl) {
      window.location.href = paymentUrl;
    } else {
      console.error("Payment URL not received in response:", response.data);
    }
  } catch (error) {
    console.error("Error processing payment:", error);
  }
};

// Animation function for the balance counter
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

// Watch for balance changes and trigger animation
watch(
  () => userBalance.value?.balance_coin,
  (newVal) => {
    newVal && counterAnimation(newVal);
  },
  { immediate: true }
);

// Fetch data and update variables on component mount
const fetchPaymentSettings = async () => {
  try {
    const response = await axios.get("https://test.futurum-app.site/api/payment/setting");
    const data = response.data;
    conversionRate.value = data.x100cost;
  } catch (error) {
    console.error("Error fetching payment settings:", error);
  }
};

onMounted(async () => {
  fetchPaymentSettings();

  try {
    const id = $telegramInitData?.user?.id;
    const response = await axios.get(`${BACK_URL}/user/${id}`);
    setUser(response.data);
    counterAnimation(response.data.balance_coin);
  } catch (e) {
    console.error("Error fetching user data:", e);
  }
});

const rank = computed(() => {
  if (convertedAmount.value < 20) return "Старт";
  if (convertedAmount.value >= 20 && convertedAmount.value < 50) return "Средний";
  return "Чемпион";
});

const calculatedProgress = computed(() => {
  return Math.min((convertedAmount.value / 100) * 100, 100); // Capped at 100%
});

</script>

<template>
<CommonBalance2 :rank={rank} />
  <section class="ton-purchase-container">
    <div class="center">
<div class="status-bar">
  <div class="status-text">
    <span class="status-tier">
      Ранг: <v class="status-rank">{{ rank }}</v>
    </span>
    <span class="status-progress">ещё <v class="nvn">{{ convertedAmount }} TON</v></span>
  </div>
  <div class="progress-bar">
    <div class="progress" :style="{ width: calculatedProgress + '%' }"></div>
  </div>
</div>

   

      <div class="ton-input-container">
        <div class="ton-input">
        <svg width="30" height="31" viewBox="0 0 30 31" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_302_2269)">
            <path d="M15 30.5C23.2843 30.5 30 23.7843 30 15.5C30 7.21571 23.2843 0.5 15 0.5C6.71571 0.5 0 7.21571 0 15.5C0 23.7843 6.71571 30.5 15 30.5Z" fill="#0098EA"/>
            <path d="M20.1218 8.87207H9.87799C7.99453 8.87207 6.80074 10.9038 7.74831 12.5462L14.0704 23.5041C14.4829 24.2196 15.5168 24.2196 15.9294 23.5041L22.2527 12.5462C23.199 10.9064 22.0052 8.87207 20.123 8.87207H20.1218ZM14.0652 20.218L12.6884 17.5533L9.36622 11.6116C9.14706 11.2312 9.41776 10.7439 9.87671 10.7439H14.064V20.2193L14.0652 20.218ZM20.631 11.6103L17.3101 17.5546L15.9332 20.218V10.7426H20.1205C20.5794 10.7426 20.8501 11.23 20.631 11.6103Z" fill="white"/>
          </g>
          <defs>
            <clipPath id="clip0_302_2269">
              <rect width="30" height="30" fill="white" transform="translate(0 0.5)"/>
            </clipPath>
          </defs>
        </svg>
          <p class="ppp">TON:</p>
          <input type="number" v-model="tonAmount.value" min="1" class="ton-amount" placeholder="Кол-во" />
        </div>
        <div class="conversion-info">
        <span>1</span>
          <svg width="25" height="25" viewBox="0 0 30 31" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_302_2269)">
            <path d="M15 30.5C23.2843 30.5 30 23.7843 30 15.5C30 7.21571 23.2843 0.5 15 0.5C6.71571 0.5 0 7.21571 0 15.5C0 23.7843 6.71571 30.5 15 30.5Z" fill="#0098EA"/>
            <path d="M20.1218 8.87207H9.87799C7.99453 8.87207 6.80074 10.9038 7.74831 12.5462L14.0704 23.5041C14.4829 24.2196 15.5168 24.2196 15.9294 23.5041L22.2527 12.5462C23.199 10.9064 22.0052 8.87207 20.123 8.87207H20.1218ZM14.0652 20.218L12.6884 17.5533L9.36622 11.6116C9.14706 11.2312 9.41776 10.7439 9.87671 10.7439H14.064V20.2193L14.0652 20.218ZM20.631 11.6103L17.3101 17.5546L15.9332 20.218V10.7426H20.1205C20.5794 10.7426 20.8501 11.23 20.631 11.6103Z" fill="white"/>
          </g>
          <defs>
            <clipPath id="clip0_302_2269">
              <rect width="30" height="30" fill="white" transform="translate(0 0.5)"/>
            </clipPath>
          </defs>
        </svg>
          <span>=</span>
          
          <span>{{ conversionRate }}</span>
          <svg width="25" height="25" viewBox="0 0 28 29" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="14" cy="14.5" r="14" fill="black"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M9.99171 18.2259H8.07763C7.78026 17.7883 7.48123 17.3519 7.18353 16.9147C7.50758 16.4405 7.83108 15.9659 8.15424 15.4911C8.77622 16.4024 9.39786 17.314 10.0191 18.2259H9.9916H9.99171ZM5.41925 18.2259H3.48535C5.01615 15.9813 6.55292 13.7397 8.07763 11.4912C8.72474 11.4924 9.37206 11.4915 10.0192 11.4912C8.48992 13.7371 6.95768 15.981 5.42689 18.2259H5.41925ZM5.48235 14.4197L3.48535 11.4912C4.13257 11.4915 4.77967 11.4912 5.42689 11.4912C5.77297 11.9987 6.11916 12.5061 6.46502 13.0137C6.14241 13.4889 5.81792 13.9628 5.49431 14.4373L5.48235 14.4197Z" fill="url(#paint0_linear_302_2350)"/>
          <path d="M13.3594 11.6814V16.7259H14.5697V18.2259H10.5684V16.7259H11.7788V14.1107H10.5684V12.6108H11.7788V11.4912H13.3594V11.6814Z" fill="white"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M14.8838 11.4912H19.3537V18.2259H14.8838V11.4912ZM16.5555 13.1749H17.6819V16.5423H16.5555V13.1749Z" fill="white"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M19.667 11.4912H24.137V18.2259H19.667V11.4912ZM21.3387 13.1749H22.4651V16.5423H21.3387V13.1749Z" fill="white"/>
          <defs>
            <linearGradient id="paint0_linear_302_2350" x1="4.32924" y1="14.0367" x2="9.51282" y2="13.9735" gradientUnits="userSpaceOnUse">
              <stop stop-color="#099AE8"/>
              <stop offset="0.585" stop-color="#3CBEE0"/>
              <stop offset="1" stop-color="#61D8DB"/>
            </linearGradient>
          </defs>
        </svg>
        </div>
      </div>

      <button class="buy-button" @click="buyTokens">
        КУПИТЬ
      </button>
    </div>
  </section>
</template>


<style scoped lang="sass">
.conversion-info 
  height: 50px
  gap: 5px !important
  width: 35vw !important
.ppp 
  font-family: 'Montserrat'
  font-style: normal
  font-weight: 600
  font-size: 16px
  line-height: 20px
  text-align: center
  display: flex
  align-content: center
  align-items: center
  margin: 5px
  color: #020817

.ton-purchase-container
  display: flex
  flex-direction: column
  align-items: center
  background-color: transparent
  border-radius: 10px
  padding: 20px
  width: 100vw
  font-family: 'Inter', sans-serif
  position: relative
  z-index: 1

.center
  display: flex
  flex-direction: column
  align-items: center
  justify-content: space-between
  border-radius: 10px
  width: 90vw
  font-family: 'Inter', sans-serif
  position: relative
  z-index: 10

.status-bar
  width: 100%
  margin-bottom: 20px
  background: black
  color: white
  padding: 15px
  border-radius: 16px

.status-text
  display: flex
  justify-content: space-between
  margin-bottom: 5px
  font-size: 14px
  color: white

.status-tier
  font-family: 'Montserrat'
  font-style: normal
  font-weight: 600
  font-size: 18px
  line-height: 22px
  color: #B1B7C4

.nvn 
  font-family: 'Montserrat'
  font-style: normal
  font-weight: 600
  font-size: 16px
  line-height: 110%
  color: #FFFFFF

.status-rank
  font-family: 'Montserrat'
  font-style: normal
  font-weight: 600
  font-size: 18px
  line-height: 22px
  color: #1A82FF

.progress-bar
  width: 100%
  background-color: #d3d3d3
  height: 10px
  border-radius: 5px

.progress
  background-color: #00c2ff
  height: 100%
  border-radius: 5px

.ton-input-container
  display: flex
  align-items: center
  margin-bottom: 20px
  gap: 3%

.ton-input
  display: flex
  align-items: center
  border: 2px solid black
  background: white
  border-radius: 12px
  padding: 5px 10px
  margin-right: 10px

.ton-amount
  border: none
  width: 50px
  text-align: center
  color: black
  background: rgba(107, 125, 148, 0.2)
  border-radius: 10px
  font-family: 'Montserrat'
  font-style: normal
  font-weight: 600
  font-size: 14px
  line-height: 17px
  text-align: center
  padding: 5px
  width: 75px
  margin: 5px

.conversion-info
  display: flex
  align-items: center
  border: 2px solid black
  background: rgba(255, 255, 255, 0.6)
  border-radius: 12px
  padding: 5px 10px
  margin-right: 10px
  padding: 7px
  gap: 2px

.conversion-info span
  font-family: 'Montserrat'
  font-style: normal
  font-weight: 600
  font-size: 20px
  line-height: 20px
  color: white
  -webkit-text-stroke: 1px #000
  text-shadow: 0px 4px 8px rgba(255, 255, 255, 0.1)

.buy-button
  background-color: #007bff
  color: white
  padding: 10px 20px
  border: none
  border-radius: 8px
  cursor: pointer
  width: 90vw
  font-family: 'Montserrat'
  font-style: normal
  font-weight: 700
  font-size: 20px
  line-height: 20px
  border-radius: 16px

.buy-button:hover
  background-color: #0056b3
</style>
