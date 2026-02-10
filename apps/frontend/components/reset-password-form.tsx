"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { resetPasswordSchema, type ResetPasswordFormData } from "@/lib/validations"

export function ResetPasswordForm({
    className,
}: React.ComponentPropsWithoutRef<"form">) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        mode: "onBlur",
    })

    const onSubmit = async (data: ResetPasswordFormData) => {
        setIsSubmitting(true)
        try {
            // TODO: Implement actual reset password logic with your backend
            console.log("Reset password data:", data)
            setSuccessMessage("Password reset successful!")
        } catch {
            console.error("Reset password failed")
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
                <h1 className="text-2xl font-bold">Reset your password</h1>
                <p className="text-balance text-sm text-muted-foreground">
                    Enter your new password below
                </p>
            </div>

            {successMessage && (
                <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
                    {successMessage}
                </div>
            )}

            <div className="grid gap-6">
                <div className="grid gap-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input
                        id="password"
                        type="password"
                        className={errors.password ? "border-red-500" : ""}
                        {...register("password")}
                    />
                    {errors.password && (
                        <p className="text-sm text-red-500">{errors.password.message}</p>
                    )}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                        id="confirmPassword"
                        type="password"
                        className={errors.confirmPassword ? "border-red-500" : ""}
                        {...register("confirmPassword")}
                    />
                    {errors.confirmPassword && (
                        <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                    )}
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Resetting..." : "Reset Password"}
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
