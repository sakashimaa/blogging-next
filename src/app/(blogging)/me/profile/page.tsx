'use client'

import ProfileModal from '@/components/ProfileModal'
import { authClient } from '@/lib/auth-client'
import { trpc } from '@/lib/trpc'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

const Profile = () => {
  const { data: session, isPending: sessionPending } = authClient.useSession()
  const {
    data: user,
    isPending: userPending,
    error: userError,
    refetch,
  } = trpc.users.byId.useQuery(
    { id: session?.user?.id! },
    { enabled: !!session?.user?.id }
  )

  if (sessionPending || userPending) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="flex items-center space-x-6 mb-6">
            <Skeleton className="w-24 h-24 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </div>
    )
  }

  if (userError) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            Error Loading Profile
          </h2>
          <p className="text-red-600 mb-4">
            {userError.message || 'Failed to load your profile information'}
          </p>
          <Button onClick={() => refetch()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gray-50 border rounded-lg p-6 text-center">
          <p className="text-gray-600">No profile information found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-neutral-300">
        {/* Header */}
        <div className="px-8 py-6 border-b border-neutral-300">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
            <ProfileModal
              userId={user.id}
              currentName={user.name}
              currentAvatarUrl={user.avatarUrl}
              currentPronouns={user.pronouns || ''}
              currentBio={user.bio || ''}
              onSuccess={() => refetch()}
              triggerElement={
                <Button
                  variant="dark"
                  className="hover:opacity-80 transition-all"
                >
                  Edit Profile
                </Button>
              }
            />
          </div>
        </div>

        {/* Profile Content */}
        <div className="px-8 py-6">
          <div className="flex items-start space-x-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-full bg-orange-500 flex items-center justify-center text-white text-2xl font-semibold overflow-hidden">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user.name?.charAt(0)?.toUpperCase() || 'U'
                )}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {user.name}
                </h2>
                {user.pronouns && (
                  <p className="text-sm text-gray-500 mt-1">
                    Pronouns: {user.pronouns}
                  </p>
                )}
              </div>

              {user.bio && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{user.bio}</p>
                </div>
              )}

              <div className="pt-4 border-t border-neutral-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Email:</span>
                    <span className="ml-2 text-gray-600">{user.email}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">
                      Member since:
                    </span>
                    <span className="ml-2 text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
