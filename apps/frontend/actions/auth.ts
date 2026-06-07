"use server"

import { LoginFormData, SignUpFormData, ForgotPasswordFormData, ResetPasswordFormData } from "@/lib/validations"
import { fetchApi } from "../helpers/api"
import { cookies } from "next/headers"

export async function signUpAction(data: SignUpFormData) {
  try {
    const response = await fetchApi("/users/register", {
      method: "POST",
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      }),
    })

    const result = await response.json()

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    console.error("Signup error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to connect to the server. Please try again later.",
    }
  }
}

export async function loginAction(data: LoginFormData) {
  try {
    const response = await fetchApi("/users/login", {
      method: "POST",
      body: JSON.stringify(data),
    })

    const result = await response.json()

    console.log("Login result:", result)

    if (result.token) {
      const cookieStore = await cookies()
      cookieStore.set("token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week
      })
    }

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    console.error("Login error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to connect to the server. Please try again later.",
    }
  }
}

export async function forgotPasswordAction(data: ForgotPasswordFormData) {
  try {
    const response = await fetchApi("/users/forgot-password", {
      method: "POST",
      body: JSON.stringify(data),
    })

    const result = await response.json()

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    console.error("Forgot password error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to connect to the server. Please try again later.",
    }
  }
}

export async function resetPasswordAction(data: ResetPasswordFormData & { token: string }) {
  try {
    const response = await fetchApi("/users/reset-password", {
      method: "POST",
      body: JSON.stringify({
        token: data.token,
        password: data.password,
      }),
    })

    const result = await response.json()

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    console.error("Reset password error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to connect to the server. Please try again later.",
    }
  }
}
