import { IconName } from "@/utils/Icons";

export const NavigationItems: NavItem[] = [
  {
    id: "trading",
    label: "TRADING",
  },
  {
    id: "profile",
    label: "PROFILE",
  },
  {
    id: "settings",
    label: "SETTINGS",
  }
];

export type NavItem = {
  id: string;
  label: string;
};
