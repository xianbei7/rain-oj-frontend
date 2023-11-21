import router from "@/router";
import PERMISSIONS_ENUM from "@/permissions/permissionsEnum";
import checkPermissions from "@/permissions/checkPermissions";

router.beforeEach(async (to, from, next) => {
  const { useUserInfo } = await import("@/store/UserInfo");
  const userInfo = useUserInfo();

  // 如果之前没有登陆过，自动登录
  if (!userInfo || !userInfo?.userRole) {
    await userInfo.getLoginUser();
  }
  const needPermissions =
    (to.meta?.permissions as string) ?? PERMISSIONS_ENUM.NOT_LOGIN;
  // 要跳转的页面需要登录
  if (needPermissions !== PERMISSIONS_ENUM.NOT_LOGIN) {
    if (!userInfo?.userRole) {
      next(`/user/login?redirect=${to.fullPath}`);
      return;
    }
    if (!checkPermissions(userInfo, needPermissions)) {
      next("/noAuth");
      return;
    }
  }
  next();
});
