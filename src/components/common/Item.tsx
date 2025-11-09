"use client";
import styles from "./Item.module.css";
import type { Item } from "../types";

type Props = {
  item: Item;
  quantity: number;
  size: number;
  onChangeQuantity?: (newQty: number) => void;
  onRemove?: () => void;
};

const ArcItem = ({ item, quantity, size, onChangeQuantity, onRemove }: Props) => {
  const canEdit = typeof onChangeQuantity === "function";
  const clamp = (val: number) => Math.max(0, Math.min(99, val));

  const inc = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (canEdit) onChangeQuantity!(clamp(quantity + 1));
  };

  const dec = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (canEdit) onChangeQuantity!(clamp(quantity - 1));
  };

  const remove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.();
  };

  return (
    <div
      className={styles.item}
      style={{
        width: size,
        height: size,
        ["--rarity" as any]: GetItemRarityColour(item.rarity),
      }}
    >
      {/* Name hover bar */}
      <div className={styles.hoverNameBar}>
        <span>{item.name}</span>
      </div>

      {/* Remove button (top-right corner, styled via CSS) */}
      {onRemove && (
        <button
          type="button"
          className={styles.removeItemButton}
          onClick={remove}
          aria-label="Remove item"
        >
          ×
        </button>
      )}

      {/* Item visual */}
      <div
        id="itemOverlay"
        className={styles.itemOverlay}
        style={{
          width: size / 1.5,
          height: size / 1.5,
          backgroundImage: `url(${item.icon})`,
        }}
      />
      <div
        id="itemGradient"
        className={styles.itemGradient}
        style={{
          background: `linear-gradient(30deg, ${GetItemRarityColour(
            item.rarity
          )}50 0%, rgba(0, 0, 0, 0) 60%)`,
        }}
      />

      {/* Quantity controls */}
      <div className={styles.itemNameBar}>
        <div className={styles.itemQuantityControls}>
          <button
            type="button"
            className={styles.itemQuantityControl}
            onClick={inc}
            aria-label="Increase quantity"
            disabled={!canEdit || quantity >= 99}
          >
            +
          </button>
          <button
            type="button"
            className={styles.itemQuantityControl}
            onClick={dec}
            aria-label="Decrease quantity"
            disabled={!canEdit || quantity <= 0}
          >
            -
          </button>
        </div>
        <span style={{
          userSelect: "none",
        }}>x{quantity}</span>
      </div>
    </div>
  );
};

export default ArcItem;

export const GetItemRarityColour = (rarity: string) => {
  switch (rarity.toLowerCase()) {
    case "common":
      return "#7b787f";
    case "uncommon":
      return "#34bb5f";
    case "rare":
      return "#11a5ef";
    case "epic":
      return "#c83190";
    case "legendary":
      return "#edc530";
    default:
      return "#7b787f";
  }
};
