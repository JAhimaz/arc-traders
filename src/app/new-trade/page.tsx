import Image from "next/image";
import styles from "./page.module.css";
import ItemSearch from "@/components/ItemSearch/ItemSearch";
import NewTrade from "@/components/NewTrade/NewTrade";

export default function NewTradePage() {
  return (
    <div className={styles.page}>
      <NewTrade />
    </div>
  );
}
