
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CartPage() {
    return (
        <div className="container mx-auto py-16 px-4">
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
            <div className="text-center py-12">
                <p className="text-gray-500 mb-6">Your cart is currently empty.</p>
                <Button asChild>
                    <Link href="/">Continue Shopping</Link>
                </Button>
            </div>
        </div>
    )
}
