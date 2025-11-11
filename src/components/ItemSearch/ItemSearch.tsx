// ItemSearch.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './ItemSearch.module.css';
import type { Item } from '../types'; // <-- import shared Item type
import { Icon } from '@/utils/Icons';

type ItemSearchProps = {
  onSelect?: (item: Item) => void; // <-- return whole item
  minChars?: number; // default 3
  placeholder?: string;
};

export default function ItemSearch({
  onSelect,
  minChars = 3,
  placeholder = 'Search for an item...',
}: ItemSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // debounce + abort controller refs
  const debounceRef = useRef<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);

    if (query.trim().length < minChars) {
      setResults([]);
      setOpen(false);
      return;
    }

    debounceRef.current = window.setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setLoading(true);

      try {
        setOpen(true);
        const res = await fetch(`/api/items/search?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error('Failed to fetch');
        
        // Expecting API to return full Item[]
        const data: Item[] = await res.json();
        setResults(data);
      } catch (err: any) {
        if (err.name !== 'AbortError') console.error(err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    };
  }, [query, minChars]);

  const handleSelect = (item: Item) => {
    onSelect?.(item);           // <-- send whole item up
    setQuery(item.name);        // reflect selected value
    setQuery('');              // clear search after selection
    setOpen(false);
  };

  return (
    <div className={styles.itemSearch} ref={rootRef}>
      <input
        id="item-search-bar"
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => {
          if (results.length > 0) setOpen(true);
        }}
        className={styles.searchInputBar}
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls="item-search-results"
      />

      <div className={styles.searchIcon}>
        <Icon icon="search" className={styles.searchIconItem}/>
      </div>

      {open && (
        <div className={styles.dropdown} role="listbox" id="item-search-results">
          {loading && <div className={styles.loadingRow}>Loading...</div>}

          {!loading && results.length > 0 && (
            <ul className={styles.resultsList}>
              {results.map((item) => (
                <li
                  key={item.item_id}
                  className={styles.resultRow}
                  role="option"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSelect(item)}
                  tabIndex={0}
                >
                  {item.icon && (
                    <img
                      src={item.icon}
                      alt=""
                      width={24}
                      height={24}
                      className={styles.icon}
                    />
                  )}
                  <span className={styles.itemName}>{item.name}</span>
                </li>
              ))}
            </ul>
          )}

          {!loading && query.trim().length >= minChars && results.length === 0 && (
            <div className={styles.statusRow}>No results</div>
          )}
        </div>
      )}
    </div>
  );
}
