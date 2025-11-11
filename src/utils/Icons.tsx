"use client";

import { CSSProperties, FC } from "react";
import { FaPlaystation, FaSteam, FaXbox, FaSearch } from "react-icons/fa";


const IconsIndex = {
  search: FaSearch,
};

const EventIndex = {
  //
}

const SocialsIndex = {
  steam: FaSteam,
  playstation: FaPlaystation,
  xbox: FaXbox
}

const Index = {
  ...EventIndex,
  ...IconsIndex,
  ...SocialsIndex
}

export type IconName = keyof typeof Index | "none";

type Props = {
  icon: IconName
  className?: string
  style?: CSSProperties
  onClick?: () => void;
}

export const Icon: FC<Props> = ({ icon, className, style, onClick }) => {
  if (icon == "none") {
    return null;
  }

  const Icon = Index[icon];
  return (
    <Icon className={className} style={style} onClick={onClick} />
  )
}