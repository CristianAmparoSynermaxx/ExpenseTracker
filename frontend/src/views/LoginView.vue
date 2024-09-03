<script setup>
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";

const apiHost = import.meta.env.VITE_host;
const router = useRouter();
const errorMessage = ref("");
const successMessage = ref("");

const form = ref({
  username: "",
  password: "",
});

const handleSubmit = async () => {
  if (!form.value.username || !form.value.password) {
    errorMessage.value = "Please type username and password";
  } else {
    try {
      // Show loading spinner
      Swal.fire({
        text: "Please wait",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Perform login request
      const response = await axios.post(
        `${apiHost}api/users/login`,
        form.value
      );
      const { id, name, username, image } = response.data.user;
      const token = response.data.token;

      const userData = { id, name, username, image, token };
      localStorage.setItem("userData", JSON.stringify(userData));

      successMessage.value = "Login Successfully";
      errorMessage.value = "";

      Swal.fire({
        title: "Success!",
        text: "Login Successfully",
        icon: "success",
        showConfirmButton: false, // Hide the OK button
        timer: 1000,
      });
      router.push("/");
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.response.data.error || "An error occurred",
        icon: "error",
      });

      errorMessage.value = error.response.data.error || "An error occurred";
      successMessage.value = "";
    }
  }
};
</script>

<template>
  <section class="bg-gray-100">
    <div
      class="flex flex-col items-center -mt-40 justify-center px-6 mx-auto h-screen lg:py-0"
    >
      <div
        class="w-full bg-white rounded-lg shadow-xl md:mt-0 sm:max-w-md xl:p-0"
      >
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1
            class="text-2xl font-bold leading-tight tracking-tight text-gray-900 md:text-4xl text-center"
          >
            <span class="text-gray-600">Expense</span> Tracker
          </h1>
          <form @submit.prevent="handleSubmit" class="space-y-2 md:space-y-4">
            <div>
              <label for="username" class="label">Username</label>
              <input
                v-model="form.username"
                type="email"
                id="username"
                name="username"
                placeholder="Enter your email"
                class="textInput sm:text-sm focus:ring-primary-600 focus:border-primary-600"
              />
            </div>
            <div>
              <label for="password" class="label">Password</label>
              <input
                v-model="form.password"
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                class="textInput sm:text-sm focus:ring-primary-600 focus:border-primary-600"
              />
            </div>
            <div class="text-center w-full">
              <h1 v-if="successMessage">{{ successMessage }}</h1>
              <h1 v-if="errorMessage" class="text-red-600">
                {{ errorMessage }}
              </h1>
            </div>
            <button
              type="submit"
              class="w-full text-white bg-black hover:bg-gray-900 focus:ring-1 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Login
            </button>
            <p
              class="text-sm font-light text-gray-500 dark:text-gray-400 text-center"
            >
              Don’t have an account yet?
              <RouterLink
                to="/signup"
                class="font-medium hover:underline text-blue-600"
                >Register!</RouterLink
              >
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
