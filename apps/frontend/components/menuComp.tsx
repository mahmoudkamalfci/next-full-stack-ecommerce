import { createContext, useContext, useState } from 'react'
import { useToggle } from '@/hooks/useToggle'

interface MenuContextType {
    open: boolean;
    toggle: () => void;
}

const menuContext = createContext<MenuContextType | undefined>(undefined)

export function Menu({ children }: { children: React.ReactNode }) {
    const [open, toggle] = useToggle(false)
    return (
        <menuContext.Provider value={{ open, toggle }}>
            {children}
        </menuContext.Provider>
    )
}

export function useMenu() {
    const context = useContext(menuContext)
    if (!context) {
        throw new Error('useMenu must be used within a Menu provider')
    }
    return context
}

Menu.Button = function MenuButton({ children }: { children: React.ReactNode }) {
    const { toggle } = useMenu()
    return (
        <button onClick={toggle}>{children}</button>
    )
}

Menu.Content = function MenuContent({ children }: { children: React.ReactNode }) {
    const { open } = useMenu()
    return open && <div>{children}</div>
}