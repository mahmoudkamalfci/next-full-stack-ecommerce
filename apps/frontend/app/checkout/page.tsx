
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CheckoutPage() {
    return (
        <div className="container mx-auto py-16 px-4">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>
            <div className="text-center py-12">
                <p className="text-gray-500 mb-6">Checkout functionality coming soon.</p>
                <Button asChild variant="outline">
                    <Link href="/cart">Return to Cart</Link>
                </Button>
            </div>
        </div>
    )
}
