<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import Swal from "sweetalert2";

const router = useRouter();
const apiHost = import.meta.env.VITE_host;

const successMessage = ref("");
const errorMessage = ref("");
const imagePreview = ref("/profile.png");
const formData = ref({
  image: "",
  fname: "",
  lname: "",
  username: "",
  password: "",
  password2: "",
});

const handleChange = (e) => {
  if (e.target.name === "image") {
    const file = e.target.files[0];
    formData.value.image = file;

    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        imagePreview.value = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  } else {
    formData.value[e.target.name] = e.target.value;
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();

  const formDataToSend = new FormData();
  formDataToSend.append("fname", formData.value.fname);
  formDataToSend.append("lname", formData.value.lname);
  formDataToSend.append("image", formData.value.image);
  formDataToSend.append("username", formData.value.username);
  formDataToSend.append("password", formData.value.password);
  formDataToSend.append("password2", formData.value.password2);

  let loadingSwal;

  try {
    // Show loading spinner
    loadingSwal = Swal.fire({
      title: "Processing...",
      text: "Please wait",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    // Perform form submission
    const response = await axios.post(`${apiHost}api/users/`, formDataToSend);

    successMessage.value = response.data.message;
    errorMessage.value = "";

    // Clear form data
    formData.value = {
      image: "",
      fname: "",
      lname: "",
      username: "",
      password: "",
      password2: "",
    };
    imagePreview.value = "/profile.png";

    // Close loading spinner and show success message
    loadingSwal.close();
    Swal.fire({
      title: "Success!",
      text: response.data.message,
      icon: "success",
    });

    // Navigate to login page after a short delay
    setTimeout(() => {
      router.push("/login");
    }, 1200);
  } catch (error) {
    Swal.fire({
      title: "Error!",
      text: error.response.data.error || "An error occurred",
      icon: "error",
    });

    errorMessage.value = error.response.data.error || "An error occurred";
    successMessage.value = "";
  }
};
</script>

<template>
  <section class="bg-gray-100">
    <div
      class="flex flex-col items-center justify-center -mt-40 px-6 py-8 mx-auto h-screen lg:py-0"
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

          <form class="space-y-2 md:space-y-4" @submit.prevent="handleSubmit">
            <div
              class="relative mx-auto bg-black w-[137px] h-[137px] flex items-center rounded-full"
            >
              <div
                class="w-32 h-32 bg-gray-100 rounded-full overflow-hidden border-4 border-white flex justify-center items-center mx-auto"
              >
                <div>
                  <img id="imagePreview" :src="imagePreview" alt="" />
                </div>
              </div>
              <div class="">
                <label
                  for="imageInput"
                  class="absolute bottom-1 right-0 rounded-full w-10 h-10 bg-slate-600 hover:bg-slate-700 p-2 text-white cursor-pointer flex justify-center items-center"
                >
                  <img
                    class="w-5 h-5 object-center"
                    src="/editProfile.png"
                    alt=""
                  />
                  <span class="sr-only">Choose an image to upload</span>
                </label>
                <input
                  type="file"
                  name="image"
                  id="imageInput"
                  class="hidden h-full w-full cursor-pointer"
                  accept=".png, .jpg, .jpeg"
                  @change="handleChange"
                />
              </div>
            </div>
            <div class="flex w-full justify-between gap-2">
              <div>
                <label for="fname" class="label">First Name</label>
                <input
                  type="text"
                  id="fname"
                  name="fname"
                  v-model="formData.fname"
                  placeholder="Enter first name"
                  class="textInput sm:text-sm"
                />
              </div>
              <div>
                <label for="lname" class="label">Last Name</label>
                <input
                  type="text"
                  id="lname"
                  name="lname"
                  v-model="formData.lname"
                  placeholder="Enter last name"
                  class="textInput sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label for="username" class="label">Username</label>
              <input
                type="email"
                id="username"
                name="username"
                v-model="formData.username"
                placeholder="Enter username"
                class="textInput sm:text-sm"
              />
            </div>
            <div>
              <label for="password" class="label">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                v-model="formData.password"
                placeholder="Enter your password"
                class="textInput sm:text-sm"
              />
            </div>
            <div>
              <label for="password2" class="label">Repeat-Password</label>
              <input
                type="password"
                id="password2"
                name="password2"
                v-model="formData.password2"
                placeholder="Repeat password"
                class="textInput sm:text-sm"
              />
            </div>
            <div class="text-center w-full">
              <h1 v-if="successMessage" class="text-green-700">
                {{ successMessage }}
              </h1>
              <h1 v-if="errorMessage" class="text-red-700">
                {{ errorMessage }}
              </h1>
            </div>
            <button
              type="submit"
              class="w-full text-white bg-black hover:bg-gray-900 focus:ring-1 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Register
            </button>
            <p
              class="text-sm font-light text-gray-500 dark:text-gray-400 text-center"
            >
              Already have an account?
              <RouterLink
                to="/login"
                class="font-medium hover:underline text-blue-600"
                >Login!</RouterLink
              >
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
