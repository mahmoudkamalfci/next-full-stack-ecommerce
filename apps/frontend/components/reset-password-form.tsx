"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { resetPasswordSchema, type ResetPasswordFormData } from "@/lib/validations"
import { resetPasswordAction } from "@/actions/auth"

export function ResetPasswordForm({
    className,
}: React.ComponentPropsWithoutRef<"form">) {
    const [isPending, startTransition] = useTransition()
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const searchParams = useSearchParams()
    const router = useRouter()

    const token = searchParams.get("token")

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        mode: "onBlur",
    })

    const onSubmit = (data: ResetPasswordFormData) => {
        setErrorMessage(null)
        setSuccessMessage(null)

        if (!token) {
            setErrorMessage("Invalid or missing password reset token.")
            return
        }

        startTransition(async () => {
            try {
                const result = await resetPasswordAction({ ...data, token })

                if (result.success) {
                    setSuccessMessage("Password reset successful! Redirecting to login...")
                    setTimeout(() => {
                        router.push("/login")
                    }, 2000)
                } else {
                    setErrorMessage(result.error || "Failed to reset password")
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

            {errorMessage && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                    {errorMessage}
                </div>
            )}

            <div className="grid gap-6">
                <div className="grid gap-2">
                    <Label htmlFor="password">New Password</Label>
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
                    {errors.password && (
                        <p className="text-sm text-red-500">{errors.password.message}</p>
                    )}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
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
                    {errors.confirmPassword && (
                        <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                    )}
                </div>

                <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? "Resetting..." : "Reset Password"}
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
