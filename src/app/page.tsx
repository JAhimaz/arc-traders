import styles from "./page.module.css";
import Homepage from "@/components/Pages/Homepage/Homepage";

export default function Home() {

  return (
    <div className={styles.page}>
      <Homepage />
    </div>
  );
}
