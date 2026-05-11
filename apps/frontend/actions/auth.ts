"use server"

import { SignUpFormData } from "@/lib/validations"

export async function signUpAction(data: SignUpFormData) {
  const apiUrl = process.env.API_URL || "http://localhost:4000/api"
  
  try {
    const response = await fetch(`${apiUrl}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.message || "Something went wrong during registration.",
      }
    }

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    console.error("Signup error:", error)
    return {
      success: false,
      error: "Failed to connect to the server. Please try again later.",
    }
  }
}

export async function loginAction(data: any) {
  const apiUrl = process.env.API_URL || "http://localhost:4000/api"

  try {
    const response = await fetch(`${apiUrl}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.message || "Invalid email or password.",
      }
    }

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    console.error("Login error:", error)
    return {
      success: false,
      error: "Failed to connect to the server. Please try again later.",
    }
  }
}
