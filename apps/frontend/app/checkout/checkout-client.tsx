"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ChevronLeft, Lock } from "lucide-react"

import { useCartStore } from "@/stores/useCartStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
    Field,
    FieldContent,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"

const checkoutSchema = z.object({
    email: z.string().email("Please enter a valid email address."),
    createAccount: z.boolean(),
    password: z.string().optional(),
    country: z.string().min(1, "Country is required"),
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    address: z.string().min(5, "Address must be at least 5 characters"),
    city: z.string().min(2, "City is required"),
    postalCode: z.string().min(3, "Postal code is required"),
    phone: z.string().min(10, "Please enter a valid phone number"),
    paymentMethod: z.enum(["credit_card", "paypal", "cod"]),
    cardNumber: z.string().optional(),
    expirationDate: z.string().optional(),
    securityCode: z.string().optional(),
    nameOnCard: z.string().optional(),
}).superRefine((data, ctx) => {
    if (data.createAccount && (!data.password || data.password.length < 6)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Password must be at least 6 characters",
            path: ["password"],
        });
    }
    if (data.paymentMethod === "credit_card") {
        if (!data.cardNumber) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Card number is required",
                path: ["cardNumber"],
            });
        }
        if (!data.expirationDate) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Expiration date is required",
                path: ["expirationDate"],
            });
        }
        if (!data.securityCode) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Security code is required",
                path: ["securityCode"],
            });
        }
        if (!data.nameOnCard) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Name on card is required",
                path: ["nameOnCard"],
            });
        }
    }
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>

