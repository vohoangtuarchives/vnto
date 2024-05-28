<template>
    <div class="profile-user position-relative d-inline-block mx-auto">
      <div class="avatar-wrap">
        <i v-if="!selectedImage" class="ri-user-line"></i>
        <img v-else :src="selectedImage" class="rounded-circle avatar-xl img-thumbnail user-profile-image" alt="user-profile-image">
      </div>
      <div class="avatar-xs p-0 rounded-circle profile-photo-edit">
        <input @change="handleFileChange" type="file" id="handleFileChange" class="profile-img-file-input">
        <label for="handleFileChange" class="profile-photo-edit avatar-xs">
          <span class="avatar-title rounded-circle bg-light text-body">
            <i class="ri-camera-fill"></i>
          </span>
        </label>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      modelValue: {}
    },
    data() {
      return {
        selectedImage: null
      };
    },
    methods: {
      handleFileChange(event) {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            this.selectedImage = reader.result;
            // Update v-model của component cha
            this.$emit('update:modelValue', reader.result);
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .user-profile-image {
    position: absolute;
    top:0;
    left:0;
    width: 100%;
    height: 100%;
  }
  </style>
  