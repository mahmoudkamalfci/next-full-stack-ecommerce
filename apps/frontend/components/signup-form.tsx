"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import Link from "next/link"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signUpSchema, type SignUpFormData } from "@/lib/validations"
import { Eye, EyeOff } from "lucide-react"
import { signUpAction } from "@/actions/auth"
import { useRouter } from "next/navigation"

export function SignUpForm({
    className,
}: React.ComponentPropsWithoutRef<"form">) {
    const [isPending, startTransition] = useTransition()
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
        mode: "onBlur",
    })

    const onSubmit = (data: SignUpFormData) => {
        setErrorMessage(null)
        setSuccessMessage(null)
        
        startTransition(async () => {
            try {
                const result = await signUpAction(data)
                
                if (result.success) {
                    setSuccessMessage("Account created successfully! Redirecting...")
                    // Redirect to login or home after a short delay
                    setTimeout(() => {
                        router.push("/login")
                    }, 2000)
                } else {
                    setErrorMessage(result.error || "Signup failed")
                }
            } catch (error) {
                setErrorMessage("An unexpected error occurred. Please try again.")
            }
        })
    }

    return (
        <form
            className={cn("flex flex-col gap-6", className)}
            onSubmit={(e) => {
                void handleSubmit(onSubmit)(e)
            }}
        >
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Create an account</h1>
                <p className="text-balance text-sm text-muted-foreground">
                    Enter your information below to create your account
                </p>
            </div>

            {successMessage && (
                <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
                    {successMessage}
                </div>
            )}

            {errorMessage && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                    {errorMessage}
                </div>
            )}

            <div className="grid gap-6">
                <div className="grid grid-cols-2 gap-4">
                    <Field>
                        <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                        <Input
                            id="firstName"
                            type="text"
                            placeholder="John"
                            aria-invalid={!!errors.firstName}
                            {...register("firstName")}
                        />
                        <FieldError errors={[errors.firstName]} />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                        <Input
                            id="lastName"
                            type="text"
                            placeholder="Doe"
                            aria-invalid={!!errors.lastName}
                            {...register("lastName")}
                        />
                        <FieldError errors={[errors.lastName]} />
                    </Field>
                </div>

                <Field>
                    <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                    <Input
                        id="phone"
                        type="tel"
                        placeholder="+201004022469"
                        aria-invalid={!!errors.phone}
                        {...register("phone")}
                    />
                    <FieldError errors={[errors.phone]} />
                </Field>

                <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        aria-invalid={!!errors.email}
                        {...register("email")}
                    />
                    <FieldError errors={[errors.email]} />
                </Field>

                <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <InputGroup>
                        <InputGroupInput
                            id="password"
                            type={showPassword ? "text" : "password"}
                            aria-invalid={!!errors.password}
                            {...register("password")}
                        />
                        <InputGroupAddon align="inline-end">
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-muted-foreground hover:text-foreground focus:outline-none"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </InputGroupAddon>
                    </InputGroup>
                    <FieldError errors={[errors.password]} />
                </Field>

                <Field>
                    <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                    <InputGroup>
                        <InputGroupInput
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            aria-invalid={!!errors.confirmPassword}
                            {...register("confirmPassword")}
                        />
                        <InputGroupAddon align="inline-end">
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="text-muted-foreground hover:text-foreground focus:outline-none"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </InputGroupAddon>
                    </InputGroup>
                    <FieldError errors={[errors.confirmPassword]} />
                </Field>

                <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? "Creating account..." : "Sign Up"}
                </Button>

                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                    <span className="relative z-10 bg-background px-2 text-muted-foreground">
                        Or continue with
                    </span>
                </div>

                <Button variant="outline" className="w-full" type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path
                            d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                            fill="currentColor"
                        />
                    </svg>
                    Sign up with GitHub
                </Button>
            </div>

            <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="underline underline-offset-4">
                    Login
                </Link>
            </div>
        </form>
    )
}