export function CheckoutClient() {
    const [mounted, setMounted] = useState(false)
    const cartItems = useCartStore((state) => state.items)

    const form = useForm<CheckoutFormValues>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            email: "",
            createAccount: false,
            password: "",
            country: "egypt",
            firstName: "",
            lastName: "",
            address: "",
            city: "",
            postalCode: "",
            phone: "",
            paymentMethod: "credit_card",
            cardNumber: "",
            expirationDate: "",
            securityCode: "",
            nameOnCard: "",
        },
    })

    const createAccount = form.watch("createAccount")
    const paymentMethod = form.watch("paymentMethod")

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <div className="min-h-screen animate-pulse bg-gray-50" />
    }

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
    const shipping = 50 // Fixed shipping for now
    const total = subtotal + shipping

    const onSubmit = (data: CheckoutFormValues) => {
        console.log("Form submitted: ", data)
        // Add payment & order integration logic here
    }

    return (
        <div className="flex flex-col lg:flex-row gap-10">
            {/* Left Column: Form */}
            <div className="flex-1 lg:max-w-[60%]">
                <div className="mb-8">
                    <Link href="/cart" className="text-sm font-medium text-gray-500 hover:text-black flex items-center transition-colors">
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Back to cart
                    </Link>
                </div>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
                    {/* Contact Info */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold tracking-tight text-gray-900 border-b pb-4">Contact Information</h2>
                        <FieldGroup>
                            <Controller
                                name="email"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>Email address</FieldLabel>
                                        <Input
                                            type="email"
                                            placeholder="you@example.com"
                                            className="h-12 bg-white"
                                            aria-invalid={fieldState.invalid}
                                            {...field}
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="createAccount"
                                control={form.control}
                                render={({ field }) => (
                                    <Field orientation="horizontal" className="items-center mt-2">
                                        <Checkbox
                                            id="createAccount"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                        <FieldLabel htmlFor="createAccount" className="font-normal cursor-pointer leading-none">
                                            Create an account for faster checkout next time
                                        </FieldLabel>
                                    </Field>
                                )}
                            />

                            {createAccount && (
                                <div className="mt-4 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-4">
                                    <Controller
                                        name="password"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel>Create password</FieldLabel>
                                                <Input
                                                    type="password"
                                                    placeholder="Enter a secure password"
                                                    className="h-12 bg-white"
                                                    aria-invalid={fieldState.invalid}
                                                    {...field}
                                                />
                                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                            </Field>
                                        )}
                                    />
                                </div>
                            )}
                        </FieldGroup>
                    </div>

                    {/* Shipping Info */}
                    <div className="space-y-6 flex flex-col pt-4">
                        <h2 className="text-xl font-bold tracking-tight text-gray-900 border-b pb-4">Shipping Address</h2>
                        <FieldGroup>
                            <Controller
                                name="country"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>Country / Region</FieldLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger className="h-12 bg-white" aria-invalid={fieldState.invalid}>
                                                <SelectValue placeholder="Select country" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="egypt">Egypt</SelectItem>
                                                <SelectItem value="usa">United States</SelectItem>
                                                <SelectItem value="uk">United Kingdom</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Controller
                                    name="firstName"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel>First name</FieldLabel>
                                            <Input
                                                placeholder="First name"
                                                className="h-12 bg-white"
                                                aria-invalid={fieldState.invalid}
                                                {...field}
                                            />
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="lastName"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel>Last name</FieldLabel>
                                            <Input
                                                placeholder="Last name"
                                                className="h-12 bg-white"
                                                aria-invalid={fieldState.invalid}
                                                {...field}
                                            />
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />
                            </div>

                            <Controller
                                name="address"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>Address</FieldLabel>
                                        <Input
                                            placeholder="Street address or P.O. Box"
                                            className="h-12 bg-white"
                                            aria-invalid={fieldState.invalid}
                                            {...field}
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Controller
                                    name="city"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel>City</FieldLabel>
                                            <Input
                                                placeholder="City"
                                                className="h-12 bg-white"
                                                aria-invalid={fieldState.invalid}
                                                {...field}
                                            />
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="postalCode"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel>Postal code</FieldLabel>
                                            <Input
                                                placeholder="Postal code"
                                                className="h-12 bg-white"
                                                aria-invalid={fieldState.invalid}
                                                {...field}
                                            />
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />
                            </div>

                            <Controller
                                name="phone"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>Phone number</FieldLabel>
                                        <Input
                                            type="tel"
                                            placeholder="Phone for delivery updates"
                                            className="h-12 bg-white"
                                            aria-invalid={fieldState.invalid}
                                            {...field}
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                    </div>

                    {/* Payment Info */}
                    <div className="space-y-6 pt-4">
                        <h2 className="text-xl font-bold tracking-tight text-gray-900 border-b pb-4">Payment Method</h2>
                        <FieldGroup>
                            <Controller
                                name="paymentMethod"
                                control={form.control}
                                render={({ field }) => (
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        className="space-y-4"
                                    >
                                        <Field orientation="horizontal" className="border rounded-lg p-4 bg-white items-center gap-4 cursor-pointer data-[state=checked]:border-black hover:border-black/50 transition-colors">
                                            <RadioGroupItem value="credit_card" id="credit_card" />
                                            <FieldContent className="flex-1">
                                                <FieldLabel htmlFor="credit_card" className="font-semibold cursor-pointer">Credit Card</FieldLabel>
                                            </FieldContent>
                                        </Field>

                                        {paymentMethod === "credit_card" && (
                                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 mt-0 pt-6 animate-in fade-in slide-in-from-top-2 space-y-4">
                                                <Controller
                                                    name="cardNumber"
                                                    control={form.control}
                                                    render={({ field: inputField, fieldState }) => (
                                                        <Field data-invalid={fieldState.invalid}>
                                                            <FieldLabel>Card number</FieldLabel>
                                                            <Input
                                                                placeholder="0000 0000 0000 0000"
                                                                className="h-12 bg-white"
                                                                aria-invalid={fieldState.invalid}
                                                                {...inputField}
                                                            />
                                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                                        </Field>
                                                    )}
                                                />
                                                <div className="grid grid-cols-2 gap-4">
                                                    <Controller
                                                        name="expirationDate"
                                                        control={form.control}
                                                        render={({ field: inputField, fieldState }) => (
                                                            <Field data-invalid={fieldState.invalid}>
                                                                <FieldLabel>Expiration date (MM/YY)</FieldLabel>
                                                                <Input
                                                                    placeholder="MM / YY"
                                                                    className="h-12 bg-white"
                                                                    aria-invalid={fieldState.invalid}
                                                                    {...inputField}
                                                                />
                                                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                                            </Field>
                                                        )}
                                                    />
                                                    <Controller
                                                        name="securityCode"
                                                        control={form.control}
                                                        render={({ field: inputField, fieldState }) => (
                                                            <Field data-invalid={fieldState.invalid}>
                                                                <FieldLabel>Security code</FieldLabel>
                                                                <Input
                                                                    placeholder="CVC"
                                                                    className="h-12 bg-white"
                                                                    aria-invalid={fieldState.invalid}
                                                                    {...inputField}
                                                                />
                                                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                                            </Field>
                                                        )}
                                                    />
                                                </div>
                                                <Controller
                                                    name="nameOnCard"
                                                    control={form.control}
                                                    render={({ field: inputField, fieldState }) => (
                                                        <Field data-invalid={fieldState.invalid}>
                                                            <FieldLabel>Name on card</FieldLabel>
                                                            <Input
                                                                placeholder="Name as printed on card"
                                                                className="h-12 bg-white"
                                                                aria-invalid={fieldState.invalid}
                                                                {...inputField}
                                                            />
                                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                                        </Field>
                                                    )}
                                                />
                                            </div>
                                        )}

                                        <Field orientation="horizontal" className="border rounded-lg p-4 bg-white items-center gap-4 cursor-pointer data-[state=checked]:border-black hover:border-black/50 transition-colors">
                                            <RadioGroupItem value="paypal" id="paypal" />
                                            <FieldContent className="flex-1">
                                                <FieldLabel htmlFor="paypal" className="font-semibold cursor-pointer">PayPal</FieldLabel>
                                            </FieldContent>
                                        </Field>

                                        <Field orientation="horizontal" className="border rounded-lg p-4 bg-white items-center gap-4 cursor-pointer data-[state=checked]:border-black hover:border-black/50 transition-colors">
                                            <RadioGroupItem value="cod" id="cod" />
                                            <FieldContent className="flex-1">
                                                <FieldLabel htmlFor="cod" className="font-semibold cursor-pointer">Cash on Delivery</FieldLabel>
                                            </FieldContent>
                                        </Field>

                                    </RadioGroup>
                                )}
                            />
                        </FieldGroup>
                    </div>

                    <div className="pt-6">
                        <Button type="submit" size="lg" className="w-full text-base font-semibold h-14 rounded-full bg-black hover:bg-gray-900 transition-all text-white flex gap-2">
                            <Lock className="w-4 h-4" />
                            Pay LE {total.toFixed(2)}
                        </Button>
                    </div>
                </form>
            </div>

            {/* Right Column: Order Summary */}
            <div className="flex-1 lg:max-w-[40%]">
                <div className="sticky top-24 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-6">
                    <h2 className="text-xl font-bold tracking-tight text-gray-900">Order Summary</h2>

                    {cartItems.length > 0 ? (
                        <div className="flex flex-col gap-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex gap-4 items-center">
                                    <div className="w-16 h-20 relative bg-gray-50 rounded-md overflow-hidden shrink-0 border border-gray-100">
                                        {item.image && (
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        )}
                                        <div className="absolute -top-2 -right-2 bg-gray-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full z-10">
                                            {item.quantity}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-sm text-gray-900 truncate">{item.name}</h4>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {item.color} {item.color && item.size && "/"} {item.size}
                                        </p>
                                    </div>
                                    <div className="font-medium text-sm text-gray-900">
                                        LE {(item.price * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">Your cart is empty.</p>
                    )}

                    <div className="border-t border-gray-100 pt-6 space-y-3">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Subtotal</span>
                            <span className="font-medium text-gray-900">LE {subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Shipping</span>
                            <span className="font-medium text-gray-900">LE {shipping.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-6">
                        <div className="flex justify-between items-center text-lg">
                            <span className="font-bold text-gray-900">Total</span>
                            <div className="flex flex-col items-end">
                                <span className="text-xs text-gray-500 mb-1">EGP</span>
                                <span className="font-bold text-2xl text-gray-900">LE {total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
