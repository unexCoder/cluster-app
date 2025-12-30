import React from 'react'

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface NavBarProps {
  items: NavItem[];
}

export default function NavBar( {items}: NavBarProps ) {
  return (
    <nav className="navbar">
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            <a href={item.href}>
              {item.icon && <span className="icon">{item.icon}</span>}
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
