import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        //d:aplicaion/dist/
        index: resolve(__dirname, "index.html"),
        home: resolve(__dirname, "src/pages/home/home.html"),
        cart: resolve(__dirname, "src/pages/cart/cart.html"),
      },
    },
  },
  base: "./",
});
