import { router } from "./router";

export default {
  fetch(request, env, ctx) {
    return router(request);
  },
};
