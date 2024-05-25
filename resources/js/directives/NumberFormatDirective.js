
export default {
  mounted(el) {
    el.addEventListener('keyup', () => {
      var num = el.value.replace(/[^0-9]/g, '');
      el.value = num.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1."); 
    });
  },
};

