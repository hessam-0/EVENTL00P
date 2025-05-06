import VueSocialSharing from "vue-social-sharing";

export default defineNuxtPlugin((nuxtApp) => {
  //important: Use .vueApp to access the underlying Vue app instance
  nuxtApp.vueApp.use(VueSocialSharing);
});
