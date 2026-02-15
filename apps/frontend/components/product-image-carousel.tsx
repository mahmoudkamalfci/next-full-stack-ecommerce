"use client"

import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/ui/carousel"
import { Search } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
} from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

interface ProductImageCarouselProps {
    images: string[]
}

export function ProductImageCarousel({ images }: ProductImageCarouselProps) {
    const [mainApi, setMainApi] = React.useState<CarouselApi>()
    const [thumbApiDesktop, setThumbApiDesktop] = React.useState<CarouselApi>()
    const [thumbApiMobile, setThumbApiMobile] = React.useState<CarouselApi>()
    const [current, setCurrent] = React.useState(0)
    const [isOpen, setIsOpen] = React.useState(false)

    React.useEffect(() => {
        if (!mainApi) {
            return
        }

        mainApi.on("select", () => {
            const index = mainApi.selectedScrollSnap()
            setCurrent(index)
            thumbApiDesktop?.scrollTo(index)
            thumbApiMobile?.scrollTo(index)
        })
    }, [mainApi, thumbApiDesktop, thumbApiMobile])

    const onThumbClick = (index: number) => {
        if (!mainApi) {
            return
        }
        mainApi.scrollTo(index)
    }

    if (!images || images.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-col-reverse md:flex-row gap-4 w-full max-w-4xl">
            {/* Thumbnails - Horizontal on mobile, Vertical on desktop */}
            <div className="w-full md:w-24 shrink-0">
                <Carousel
                    setApi={setThumbApiDesktop}
                    opts={{
                        align: "start",
                        containScroll: "keepSnaps",
                        dragFree: true,
                    }}
                    orientation="vertical"
                    className="w-full hidden md:block h-[500px]" // Vertical only on desktop
                >
                    <CarouselContent className="-mt-4 h-[500px]">
                        {images.map((image, index) => (
                            <CarouselItem key={index} className="pt-4 basis-1/5">
                                <div
                                    className={cn(
                                        "relative aspect-3/4 cursor-pointer overflow-hidden rounded-md border-2 transition-all",
                                        current === index
                                            ? "border-black opacity-100"
                                            : "border-transparent opacity-60 hover:opacity-100"
                                    )}
                                    onClick={() => onThumbClick(index)}
                                >
                                    <Image
                                        src={image}
                                        alt={`Product thumbnail ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>

                {/* Mobile Horizontal Thumbnails */}
                <Carousel
                    setApi={setThumbApiMobile}
                    opts={{
                        align: "start",
                        containScroll: "keepSnaps",
                        dragFree: true,
                    }}
                    className="w-full md:hidden"
                >
                    <CarouselContent className="-ml-2">
                        {images.map((image, index) => (
                            <CarouselItem key={index} className="pl-2 basis-1/5">
                                <div
                                    className={cn(
                                        "relative aspect-square cursor-pointer overflow-hidden rounded-md border-2 transition-all",
                                        current === index
                                            ? "border-black opacity-100"
                                            : "border-transparent opacity-60 hover:opacity-100"
                                    )}
                                    onClick={() => onThumbClick(index)}
                                >
                                    <Image
                                        src={image}
                                        alt={`Product thumbnail ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>

            {/* Main Image */}
            <div className="relative flex-1 bg-gray-100 rounded-lg overflow-hidden">
                <Carousel setApi={setMainApi} className="w-full h-full">
                    <CarouselContent>
                        {images.map((image, index) => (
                            <CarouselItem key={index}>
                                <div className="relative aspect-3/4 w-full h-full">
                                    <Image
                                        src={image}
                                        alt={`Product image ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    {/* Navigation Overlays */}
                    <div className="absolute inset-y-0 left-0 w-1/2 z-10 group/left"
                        style={{ cursor: `url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiLz48cGF0aCBkPSJtMTIgOC00IDQgNCA0Ii8+PHBhdGggZD0iTTE2IDEySDgiLz48L3N2Zz4=') 24 24, auto` }}
                        onClick={() => mainApi?.scrollPrev()}
                    />
                    <div className="absolute inset-y-0 right-0 w-1/2 z-10 group/right"
                        style={{ cursor: `url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiLz48cGF0aCBkPSJtMTIgMTYgNC00LTQtNCIvPjxwYXRoIGQ9Ik04IDEyaDgiLz48L3N2Zz4=') 24 24, auto` }}
                        onClick={() => mainApi?.scrollNext()}
                    />
                </Carousel>

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <button className="absolute bottom-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors z-10 cursor-pointer">
                            <Search className="h-5 w-5 text-gray-600" />
                        </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-none bg-transparent shadow-none">
                        <VisuallyHidden>
                            <DialogTitle>Product Image Preview</DialogTitle>
                        </VisuallyHidden>
                        <div className="relative w-full h-[90vh] flex items-center justify-center">
                            {images[current] && (
                                <Image
                                    src={images[current]}
                                    alt={`Product image full view`}
                                    fill
                                    className="object-contain"
                                />
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}
