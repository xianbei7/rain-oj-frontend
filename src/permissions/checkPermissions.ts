import PERMISSIONS_ENUM from "@/permissions/permissionsEnum";

/**
 * 检查权限
 * @param loginUser 当前登录的用户
 * @param needPermissions 需要的权限
 * @return boolean 有无权限
 */
const checkPermissions = (
  loginUser: any,
  needPermissions = PERMISSIONS_ENUM.NOT_LOGIN
) => {
  // 获取当前用户具有的权限
  const loginUserPermissions =
    loginUser?.userRole ?? PERMISSIONS_ENUM.NOT_LOGIN;
  if (needPermissions === PERMISSIONS_ENUM.NOT_LOGIN) {
    return true;
  } else if (needPermissions === PERMISSIONS_ENUM.USER) {
    return loginUserPermissions !== PERMISSIONS_ENUM.NOT_LOGIN;
  } else {
    return loginUserPermissions === PERMISSIONS_ENUM.ADMIN;
  }
};
export default checkPermissions;
