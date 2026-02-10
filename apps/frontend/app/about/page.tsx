import { ArrowRight, CheckCircle2, Users, Globe, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative py-20 md:py-32 overflow-hidden">
                <div className="container px-4 md:px-6 mx-auto relative z-10">
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-1000">
                            We Are crafting the Future of Commerce
                        </h1>
                        <p className="text-xl text-muted-foreground md:text-2xl max-w-[800px] mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                            Building a world where quality meets convenience. We&apos;re more than just a store; we&apos;re a community of innovators and dreamers.
                        </p>
                        <div className="flex justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
                            <Button size="lg" className="rounded-full px-8" asChild>
                                <Link href="/collections">
                                    Join Our Journey <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button variant="outline" size="lg" className="rounded-full px-8" asChild>
                                <Link href="/contact">
                                    Learn More
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Abstract Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-20">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse delay-1000" />
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 border-y bg-muted/30">
                <div className="container px-4 mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { label: "Happy Customers", value: "50K+" },
                            { label: "Products Sold", value: "120K+" },
                            { label: "Countries Served", value: "25+" },
                            { label: "Team Members", value: "100+" },
                        ].map((stat) => (
                            <div key={stat.label} className="space-y-2">
                                <h3 className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</h3>
                                <p className="text-muted-foreground font-medium">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="py-20 md:py-32">
                <div className="container px-4 mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-medium">
                                Our Story
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                                From Humble Beginnings to Global Impact
                            </h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Founded in 2023, we started with a simple mission: to make high-quality products accessible to everyone. What began as a small garage operation has grown into a global brand, but our core values remain unchanged.
                            </p>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                We believe in sustainability, ethical sourcing, and putting our customers first. Every product we sell tells a story of craftsmanship and dedication.
                            </p>
                            <div className="space-y-4 pt-4">
                                {[
                                    "Ethically sourced materials",
                                    "Carbon neutral shipping",
                                    "24/7 Customer support",
                                ].map((item) => (
                                    <div key={item} className="flex items-center gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                                        <span className="font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-square rounded-2xl overflow-hidden bg-muted shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                                {/* Placeholder for an actual image, using a gradient for now */}
                                <div className="w-full h-full bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                    <span className="text-muted-foreground">Office Image Placeholder</span>
                                </div>
                            </div>
                            <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-background rounded-lg shadow-xl p-6 flex flex-col justify-center items-center text-center border">
                                <span className="text-4xl font-bold text-primary mb-2">5+</span>
                                <span className="text-sm text-muted-foreground">Years of Excellence</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 bg-muted/30">
                <div className="container px-4 mx-auto">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Values</h2>
                        <p className="text-muted-foreground text-lg">
                            These principles guide every decision we make and every product we launch.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Users,
                                title: "Customer First",
                                desc: "We obsess over our customers' happiness and success.",
                            },
                            {
                                icon: Globe,
                                title: "Sustainability",
                                desc: "We are committed to reducing our environmental footprint.",
                            },
                            {
                                icon: Award,
                                title: "Quality",
                                desc: "We never compromise on the quality of our products.",
                            },
                        ].map((feature) => (
                            <div key={feature.title} className="bg-background p-8 rounded-2xl shadow-sm border hover:shadow-md transition-shadow">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary">
                                    <feature.icon className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
