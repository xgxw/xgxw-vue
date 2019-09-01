import { MobileWidth } from "@/constants/constants";

export const isMobile = function () {
  if (document.body.clientWidth < MobileWidth) {
    return true;
  }
  return false;
};
