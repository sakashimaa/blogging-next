'use client'

import Link from 'next/link'
import { authClient } from '@/lib/auth-client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import GoogleAuthButton from '@/components/GoogleAuthButton'
import GithubAuthButton from '@/components/GithubAuthButton'

const Register = () => {
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    const result = await authClient.signUp.email({
      email,
      name,
      password,
    })

    setLoading(false)

    if (result.error) {
      console.error('Registration failed:', result.error)
      toast('Registration failed. Please try again.')
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } else {
      toast(
        'Registration successful! Confirm your email to access our service.'
      )
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-12 rounded-xl shadow-md w-full max-w-sm"
      >
        <h1 className="text-4xl font-bold mb-6 text-center text-black">
          Blogging
        </h1>
        <p className="text-xl my-8 text-center">Create your account</p>

        <label className="block mb-2">Name</label>
        <input
          type="text"
          className="border border-gray-200 p-2 rounded-md w-full mb-4 focus:border-gray-500 focus:outline-none"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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
          disabled={loading}
          className="
            w-full py-3 rounded-lg  
            bg-black text-white font-medium text-sm tracking-wide
            transition-all duration-200 ease-in-out
            hover:bg-gray-900 hover:shadow-md hover:cursor-pointer
            mb-5
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black
            active:scale-[0.98]
          "
        >
          {loading ? (
            <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin">
              Registering...
            </span>
          ) : (
            'Sign up'
          )}
        </button>

        <GoogleAuthButton />
        <GithubAuthButton />

        <p className="text-sm text-gray-600 text-center mb-8 mt-3">
          Already have an account?{' '}
          <Link href="/login" className="underline text-black font-bold">
            Sign in
          </Link>
        </p>

        <p className="text-xs text-gray-600 text-center">
          By signing up, you agree to our&nbsp;
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

export default Register
