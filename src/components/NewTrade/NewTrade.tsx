'use client';

import { useState } from 'react';
import styles from './NewTrade.module.css';
import ItemSearch from '../ItemSearch/ItemSearch';
import { Item, Platforms } from '../types';
import ArcItem from '../common/Item/Item';
import Image from 'next/image';
import { Icon, IconName } from '@/utils/Icons';
import Button from '../common/Button/Button';

type SelectedItem = {
  item: Item;
  quantity: number;
};

const PLATFORMS: {
  key: Platforms;
  icon: IconName;
  label: string;
}[] = [
  { key: 'steam', icon: 'steam', label: 'Steam' },
  { key: 'playstation', icon: 'playstation', label: 'PlayStation' },
  { key: 'xbox', icon: 'xbox', label: 'Xbox' },
]

type Props = {
  onClose?: () => void;
};

export default function NewTrade({ onClose }: Props) {
  const [offerItems, setOfferItems] = useState<SelectedItem[]>([]);
  const [requestItems, setRequestItems] = useState<SelectedItem[]>([]);
  const [isRequesting, setIsRequesting] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<Platforms | undefined>(undefined);

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
      <section id="platform" className={styles.informationSection}>
        <span className={styles.title}>New Trade Request</span>
        <div className={styles.platformSection}>
          {PLATFORMS.map(platform => (
            <div key={platform.key} className={`${styles.platformItem} ${selectedPlatform === platform.key ? styles.selectedPlatform : ''}`}
            onClick={() => setSelectedPlatform(platform.key)}
            >
              <Icon icon={platform.icon} className={styles.platformIcon} />
            </div>
          ))}
        </div>
      </section>
      <ItemSearch
        onSelect={(item) => handleAddItem({ item, quantity: 1 })}
      />
      <div className={styles.tradeDetails}>
        {/* Your Offer */}
        <section id="yourOfferInfo" className={styles.offerInfoBox}>
          <div className={`${styles.offerHeader} ${!isRequesting && styles.active}`}>
            <span>Your Offer</span>
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: 'bold',
            }}>
              <Image src="/images/token.png" alt="Arc Token" width={16} height={16} style={{
                filter: !isRequesting ? 'none' : 'brightness(0.5)',
              }} />
              {offerItems.reduce((acc, item) => acc + item.item.value * item.quantity, 0)}
            </span>
          </div>
          <section
            id="yourOfferPanel"
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
        </section>

        {/* Their Offer */}
        <section id="theirOfferInfo" className={styles.offerInfoBox}>
          <div className={`${styles.offerHeader} ${isRequesting && styles.active}`}>
            <span>Their Offer</span>
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: 'bold',
            }}>
              <Image src="/images/token.png" alt="Arc Token" width={16} height={16}  style={{
                filter: isRequesting ? 'none' : 'brightness(0.5)',
              }}/>
              {requestItems.reduce((acc, item) => acc + item.item.value * item.quantity, 0)}
            </span>
          </div>
          <section
            id="theirOfferPanel"
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
        </section>
      </div>
      <span id="disclaimer" className={styles.disclaimer}>Trading <strong>more than 1 item</strong> at a time increases the risk of losing them. Please check the <strong>Player Reputation</strong> or do <strong>Multiple Small Trades</strong>.</span>
      <div className={styles.actionButtons}>
        <Button type="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="primary">
          Submit Trade offer
        </Button>
      </div>
    </section>
  );
}
