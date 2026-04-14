import { useState } from "react"

export function useToggle(initialState: boolean = false) {
    const [open, setOpen] = useState(initialState)
    const toggle = () => setOpen(!open)
    return [open, toggle] as const
}