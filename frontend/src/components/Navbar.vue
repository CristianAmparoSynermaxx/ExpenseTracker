<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
const logout = () => {
  localStorage.removeItem("userData");
  router.push("/login");
};
</script>

<template>
  <header
    class="fixed top-0 z-10 left-0 right-0 flex items-center justify-between h-20 w-full px-12 shadow-md"
  >
    <div class="font-semibold text-2xl">Expense Tracker</div>
    <nav class="flex items-center">
      <input type="checkbox" id="sidebar-active" className="opacity-0" />
      <label htmlFor="sidebar-active" className="cursor-pointer lg:hidden">
        <img class="w-10" src="/menu.svg" alt="" />
      </label>
      <div class="lg:flex hidden w-max items-center justify-center gap-12">
        <ul>
          <img src="/Money.png" alt="" />
          <h3>Expenses</h3>
        </ul>
        <ul>
          <img src="/File.png" alt="" />
          <h3>Balance History</h3>
        </ul>
        <ul>
          <img src="/User.png" alt="" />
          <h3>Account</h3>
        </ul>
        <ul @click="logout">
          <img src="/Exit.png" alt="" />
          <h3>Logout</h3>
        </ul>
      </div>
      <label id="overlay" htmlFor="sidebar-active"></label>
      <aside
        className="sidebar-container w-96 bg-white fixed top-0 bottom-0  p-5 "
      >
        <label htmlFor="sidebar-active" className="cursor-pointer bg-white">
          <img class="w-10" src="/close.svg" alt="" />
        </label>
        <nav>
          <div
            class="flex flex-col w-full items-center justify-center gap-12 p-5"
          >
            <ul>
              <img src="/Money.png" alt="" />
              <h3>Expenses</h3>
            </ul>
            <ul>
              <img src="/File.png" alt="" />
              <h3>Balance History</h3>
            </ul>
            <ul>
              <img src="/User.png" alt="" />
              <h3>Account</h3>
            </ul>
            <ul @click="logout">
              <img src="/Exit.png" alt="" />
              <h3>Logout</h3>
            </ul>
          </div>
        </nav>
      </aside>
    </nav>
  </header>
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
</style>
