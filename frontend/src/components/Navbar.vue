<script setup>
import { useRouter, useRoute, RouterLink } from "vue-router";
import AccountModal from "./AccountModal.vue";
import { ref } from "vue";
import Swal from "sweetalert2";

const router = useRouter();
const route = useRoute();

const logout = async () => {
  // Show confirmation dialog
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You will be logged out of your account.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, log out!",
    cancelButtonText: "Cancel",
  });

  if (result.isConfirmed) {
    localStorage.removeItem("userData");
    router.push("/login");
    await Swal.fire({
      title: "Logged out!",
      text: "You have been logged out successfully.",
      icon: "success",
      showConfirmButton: false, // Corrected syntax
      timer: 1000, // Optionally add a timer to auto-close the success message
    });
  }
};

const isAccountModalOpen = ref(false);

const toggleAccountModal = () => {
  isAccountModalOpen.value = !isAccountModalOpen.value;
  console.log(isAccountModalOpen);
};

// Utility function to check if the link is active
const isActive = (path) => route.path === path;
</script>

<template>
  <header
    class="fixed top-0 z-50 left-0 right-0 flex items-center justify-between h-20 w-full px-12 shadow-md bg-white"
  >
    <RouterLink to="/">
      <div class="font-semibold lg:text-2xl md:text-xl text-lg">
        Expense Tracker
      </div>
    </RouterLink>
    <nav class="flex items-center">
      <input type="checkbox" id="sidebar-active" class="opacity-0" />
      <label htmlFor="sidebar-active" class="cursor-pointer lg:hidden">
        <img class="w-10" src="/menu.svg" alt="" />
      </label>
      <nav class="lg:flex hidden w-max items-center justify-center gap-12">
        <RouterLink to="/expenses">
          <ul :class="{ 'active-link': isActive('/expenses') }">
            <img src="/Money.png" alt="" />
            <h3>Expenses</h3>
          </ul>
        </RouterLink>
        <RouterLink to="/history">
          <ul :class="{ 'active-link': isActive('/history') }">
            <img src="/File.png" alt="" />
            <h3>Balance History</h3>
          </ul>
        </RouterLink>

        <ul @click="toggleAccountModal">
          <img src="/User.png" alt="" />
          <h3>Account</h3>
        </ul>

        <RouterLink to="/login">
          <ul @click="logout" :class="{ 'active-link': isActive('/login') }">
            <img src="/Exit.png" alt="" />
            <h3>Logout</h3>
          </ul>
        </RouterLink>
      </nav>
      <label id="overlay" htmlFor="sidebar-active"></label>
      <aside class="sidebar-container w-96 bg-white fixed top-0 bottom-0 p-5">
        <label htmlFor="sidebar-active" class="cursor-pointer bg-white">
          <img class="w-10" src="/close.svg" alt="" />
        </label>
        <nav>
          <div
            class="flex flex-col w-full items-center justify-center gap-12 p-5"
          >
            <RouterLink to="/expenses">
              <ul :class="{ 'active-link': isActive('/expenses') }">
                <img src="/Money.png" alt="" />
                <h3>Expenses</h3>
              </ul>
            </RouterLink>
            <RouterLink to="/history">
              <ul :class="{ 'active-link': isActive('/history') }">
                <img src="/File.png" alt="" />
                <h3>Balance History</h3>
              </ul>
            </RouterLink>

            <ul @click="toggleAccountModal">
              <img src="/User.png" alt="" />
              <h3>Account</h3>
            </ul>

            <RouterLink to="/login">
              <ul
                @click="logout"
                :class="{ 'active-link': isActive('/login') }"
              >
                <img src="/Exit.png" alt="" />
                <h3>Logout</h3>
              </ul>
            </RouterLink>
          </div>
        </nav>
      </aside>
    </nav>
  </header>
  <AccountModal
    v-if="isAccountModalOpen"
    :toggleAccountModal="toggleAccountModal"
  />
</template>

<style scoped>
ul {
  @apply flex text-lg font-semibold items-center gap-1.5 cursor-pointer hover:border-b-2 border-black;
}

ul img {
  width: 20px;
  height: 20px;
}

.sidebar-container {
  @apply -right-96 transition-all ease-out duration-300 lg:hidden;
  box-shadow: -8px 0 15px -5px rgba(0, 0, 0, 0.3);
}
#sidebar-active:checked ~ .sidebar-container {
  @apply right-0;
}

#sidebar-active:checked ~ #overlay {
  @apply lg:hidden backdrop-blur-sm bg-gray-100/10 fixed top-0 left-0 right-0 bottom-0;
}

.active-link {
  @apply border-b-2 border-black; /* Example active link styling */
}
</style>
