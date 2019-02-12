import Vue from "vue";
import appVue from "./home.vue";

(function bootstrap() {
  const vue = new Vue({
    el: "#app",
    render: h => h(appVue)
  });

  return vue;
})();
