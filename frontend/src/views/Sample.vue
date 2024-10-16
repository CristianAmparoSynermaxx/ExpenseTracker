<template>
    <section class="invite-section">
      <div class="invite-container">
        <div class="invite-left">
          <h1 class="invite-title">Invite your friends for <br><span class="invite-bonus">CLiQQ Points</span> referral bonus!</h1>
          <div class="invite-code-container">
            <input type="text" readonly v-model="referralCode" class="invite-input" placeholder="Cl!Qqk@dA-8073" />
            <button class="invite-copy-button" @click="copyReferralCode">COPY</button>
          </div>
          <button class="invite-share-button">SHARE YOUR LINK</button>
  
          <!-- Social Media Share Buttons -->
          <div class="social-buttons">
            <button class="social-button facebook"><img class="social-icon" src="/socials/facebook.png" alt="">Facebook</button>
            <button class="social-button messenger"><img class="social-icon" src="/socials/messenger.png" alt="">Messenger</button>
            <button class="social-button viber"><img class="social-icon" src="/socials/viber.png" alt="">Viber</button>
          </div>
  
          <!-- How Referral Works Section -->
          <div class="how-referral-works">
            <h3 class="referral-title">How referral works?</h3>
            <div class="referral-steps">
              <div class="step">
                <img class="step-icon" src="/socials/step1.png" alt="Invite friends" />
                <p class="step-text">Invite friends</p>
              </div>
              <img class="next-icon" src="/socials/next.png" alt="">
              <div class="step">
                <img class="step-icon" src="/socials/step2.png" alt="Friends Registration" />
                <p class="step-text">Friends Registration</p>
              </div>
              <img class="next-icon" src="/socials/next.png" alt="">
              <div class="step">
                <img class="step-icon" src="/socials/step3.png" alt="Earn Rewards" />
                <p class="step-text">Earn Rewards</p>
              </div>
            </div>
          </div>
        </div>
  
        <div class="invite-right">
          <div class="right-content">
            <div class="offer-section">
              <div class="rewards-section-up">
              <img class="offer-icon" src="/socials/discountIcon.png" alt="">
              <h2 class="offer-title">Your friend gets XX worth of <br>discount and rebate.</h2>
              </div>
              <ul class="offer-details">
                <li>70% OFF cart discount</li>
                <li>100 CLiQQ POINTS rebate</li>
              </ul>
            </div>
  
            <div class="rewards-section">
            <div class="rewards-section-up">
              <img class="reward-icon" src="/socials/star.png" alt="">
              <h2 class="reward-title">You get 100 CLIQQ POINTS</h2>
            </div>
              <p class="reward-details">once they place their first order <br>(min spend of P300)</p>
            </div>
          </div>
          <img class="gift-image" src="/socials/gift.svg" alt="Earn Rewards" />
        </div>
      </div>
    
    </section>
    <section v-if="copiedModal" class="copied-modal-container "> <!-- add @click="close" to close when click outside the modal -->
      <div class="copied-modal-content">
        <h1 class="copied-title">COPIED</h1>
        <p class="copied-message">
          Thank you for your referral. You will receive 100 CLiQQ Points once they place their first order
        </p>
        <button class="copied-button" @click="close">Okay</button>
        <button class="close-button" @click="close">
          <img src="/socials/close.svg" alt="close icon">
        </button>
      </div>
    </section>


  </template>
  
  <script>
  export default {
    data() {
      return {
        referralCode: "Cl!Qqk@dA-8073",
        copiedModal: false,
      };
    },
    methods: {
      copyReferralCode() {
        navigator.clipboard.writeText(this.referralCode);
        this.copiedModal = true;
      },
      close(){
        this.copiedModal = false
      }
    },
  };
  </script>
  
  <style scoped>
  /* Base Styles */
  .copied-modal-container {
  position: fixed;
  inset: 0;
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.5);
  z-index: 10;
}

.copied-modal-content {
  position: relative;
  max-width: 480px;
  width: 100%;
  padding-top: 20px;
  padding-bottom: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border: 1px solid #e5e5e5;
  background-color: white;
  border-radius: 20px;
  z-index: 10;
}

.copied-title {
  color: #008061;
  font-family: 'Poppins', sans-serif;
  font-size: 22px;
  font-weight: bold;
}

