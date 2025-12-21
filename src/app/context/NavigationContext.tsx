// contexts/NavigationContext.tsx
'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { usePathname } from 'next/navigation'

interface NavigationContextType {
  currentPath: string
  previousPath: string | null
  history: string[]
}

const NavigationContext = createContext<NavigationContextType>({
  currentPath: '/',
  previousPath: null,
  history: []
})

export function NavigationProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [previousPath, setPreviousPath] = useState<string | null>(null)
  const [history, setHistory] = useState<string[]>([])

  useEffect(() => {
    // Update previous path
    if (pathname !== previousPath) {
      setPreviousPath(history[history.length - 1] || null)
      
      // Add to history (keep last 10)
      setHistory(prev => [...prev, pathname].slice(-10))
    }
  }, [pathname])

  return (
    <NavigationContext.Provider 
      value={{ 
        currentPath: pathname, 
        previousPath,
        history 
      }}
    >
      {children}
    </NavigationContext.Provider>
  )
}

export const useNavigation = () => useContext(NavigationContext)