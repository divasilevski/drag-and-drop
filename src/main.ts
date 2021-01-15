import { createApp, defineAsyncComponent } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "normalize.css";

const app = createApp(App);
app.use(store);
app.use(router);
app.mount("#app");

// Глобальное добавление компонентов для DragAndDropBoard
const widgets = ["DrugBox", "DrugBox2", "DrugBox3", "DrugBox4"];

widgets.forEach((key: string) => {
  const ac = defineAsyncComponent(() =>
    import(`@/components/widgets/${key}.vue`)
  );
  app.component(key, ac);
});
