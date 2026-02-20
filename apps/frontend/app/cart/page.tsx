import { CartClient } from "./cart-client"

export const metadata = {
    title: "Shopping Cart",
}

export default function CartPage() {
    return (
        <div className="container max-w-6xl mx-auto py-12 px-4 md:px-6">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-900">Cart</h1>
            <CartClient />
        </div>
    )
}
