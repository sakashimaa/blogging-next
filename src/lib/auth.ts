import { db } from '@/db'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import * as schema from '@/db/schema'
import { resend } from '@/lib/resend'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  user: {
    additionalFields: {
      avatarUrl: {
        type: 'string',
      },
      role: {
        type: 'string',
      },
    },
  },
  session: {
    additionalFields: {
      avatarUrl: {
        type: 'string',
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }, request) => {
      console.log('Verificating email!')
      try {
        const res = await resend.emails.send({
          from: 'onboarding@resend.dev',
          to: user.email,
          subject: 'Verify your email',
          html: `
          <p>Hi ${user.name},</p>
          <p>Thanks for signing up! Please verify your email by clicking the link below:</p>
          <a href="${url}">Verify Email</a>
        `,
        })

        console.log('Resend response:', res)
      } catch (error) {
        console.error('Error sending verification email:', error)
      }
      ;``
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
})
