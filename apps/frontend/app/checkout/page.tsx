import { CheckoutClient } from "./checkout-client"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Checkout",
}

export default function CheckoutPage() {
    return (
        <div className="bg-white min-h-screen">
            <div className="container max-w-7xl mx-auto py-12 px-4 md:px-8">
                <CheckoutClient />
            </div>
        </div>
    )
}
