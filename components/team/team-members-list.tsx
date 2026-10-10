'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Crown, User as UserIcon, Mail, Trash2, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Member = {
  id: string
  role: string
  userId: string
  user: {
    id: string
    name: string | null
    email: string
  }
  createdAt: Date
}

type Props = {
  members: Member[]
  currentUserId: string
  isOwner: boolean
}

export function TeamMembersList({ members, currentUserId, isOwner }: Props) {
  const router = useRouter()
  const [removingId, setRemovingId] = useState<string | null>(null)

  const handleRemoveMember = async (membershipId: string) => {
    if (!confirm('Are you sure you want to remove this team member? They will lose access to the store immediately.')) {
      return
    }

    setRemovingId(membershipId)

    try {
      const response = await fetch('/api/team/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ membershipId }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to remove member')
      }

      router.refresh()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to remove member')
    } finally {
      setRemovingId(null)
    }
  }

  if (members.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Users className="h-16 w-16 mx-auto mb-4 opacity-30" />
        <p>No team members yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {members.map((member) => {
        const isCurrentUser = member.userId === currentUserId
        const canRemove = isOwner && !isCurrentUser && member.role !== 'OWNER'

        return (
          <div
            key={member.id}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                {member.user.name?.[0]?.toUpperCase() || member.user.email[0].toUpperCase()}
              </div>

              {/* Info */}
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">
                    {member.user.name || 'No name set'}
                  </p>
                  {isCurrentUser && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      You
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  {member.user.email}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Role Badge */}
              {member.role === 'OWNER' ? (
                <div className="flex items-center gap-2 bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full text-sm font-medium">
                  <Crown className="h-4 w-4" />
                  Owner
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full text-sm font-medium">
                  <UserIcon className="h-4 w-4" />
                  Staff
                </div>
              )}

              {/* Remove Button */}
              {canRemove && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveMember(member.id)}
                  disabled={removingId === member.id}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
