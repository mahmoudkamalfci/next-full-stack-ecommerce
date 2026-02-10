import Link from "next/link"

const SiteFooter = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-12 mt-16">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                    {/* Brand Info Column */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white">FreshFit</h3>
                        <p className="text-sm leading-relaxed">
                            Your premier destination for fashion-forward clothing and accessories.
                            Discover the latest trends and timeless classics that define your style.
                        </p>
                        <div className="text-sm">
                            <p>© 2025 FreshFit. All rights reserved.</p>
                        </div>
                    </div>

                    {/* Navigation Links Column */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-white">Quick Links</h4>
                        <nav className="space-y-2">
                            <Link href="/" className="block text-sm hover:text-white transition-colors">
                                Home
                            </Link>
                            <Link href="/collections" className="block text-sm hover:text-white transition-colors">
                                Collections
                            </Link>
                            <Link href="/categories" className="block text-sm hover:text-white transition-colors">
                                Categories
                            </Link>
                            <Link href="/about" className="block text-sm hover:text-white transition-colors">
                                About Us
                            </Link>
                            <Link href="/contact" className="block text-sm hover:text-white transition-colors">
                                Contact
                            </Link>
                            <Link href="/support" className="block text-sm hover:text-white transition-colors">
                                Customer Support
                            </Link>
                        </nav>
                    </div>

                    {/* Branch Locations Column */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-white">Our Locations</h4>
                        <div className="space-y-4">
                            <div className="text-sm">
                                <h5 className="font-medium text-white">Downtown Store</h5>
                                <p>123 Fashion Ave</p>
                                <p>New York, NY 10001</p>
                                <p>(555) 123-4567</p>
                            </div>
                            <div className="text-sm">
                                <h5 className="font-medium text-white">Mall Location</h5>
                                <p>456 Shopping Blvd</p>
                                <p>Los Angeles, CA 90210</p>
                                <p>(555) 987-6543</p>
                            </div>
                            <div className="text-sm">
                                <h5 className="font-medium text-white">Outlet Center</h5>
                                <p>789 Retail Row</p>
                                <p>Miami, FL 33101</p>
                                <p>(555) 456-7890</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default SiteFooter
