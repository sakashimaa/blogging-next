'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { invalidCredentials } from '@/constants/auth-errors'
import GoogleAuthButton from '@/components/GoogleAuthButton'
import GithubAuthButton from '@/components/GithubAuthButton'

const Login = () => {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    const result = await authClient.signIn.email({
      email,
      password,
    })

    setLoading(false)

    if (result.error) {
      setEmail('')
      setPassword('')

      if (result.error.code === invalidCredentials) {
        // how to set toast type
        toast.error('Invalid email or password. Please try again.', { duration: 4000 })
        return
      }
      console.error('Login failed:', result.error)
      toast('Login failed. Please try again.')
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } else {
      if (!result.data.user.emailVerified) {
        toast('Please verify your email address to continue.', { duration: 4000 })
        return
      }

      toast('Login successful! Redirecting to home page...')
      setTimeout(() => {
        router.push('/')
      }, 2000)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-12 rounded-xl shadow-md w-full max-w-sm">
        <h1 className="text-4xl font-bold mb-6 text-center text-black">Blogging</h1>
        <p className="text-xl my-8">Welcome</p>

        <label className="block mb-2">E-mail</label>
        <input
          type="email"
          className="border border-gray-200 p-2 rounded-md w-full mb-4 focus:border-gray-500 focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="block mb-2">Password</label>
        <input
          type="password"
          className="border border-gray-200 p-2 rounded-md w-full mb-4 focus:border-gray-500 focus:outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          onMouseUp={(e) => e.currentTarget.blur()}
          disabled={loading}
          className={`
            ${loading ? 'opacity-50 cursor-not-allowed' : ''}
            w-full h-10 rounded-[20px]
            bg-black text-white font-medium text-sm tracking-wide
            transition-all duration-200 ease-out
            hover:bg-gray-900 hover:shadow-md hover:-translate-y-0.5 cursor-pointer
            mb-5
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black
            active:scale-[0.97] active:translate-y-0
          `}
        >
          {loading ? 'Continuing...' : 'Continue'}
        </button>

        <GoogleAuthButton />
        <GithubAuthButton />

        <p className="text-xm text-gray-600 text-center mb-8 mt-3">
          New to Blogging?{' '}
          <Link href="/register" className="underline text-black font-bold">
            Sign up
          </Link>
        </p>

        <p className="text-xs text-gray-600 text-center">
          By continuing, you agree to our&nbsp;
          <Link href="/terms" className="underline text-black font-bold">
            Terms
          </Link>
          &nbsp;and&nbsp;
          <Link href="/privacy" className="underline text-black font-bold">
            Privacy Policy.
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Login
