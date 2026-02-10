"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/lib/validations"

export function ForgotPasswordForm({
    className,
}: React.ComponentPropsWithoutRef<"form">) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        mode: "onBlur",
    })

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setIsSubmitting(true)
        try {
            // TODO: Implement actual forgot password logic with your backend
            console.log("Forgot password data:", data)
            setSuccessMessage("Password reset link sent! Check your email.")
        } catch {
            console.error("Forgot password failed")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form
            className={cn("flex flex-col gap-6", className)}
            onSubmit={(e) => {
                void handleSubmit(onSubmit)(e)
            }}
        >
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Forgot your password?</h1>
                <p className="text-balance text-sm text-muted-foreground">
                    Enter your email address and we&apos;ll send you a link to reset your password
                </p>
            </div>

            {successMessage && (
                <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
                    {successMessage}
                </div>
            )}

            <div className="grid gap-6">
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        className={errors.email ? "border-red-500" : ""}
                        {...register("email")}
                    />
                    {errors.email && (
                        <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send Reset Link"}
                </Button>
            </div>

            <div className="text-center text-sm">
                Remember your password?{" "}
                <Link href="/login" className="underline underline-offset-4">
                    Back to Login
                </Link>
            </div>
        </form>
    )
}
