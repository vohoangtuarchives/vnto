<script>
import { ref } from "vue";
import PostService from "@/services/post.service";
export default {
  name: "PostItem",
  components: {},
  props: {
    item: {
      type: Object,
      default: function () {
        return {
          id: "",
          name: "",
          content: "",
          photo: "",
          type: "",
          user: "",
          created_at: "",
          updated_at: "",
        };
      },
    },
  },
  data() {
    return {
      data: {
        id: this.item.id,
        name: this.item.name,
        content: this.item.content,
        photo: this.item.photo,
        type: this.item.type,
        user: this.item.user,
        created_at: this.item.created_at,
        updated_at: this.item.updated_at,
      },
      errors_msg: [],
      success_msg: "",
      isLoading: false,
      conditions: {},
      dataFiles: ref([]),
      imageExtensions: ["jpg", "jpeg", "png", "gif"],
      fileExtensions: [
        { docx: "ri-file-word-line" },
        { pptx: "ri-file-pdf-2-line" },
        { excel: "ri-file-excel-line" },
        { zip: "ri-file-zip-line" },
        { zar: "ri-inbox-unarchive-fill" },
        { png: "ri-file-image-line" },
        { jpg: "ri-file-image-line" },
        { jpeg: "ri-file-image-line" },
        { gif: "ri-file-image-line" },
      ],
    };
  },
  watch: {
    item: {
      handler(item) {
        this.data = item;
      },
      immediate: true,
    },
  },
  setup() {},
  created() {},
  mounted() {
    this.getDataFiles(this.item.type, this.item.id);
  },
  beforeUpdate() {},
  updated() {},
  methods: {
    async getDataFiles(type, id) {
      this.conditions.type = type;
      this.conditions.id_post = id;
      try {
        const response = await PostService.getAllFile(this.conditions);
        if (response.data.data) {
          this.dataFiles = response.data.data;
        }
      } catch (error) {
        console.error(this.$t('xayraloi'), error);
      }
    },
    checkfile(nameFile) {
      const fileName = nameFile.toLowerCase();
      const fileExtension = fileName.split(".").pop();
      const docxExtension = this.fileExtensions.find(
        (extension) => fileExtension in extension
      );
      if (docxExtension) {
        return docxExtension[fileExtension];
      } else {
        return "ri-file-line";
      }
    },
    timeAgo(postedDate) {
      const now = new Date();
      const seconds = Math.floor((now - new Date(postedDate)) / 1000);
      const intervals = [
        { label: this.$t('nam'), seconds: 31536000 },
        { label: this.$t('thang'), seconds: 2592000 },
        { label: this.$t('tuan'), seconds: 604800 },
        { label: this.$t('ngay'), seconds: 86400 },
        { label: this.$t('gio'), seconds: 3600 },
        { label: this.$t('phut'), seconds: 60 },
        { label: this.$t('giay'), seconds: 1 },
      ];

      for (const interval of intervals) {
        const count = Math.floor(seconds / interval.seconds);
        if (count >= 1) {
          return `${count} ${interval.label} ${this.$t('truoc')}`;
        }
      }
      return this.$t('vuaxong');
    },
    extractLetters(str) {
      const words = str.split(" ");
      let firstLetter = "";
      let lastLetter = "";
      if (words.length > 0) {
        firstLetter = words[0].charAt(0);
      }
      if (words.length > 1) {
        lastLetter = words[words.length - 1].charAt(0);
      }
      return `${firstLetter}${lastLetter}`.toLowerCase();
    },
    shortenString(str, maxLength) {
      if (str.length <= maxLength) {
        return str; // Trả về chuỗi gốc nếu chiều dài không vượt quá maxLength
      } else {
        const firstPart = str.substring(0, maxLength - 3); // Lấy phần đầu của chuỗi, trừ đi 3 ký tự cuối cùng để làm chỗ cho dấu ba chấm '...'
        const lastPart = str.substring(str.length - 10); // Lấy 10 ký tự cuối của chuỗi
        return `${firstPart}...${lastPart}`; // Trả về chuỗi được rút gọn
      }
    },
  },
};
</script>

<template>
  <BCard no-body class="mb-3">
    <BCardBody class="item-post">
      <div class="d-flex align-items-center mb-2">
        <div class="avatar-user-post me-2">
          <span
            class="avatar-text rounded-circle w-40 h-40 bg-user-post text-center text-white line-height-40 fw-bold"
            >{{ this.data.user?extractLetters(this.data.user.name):extractLetters('Công ty') }}</span
          >
        </div>
        <div class="">
          <h4 class="item-name-post text-uppercase mb-1">
            {{ this.data.name }}
          </h4>
          <div class="">
            <div class="time-posted">
              {{ timeAgo(data.created_at) }}
            </div>
          </div>
        </div>
      </div>
      <div v-if="data.content" class="content-about-company mb-2">
        <p v-html="data.content"></p>
      </div>
      <div v-if="data.photo" class="mb-3">
        <img
          :src="this.imageLink(data.type + '/' + data.photo)"
          :alt="this.data.name"
          class="w-100"
        />
      </div>
      <div class="attachment" v-if="dataFiles.length > 0">
        <div class="mb-2">
          <i class="ri-attachment-line"></i> {{ this.$t("tepdinhkem") }}
        </div>
        <div class="d-flex align-items-center flex-wrap">
          <div v-for="(file, index) in dataFiles" :key="index" class="mr-2 mb-1">
            <div class="">
              <BLink
                class="d-flex align-items-center bg-light px-2 py-1 rounded"
                target="_blank"
                :href="this.imageLink(file.type_upload + '/' + file.name_file)"
                :title="file.name_file"
              >
                <div class="text-secondary">
                  <i :class="checkfile(file.name_file) + ' me-2 '"></i>
                </div>
                <div class="flex-grow-1 overflow-hidden text-secondary">
                  {{ shortenString(file.name_file, 15) }}
                </div>
              </BLink>
            </div>
          </div>
        </div>
      </div>
    </BCardBody>
  </BCard>
</template>
