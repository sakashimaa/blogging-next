'use client'

import { authClient } from '@/lib/auth-client'

const GithubAuthButton = () => {
  const handleSignIn = () => {
    authClient.signIn.social({
      provider: 'github',
    })
  }

  return (
    <button
      type="button"
      onClick={handleSignIn}
      onMouseUp={(e) => e.currentTarget.blur()}
      className="btn-pressable btn-active-shadow relative flex items-center justify-center w-full h-10 mb-3 rounded-[20px] border border-gray-300 bg-white text-black font-medium text-sm tracking-wide transition-all duration-200 cursor-pointer hover:bg-gray-50 hover:shadow-sm hover:-translate-y-0.5 active:outline-none active:scale-[0.96] active:translate-y-0 active:border-none focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
    >
      <span className="absolute left-4 flex items-center justify-center w-5 h-5">
        <img src="/images/github-mark.svg" alt="GitHub" className="w-5 h-5" />
      </span>
      <span className="pointer-events-none select-none">Continue with GitHub</span>
    </button>
  )
}

export default GithubAuthButton
