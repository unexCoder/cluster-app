import React, { useState } from 'react'
import styles from './navbar.module.css'

interface NavItem {
  label: string;
  icon?: React.ReactNode;
  children?: NavItem[]; // Add nested items
}

interface NavBarProps {
  items: NavItem[];
  onUpdate: (value: string) => void;
  level?: number; // Track nesting level for styling
}

export default function NavBar({ items, onUpdate, level = 0 }: NavBarProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleClick = (href: string, index: number, e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault(); // Prevent default link behavior if you want SPA navigation
    e.stopPropagation(); // This stops the event from bubbling to parent

    onUpdate(href); // Send the selected item back to parent
    // Toggle submenu visibility
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className={`${styles.container} ${level === 0 ? styles.topLevel : ''}`}>
      <nav className={styles.navbar}>
        <ul>
          {items.map((item, index) => (
            <li key={index} onClick={(e) => handleClick(item.label, index, e)}>
              {item.label}
              {item.children && <span className={styles.arrow}>{activeIndex === index ? '▼' : '▶'}</span>}

              {/* Recursive rendering of child navbar */}
              {item.children && activeIndex === index && (
                <NavBar
                  items={item.children}
                  onUpdate={onUpdate}
                  level={level + 1}
                />
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
