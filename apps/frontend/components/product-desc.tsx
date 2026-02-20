
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export function ProductDetails() {
    return (
        <div className="bg-slate-50 rounded-2xl p-8 lg:p-12 mt-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left Column: Description */}
                <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide mb-3">Description</h3>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">PowerLite Training Tee</h2>

                    <div className=" space-y-6 leading-relaxed">
                        <p>
                            Designed for performance and everyday comfort, the Magma PowerLite Training Tee is crafted to keep up
                            with your active lifestyle. Made from lightweight, breathable fabric, it delivers excellent airflow and moisture
                            control to keep you cool and dry. The clean athletic cut with contrast side panels offers a modern, sporty
                            look—perfect for workouts, training sessions, or casual wear.
                        </p>
                        <p>
                            &nbsp;is crafted to keep up with your active lifestyle. Made from lightweight, breathable fabric, it delivers
                            excellent airflow and moisture control to keep you cool and dry. The clean athletic cut with contrast side
                            panels offers a modern, sporty look—perfect for workouts, training sessions, or casual wear.
                        </p>
                    </div>
                </div>

                {/* Right Column: Accordion */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit">
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="size-fit">
                            <AccordionTrigger className="text-base font-semibold">Size & Fit</AccordionTrigger>
                            <AccordionContent>
                                Model is 185cm wearing size L. Regular fit that allows for freedom of movement.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="product-features">
                            <AccordionTrigger className="text-base font-semibold">Product Features</AccordionTrigger>
                            <AccordionContent>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Moisture-wicking technology</li>
                                    <li>Incredibly lightweight feel</li>
                                    <li>Anti-odor fabric</li>
                                    <li>Four-way stretch material</li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="care-instructions">
                            <AccordionTrigger className="text-base font-semibold">Care Instructions</AccordionTrigger>
                            <AccordionContent>
                                Machine wash cold with like colors. Tumble dry low. Do not bleach. Do not iron print.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="shipping-returns">
                            <AccordionTrigger className="text-base font-semibold">Shipping & Returns</AccordionTrigger>
                            <AccordionContent>
                                Free standard shipping on orders over $50. Returns accepted within 30 days of purchase in original condition.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="material-specification" className="border-b-0">
                            <AccordionTrigger className="text-base font-semibold">Material Specification</AccordionTrigger>
                            <AccordionContent>
                                88% Polyester, 12% Elastane.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>
        </div>
    )
}
