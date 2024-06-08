export const ROLE_SUPERVISOR = "ROLE_SUPERVISOR";
export const ROLE_DIRECTOR = "ROLE_DIRECTOR";
export const ROLE_NORMAL = "ROLE_NORMAL";
export const isAuthorisedVip = (driverData, userContext) => {
  return (
    (driverData.assignedToRole == ROLE_SUPERVISOR && driverData.assignedToUser == userContext?.userData?.userId &&
      userContext?.userData?.roles?.some(
        (role) => role.roleName == ROLE_SUPERVISOR
      )) ||
    (driverData.assignedToRole == ROLE_DIRECTOR &&
      userContext?.userData?.roles?.some(
        (role) => role.roleName == ROLE_DIRECTOR
      ))
  );
};
export const checkLoggedInRole = (userRole,userContext) => {
  return userContext?.userData?.roles?.some(
    (role) => role.roleName == userRole
  );
};
