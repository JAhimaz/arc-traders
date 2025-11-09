"use client";

import { CSSProperties, FC } from "react";
import { FaTicket, FaHubspot } from "react-icons/fa6";
import { BsPeopleFill } from "react-icons/bs";
import { RiRobot2Fill, RiTestTubeFill } from "react-icons/ri";
import { FaWallet, FaHandHoldingWater, FaQuestion, FaTelegramPlane  } from "react-icons/fa";
import { MdRocketLaunch } from "react-icons/md";
import { GiPayMoney } from "react-icons/gi";
import { GrLinkNext } from "react-icons/gr";

const IconsIndex = {
  ticket: FaTicket,
  persons: BsPeopleFill,
  bot: RiRobot2Fill,
  wallet: FaWallet,
  testnet: RiTestTubeFill,
  mainnet: MdRocketLaunch,
  supply: FaHandHoldingWater,
  demand: GiPayMoney,
  question: FaQuestion,
  arrowRight: GrLinkNext,
  hubspot: FaHubspot,
  telegram: FaTelegramPlane
};

const EventIndex = {
  //
}

const SocialsIndex = {
  //
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