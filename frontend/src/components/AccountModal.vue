<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import { GetHeaders } from "@/utils/GetHeaders";

const apiHost = import.meta.env.VITE_host;
const headers = GetHeaders();
const userID = JSON.parse(localStorage.getItem("userData")).id;

const props = defineProps({
  handleToggleAccount: {
    type: Function,
  },
});

const formData = ref({
  image: null,
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
        document.getElementById("imagePreview").src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  } else {
    formData.value[e.target.name] = e.target.value;
  }
};

const handleSubmit = async () => {
  const formDataToSend = new FormData();
  formDataToSend.append("image", formData.value.image);
  formDataToSend.append("fname", formData.value.fname);
  formDataToSend.append("lname", formData.value.lname);
  formDataToSend.append("username", formData.value.username);
  formDataToSend.append("password", formData.value.password);
  formDataToSend.append("password2", formData.value.password2);

  try {
    const response = await axios.put(
      `${apiHost}api/users/${userID}`,
      formDataToSend,
      { headers }
    );
    Swal.fire({
      icon: "success",
      title: "Success!",
      text: response.data.message,
      showConfirmButton: false,
      timer: 1300,
    }).then(() => {
      props.handleToggleAccount();
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error!",
      text: error.response.data.error,
    });
  }
};

const cancel = () => {
  // Handle cancel action (e.g., close the modal)
};

onMounted(async () => {
  try {
    const { data } = await axios.get(`${apiHost}api/users/${userID}`, {
      headers,
    });
    const { image, name, username } = data[0];
    const [fname, lname] = name.split(" ");

    formData.value = {
      image,
      fname,
      lname,
      username,
      password: "",
      password2: "",
    };
  } catch (error) {
    console.log(error.response);
  }
});
</script>
<template>
  <section
    class="fixed top-0 bottom-0 left-0 right-0 backdrop-blur-sm bg-backdrop z-50"
  >
    <div
      class="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen"
    >
      <div
        class="w-full bg-white rounded-lg shadow-xl md:mt-0 sm:max-w-md xl:p-0"
      >
        <div class="p-6 xl:space-y-4 sm:p-8">
          <h1
            class="text-2xl font-bold leading-tight tracking-tight text-gray-900 text-center"
          >
            Account <span class="text-primary">Settings</span>
          </h1>

          <form
            class="space-y-2 bg-white"
            name="form"
            @submit.prevent="handleSubmit"
          >
            <div
              class="relative mx-auto bg-primary w-[137px] h-[137px] flex items-center rounded-full"
            >
              <div
                class="w-32 h-32 bg-orange-100 rounded-full overflow-hidden border-4 border-white flex justify-center items-center mx-auto"
              >
                <img
                  :src="
                    formData.image
                      ? `${apiHost}uploads/${formData.image}`
                      : '/profile.png'
                  "
                  alt=""
                  id="imagePreview"
                />
              </div>
              <div>
                <label
                  htmlFor="imageInput"
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
                <label htmlFor="fname" class="label">First Name</label>
                <input
                  type="text"
                  id="fname"
                  name="fname"
                  v-model="formData.fname"
                  placeholder="Enter first name"
                  class="textInput sm:text-sm focus:ring-primary-hover focus:border-primary-hover"
                />
              </div>
              <div>
                <label htmlFor="lname" class="label">Last Name</label>
                <input
                  type="text"
                  id="lname"
                  name="lname"
                  v-model="formData.lname"
                  placeholder="Enter last name"
                  class="textInput sm:text-sm focus:ring-primary-hover focus:border-primary-hover"
                />
              </div>
            </div>
            <div>
              <label htmlFor="username" class="label">Change Username</label>
              <input
                type="text"
                id="username"
                name="username"
                v-model="formData.username"
                placeholder="Enter new username"
                class="textInput sm:text-sm focus:ring-primary-hover focus:border-primary-hover"
              />
            </div>
            <div>
              <label htmlFor="password" class="label">Change Password</label>
              <input
                type="password"
                id="password"
                name="password"
                v-model="formData.password"
                placeholder="Enter new password"
                class="textInput sm:text-sm focus:ring-primary-hover focus:border-primary-hover"
              />
            </div>
            <div>
              <label htmlFor="password2" class="label">Repeat Password</label>
              <input
                type="password"
                id="password2"
                name="password2"
                v-model="formData.password2"
                placeholder="Repeat password"
                class="textInput sm:text-sm focus:ring-primary-hover focus:border-primary-hover"
              />
            </div>
            <button
              type="submit"
              class="w-full text-white bg-primary hover:bg-primary-hover font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Update Account
            </button>
            <button
              type="button"
              class="w-full text-primary-hover border-2 border-primary hover:border-primary-hover font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              @click="handleToggleAccount"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
