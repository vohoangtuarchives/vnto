// src/stores/exam.js
import { defineStore } from 'pinia';

export const useExamStore = defineStore('exam', {
  // Khai báo state
  state: () => ({
    count: 0,
    message: 'Hello, Pinia!'
  }),

  // Khai báo getters
  getters: {
    doubleCount(state) {
      return state.count * 2;
    },
  },

  // Khai báo actions
  actions: {
    increment() {
      this.count++;
    },
    setMessage(newMessage) {
      this.message = newMessage;
    }
  }
});