.copied-message {
  text-align: center;
  font-size: 16px;
  max-width: 350px;
  padding-bottom: 20px;
}

.copied-button {
  padding: 4px 70px;
  background-color: #008061;
  color: white;
  font-size: 14px;
  font-weight: bold;
  border: none;
  border-radius: 6px;
}

.copied-button:hover {
  background-color: #03775a;
}

.close-button {
  position: absolute;
  top: 8px;
  right: 8px;
  border: 2px solid #9E9E9E;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  background: none;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  scale: 105%;
}



  .invite-section {
    height: 100vh;
    overflow: auto;
    display: flex;
    justify-content: center;

 margin-bottom: 200px;
  }
  
  .invite-container {
    max-width: 873px;
    height: 700px;
    display: flex;
    flex-direction: column;
    background-color: #f7f7f7;
    border-radius: 20px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    overflow: hidden;
  }
  
  .invite-left {
    flex: 1;
    padding: 50px 30px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    
  }
  
  /* Invite Section Left */
  .invite-title {
    font-size: 22px;
    font-weight: 600;
    text-align: center;
    margin-bottom: 30px;
  }
  
  .invite-bonus {
    color: #ff6d00;
  }
  
  .invite-code-container {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    border-radius: 7px;
    border: 1px solid #008061;
  }
  
  .invite-input {
    flex: 2;
    text-align: center;
    font-size: 18px;
    padding: 10px;
    border-radius: 6px 0px 0px 6px;
    outline: none;
    box-shadow: none;
  }
  
  .invite-copy-button {
    flex: 1;
    background-color: #008061;
    color: white;
    border: none;
    padding: 10px;
    cursor: pointer;
    border-radius: 0px 6px 6px 0px;
    height: 100%;
  }
  
  .invite-share-button {
    background-color: #008061;
    color: white;
    padding: 10px;
    border-radius: 6px;
    margin-bottom: 20px;
    cursor: pointer;
  }
  
  .social-buttons {
    display: flex;
    gap: 10px;
    margin-bottom: 80px;
    
  }
  
  .social-button {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    border-radius: 3px;
    font-size: 14px;
    padding: 2px;
  }

  .social-icon{
    height: 20px;
    width: 20px;
  }
  
  .facebook {
    background-color: #1877f2;
  }
  
  .messenger {
    background-color: #0084ff;
  }
  
  .viber {
    background-color: #7d51a0;
  }

  
  
  /* How Referral Works */
  .how-referral-works {
    background-color: white;
    border-radius: 13px;
    padding: 20px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    position: relative;
    text-align: center;
  }
  
  .referral-title {
    background-color: #f38220;
    color: white;
    padding: 5px;
    border-radius: 5px;
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    width: 225px;
  }
  
  .referral-steps {
    display: flex;
    justify-content: space-around;
    margin-top: 40px;
  }
  
  .step {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .step-icon {
    width: 50px;
  }
  
  .step-text {
    font-size: 14px;
    color: #393939;
  }
  
  .next-icon {
    width: 20px;
    align-self: center;
  }
  
  /* Invite Section Right */
  .invite-right {
    background-color: white;
    position: relative;
  }
  
  .right-content {
    height: 700px !important;
    padding: 100px 50px;
  }
  
  .offer-section,
  .rewards-section {
    margin-bottom: 20px;
  }
  
  .offer-icon,
  .reward-icon {
    width: 40px;
  }
  
  .offer-title,
  .reward-title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
  }
  
  .offer-details,
  .reward-details {
    font-size: 14px;
    color: #333;
  }

  .rewards-section-up {
    display: flex;
    gap: 20px;
    align-items: center;
  }
  
  .gift-image {
    width: 330px;
    position: absolute;
    bottom: 0;
    right: 0;
  }
  
  /* Responsive Design */
  @media (min-width: 768px) {
    .invite-container {
      flex-direction: row;
    }
    .invite-left,
  .invite-right {
    min-width: 50%;
  }
  }
  
  @media (max-width: 767px) {
    .invite-container {
      flex-direction: column;
      height: min-content;
  }
  
  .invite-left,
  .invite-right {
    min-height: 700px;
    width: 100%;
  }
  
  .invite-code-container {
    border-radius: 7px;
  }

  .invite-copy-button {
  
    height: 47px;
  }
  }

  </style>
  