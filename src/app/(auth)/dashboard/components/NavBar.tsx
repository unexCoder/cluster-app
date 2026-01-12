import React, { useState } from 'react'
import styles from './navbar.module.css'

interface NavItem {
  label: string;
  icon?: React.ReactNode;
  children?: NavItem[];
}

interface NavBarProps {
  items: NavItem[];
  onUpdate: (value: string) => void;
  level?: number;
}

export default function NavBar({ items, onUpdate, level = 0 }: NavBarProps) {
  // Objeto que guarda el estado activo de cada índice
  const [activeIndices, setActiveIndices] = useState<Record<number, number | null>>({});

  const handleClick = (href: string, index: number, e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();

    onUpdate(href);
    
    // Toggle del índice específico
    setActiveIndices(prev => ({
      ...prev,
      [index]: prev[index] !== undefined && prev[index] !== null ? null : 0
    }));
  };

  const handleChildIndexChange = (parentIndex: number, childIndex: number | null) => {
    setActiveIndices(prev => ({
      ...prev,
      [parentIndex]: childIndex
    }));
  };

  return (
    <div className={`${styles.container} ${level === 0 ? styles.topLevel : ''}`}>
      <nav className={styles.navbar}>
        <ul>
          {items.map((item, index) => {
            const isActive = activeIndices[index] !== undefined && activeIndices[index] !== null;
            
            return (
              <li key={index} onClick={(e) => handleClick(item.label, index, e)}>
                {item.label}
                {item.children && (
                  <span className={styles.arrow}>
                    {isActive ? '▼' : '▶'}
                  </span>
                )}

                {/* Mostrar submenú si está activo */}
                {item.children && isActive && (
                  <NavBar
                    items={item.children}
                    onUpdate={onUpdate}
                    level={level + 1}
                  />
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  )
}
