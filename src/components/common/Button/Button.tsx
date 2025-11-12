"use client";
import styles from "./Button.module.css";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "primary" | "secondary";
};

const Button = ({ children, onClick, disabled, type = "primary" }: Props) => {
  return (
    <button
      className={`${styles.button} ${type === "secondary" ? styles.secondary : styles.primary}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;