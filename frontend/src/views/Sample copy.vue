<script setup>
 
</script>

<template>
    <section class="h-screen overflow-auto">
    <div class=" max-w-[873px] h-[700px] font-Poppins flex flex-col md:flex-row  rounded-3xl mx-auto shadow">
        <div class="bg-[#F7F7F7] md:w-1/2 sm:w-full w-full h-full flex flex-col justify-center px-[30px] py-20">
            <h1 class=" font-semibold text-[22px] text-center mx-auto max-w-[399px] mb-[30px]">Invite your friends for <br><span class="text-orange-500">CLiQQ Points</span> referral bonus!</h1>
            <div class="h-[45px] w-full mb-5 rounded-[6px] bg-black flex overflow-hidden border border-[#008061] ">
                <input
                type="text"
                v-model="referralCode"
                class="w-2/3 text-center text-[18px]"
                placeholder="Cl!Qqk@dA-8073"
                />
                <button class="bg-[#008061] text-white w-1/3 h-full" @click="copyReferralCode">COPY</button>
            </div>
            <button class="bg-[#008061] h-[45px] w-full rounded-[6px] text-white mb-5">SHARE YOUR LINK</button>
            
             <!-- Social Media Share Buttons --> 
            <div class="flex gap-2 mb-[60px] w-full">
                <button class="w-1/3 rounded-[3px] text-sm h-[33px] bg-[#1877F2] text-white flex items-center justify-center gap-1 "><img class="size-[20px] -ml-2" src="/socials/facebook.png" alt="">Facebook</button>
                <button class="w-1/3 rounded-[3px] text-sm h-[33px] bg-[#0084FF] text-white flex items-center justify-center gap-1 "><img class="size-[20px] -ml-2" src="/socials/messenger.png" alt="">Messenger</button>
                <button class="w-1/3 rounded-[3px] text-sm h-[33px] bg-[#7D51A0] text-white flex items-center justify-center gap-1 "><img class="size-[20px] -ml-2" src="/socials/viber.png" alt="">Viber</button>
            </div>
            <!-- How Referral Works Section -->
            
                <div class="flex relative items-center justify-center w-full h-[170px] bg-white rounded-[13px] shadow">
                <h3 class="absolute z-10 font-semibold text-[16px] bg-[#F38220] text-white w-[225px] h-[35px] flex items-center justify-center -top-4 rounded-[5px] shadow">How referral works?</h3>
                    <div class="flex flex-col items-center  w-[90px]">
                    <img class="size-[50px]" src="/socials/step1.png" alt="Invite friends" />
                    <p class="text-[14px] text-[#393939] text-center">Invite friends</p>
                    </div>
                    <img class="size-[20px]" src="/socials/next.png" alt="">
                    <div class="flex flex-col items-center pt-[25px]  w-[90px]">
                    <img class="size-[50px]" src="/socials/step2.png" alt="Friends Registration" />
                    <p class="text-[14px] text-[#393939] text-center">Friends Registration</p>
                    </div>
                    <img class="size-[20px]" src="/socials/next.png" alt="">
                    <div class="flex flex-col items-center w-[90px]">
                    <img class="size-[50px]" src="/socials/step3.png" alt="Earn Rewards" />
                    <p class="text-[14px] text-[#393939] text-center">Earn Rewards</p>
                    </div>
                </div>
                
        </div>
        <div class="bg-white h-full min-h-[700px] relative md:w-1/2 w-full px-[50px]">
        <div class="pt-[110px]  text-[#333333] space-y-5 ">
        <div class="flex flex-col">
        <div class="flex gap-5 items-center -mb-2">
            <img class="size-[40px]" src="/socials/discountIcon.png" alt="">
            <h2 class="font-bold text-[16px] ">Your friend gets XX worth of discount and rebate.</h2>
        </div>
            <div class="flex flex-col w-[336px] pl-10 ">
            <ul class="font-medium text-[14px]  ">
                <li>70% OFF cart discount</li>
                <li>100 CLiQQ POINTS rebate</li>
            </ul>
        </div>
        </div>
        
        <div class="flex flex-col gap-5">
            <div class="flex gap-5 items-center -mb-[25px]">
                <img class="size-[40px]" src="/socials/star.png" alt="">
                <h2 class="font-bold text-[16px] ">You get 100 CLIQQ POINTS</h2>
            </div>
            <div class="flex flex-col w-[336px] pl-[60px] ">
                <p class="font-medium text-[14px]">once they place their first order <br>(min spend of P300)</p>
            </div>
        </div>
    </div>
    
                <img class="w-[330px] h-[300px] absolute bottom-0 right-0" src="/socials/gift.svg" alt="Earn Rewards" />
        
        </div> 
    </div>
    </section>
</template>

<style scoped>

.shadow {
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25) !important;
}
ul {
    list-style-type: disc; /* This ensures that the list items have dots */
    margin: 10px 0; /* Space between the list and heading */
    padding-left: 40px;
    /* Indent the list */
}
</style>