'use client';

import { useState } from 'react';
import styles from './NewTrade.module.css';
import ItemSearch from '../ItemSearch/ItemSearch';
import { Item } from '../types';
import ArcItem from '../common/Item';

type SelectedItem = {
  item: Item;
  quantity: number;
};

export default function NewTrade() {
  const [offerItems, setOfferItems] = useState<SelectedItem[]>([]);
  const [requestItems, setRequestItems] = useState<SelectedItem[]>([]);
  const [isRequesting, setIsRequesting] = useState(false);

  const upsert = (list: SelectedItem[], entry: SelectedItem) => {
    const idx = list.findIndex(i => i.item.id === entry.item.id);
    if (idx === -1) return [...list, entry];
    const next = list.slice();
    next[idx] = { ...next[idx], quantity: next[idx].quantity + entry.quantity };
    return next;
  };

  const handleAddItem = (entry: SelectedItem) => {
    if (isRequesting) {
      setRequestItems(prev => upsert(prev, entry));
    } else {
      setOfferItems(prev => upsert(prev, entry));
    }
  };

const setQty = (
  setter: React.Dispatch<React.SetStateAction<SelectedItem[]>>,
  id: Item["id"],
  newQty: number
) => {
  const clamped = Math.max(0, Math.min(99, newQty));
  setter(prev => {
    if (clamped <= 0) return prev.filter(i => i.item.id !== id);
    return prev.map(i => (i.item.id === id ? { ...i, quantity: clamped } : i));
  });
};


  return (
    <section className={styles.tradeSetupBox}>
      <ItemSearch
        onSelect={(item) => handleAddItem({ item, quantity: 1 })}
      />

      <div className={styles.tradeDetails}>
        {/* Your Offer */}
        <section
          id="yourOffer"
          className={`${styles.offerSection} ${!isRequesting && styles.active}`}
          onClick={() => setIsRequesting(false)}
        >
          {offerItems.map(({ item, quantity }) => (
            <ArcItem
              key={item.id}
              item={item}
              quantity={quantity}
              size={90}
              onChangeQuantity={(q) => setQty(setOfferItems, item.id, q)}
              onRemove={() => setOfferItems(prev => prev.filter(i => i.item.id === item.id ? false : true))}
            />
          ))}
          {Array.from({ length: Math.max(0, 16 - offerItems.length) }).map((_, i) => (
            <div key={i} className={styles.emptySlot} />
          ))}
        </section>

        {/* Their Offer */}
        <section
          id="theirOffer"
          className={`${styles.offerSection} ${isRequesting && styles.active}`}
          onClick={() => setIsRequesting(true)}
        >
          {requestItems.map(({ item, quantity }) => (
            <ArcItem
              key={item.id}
              item={item}
              quantity={quantity}
              size={90}
              onChangeQuantity={(q) => setQty(setRequestItems, item.id, q)}
              onRemove={() => setRequestItems(prev => prev.filter(i => i.item.id === item.id ? false : true))}
            />
          ))}
          {Array.from({ length: Math.max(0, 16 - requestItems.length) }).map((_, i) => (
            <div key={i} className={styles.emptySlot} />
          ))}
        </section>
      </div>
    </section>
  );
}
