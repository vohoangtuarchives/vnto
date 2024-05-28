import axiosInstance from "./api";
import store from "@/state/store";

import TokenService from "./token.service";
import appConfig from "@/configs/app.config";

const setup = () => {
  const timeout = appConfig.APP_MAX_CONNECTION_TIME;
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = TokenService.getLocalAccessToken();
      if (token) {
        config.headers["x-access-token"] = token;
      }
      config.timeout = timeout;
      //store.commit('layout/beginLoading'); // Call beginLoading mutation before starting the request
      return config;
    },
    (error) => {
      store.commit('layout/endLoading'); // Ensure to end loading even if request fails
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (res) => {
     // store.commit('layout/endLoading'); // Call endLoading mutation when request is successful
      return res;
    },
    async (err) => {
     // store.commit('layout/endLoading'); // Ensure to end loading even if request fails
      const originalConfig = err.config;
      if (originalConfig.url == "/auth/refresh") {
        return Promise.reject();
      } else {
        // Handle other cases
      }
      return Promise.reject(err);
    }
  );
};

export default setup;
