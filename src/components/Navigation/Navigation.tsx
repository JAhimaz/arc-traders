"use client";

import { useState } from "react";
import styles from "./Navigation.module.css";
import { NavigationItems, NavItem } from "./NavigationItems";
import { Icon } from "@/utils/Icons";
import Button from "../common/Button/Button";
import NewTrade from "../NewTrade/NewTrade";

const Navigation = () => {

  const [activeItem, setActiveItem] = useState<NavItem["id"]>(NavigationItems[0].id);
  const [newTradeOpen, setNewTradeOpen] = useState(false);
  
  return (
    <nav className={styles.navigation}>
      
      {/* New Trade */}
      {newTradeOpen &&
        <div className={styles.newTrade}>
          <div className={styles.overlay}></div>
          <NewTrade onClose={() => setNewTradeOpen(false)}/>
        </div>
      }
      
      <div />
      <div className={styles.centerNav}>
        {NavigationItems.map((navItem : NavItem) => (
          <div key={navItem.id} className={`${styles.navItem} ${activeItem === navItem.id ? styles.active : ""}`} onClick={() => setActiveItem(navItem.id)}>
            <span className={styles.navItemLabel}>{navItem.label}</span>
          </div>
        ))}
      </div>
      <div className={styles.userInfo}>
        {/* User Embark ID */}
        <Button onClick={() => setNewTradeOpen(true)} type="primary">
          New Trade
        </Button>
        <span>EmbarkID#1234</span>
        <div>
          <Icon icon="disconnect" className={styles.userIcon} />
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
