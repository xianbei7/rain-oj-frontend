import { defineStore } from "pinia";
import PERMISSIONS_ENUM from "@/permissions/permissionsEnum";
import { UserControllerService } from "../../generated";

export const useUserInfo = defineStore("userInfo", {
  state: () => {
    return {
      userName: "",
      userRole: "",
      userAvatar: "",
      userProfile: "",
    };
  },
  actions: {
    async getLoginUser() {
      const resp = await UserControllerService.getLoginUserUsingGet();
      // 从远程请求获取登录信息
      if (resp.code === 0) {
        Object.assign(this, resp.data);
      } else {
        Object.assign(this, {
          ...this,
          userRole: PERMISSIONS_ENUM.NOT_LOGIN,
        });
      }
    },
  },
});
