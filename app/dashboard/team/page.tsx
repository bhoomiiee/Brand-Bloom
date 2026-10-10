import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentStore, getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, UserPlus, Crown, User as UserIcon } from 'lucide-react'
import { TeamMembersList } from '@/components/team/team-members-list'
import { InviteTeamMember } from '@/components/team/invite-team-member'

export const metadata: Metadata = {
  title: 'Team | BrandBloom',
  description: 'Manage your team members and permissions',
}

async function getTeamMembers(storeId: string) {
  const memberships = await prisma.membership.findMany({
    where: { storeId },
    include: {
      user: true,
    },
    orderBy: { createdAt: 'asc' },
  })

  return memberships
}

export default async function TeamPage() {
  const [store, user] = await Promise.all([
    getCurrentStore(),
    getCurrentUser(),
  ])

  if (!store || !user) {
    redirect('/onboarding')
  }

  // Check if user is owner
  const userMembership = await prisma.membership.findFirst({
    where: {
      storeId: store.id,
      userId: user.id,
    },
  })

  const isOwner = userMembership?.role === 'OWNER'
  const teamMembers = await getTeamMembers(store.id)

  const ownerCount = teamMembers.filter((m) => m.role === 'OWNER').length
  const staffCount = teamMembers.filter((m) => m.role === 'STAFF').length

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#3D202B]">Team</h1>
          <p className="text-sm font-medium text-[#806B73] mt-1">
            Manage team members and store access roles
          </p>
        </div>
        {isOwner && <InviteTeamMember storeId={store.id} />}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-6 rounded-2xl bg-white border border-[#E8DDE0] shadow-2xs">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#F1D9DF] flex items-center justify-center text-[#632D40]">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#806B73] mb-1">Total Members</p>
          <p className="text-3xl font-extrabold text-[#3D202B]">{teamMembers.length}</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E8DDE0] shadow-2xs">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#F1D9DF] flex items-center justify-center text-[#BD7C91]">
              <Crown className="h-5 w-5" />
            </div>
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#806B73] mb-1">Owners</p>
          <p className="text-3xl font-extrabold text-[#3D202B]">{ownerCount}</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E8DDE0] shadow-2xs">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#F1D9DF] flex items-center justify-center text-[#632D40]">
              <UserIcon className="h-5 w-5" />
            </div>
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#806B73] mb-1">Staff</p>
          <p className="text-3xl font-extrabold text-[#3D202B]">{staffCount}</p>
        </div>
      </div>

      {/* Roles & Permissions Info */}
      {isOwner && (
        <div className="p-6 rounded-2xl bg-[#F1D9DF]/50 border border-[#BD7C91]/30 text-[#3D202B]">
          <h3 className="font-bold text-base mb-2 text-[#632D40]">Roles & Permissions</h3>
          <div className="space-y-2 text-xs leading-relaxed text-[#3D202B]">
            <div>
              <strong className="font-bold text-[#632D40]">Owner:</strong> Full access to all administrative capabilities including team invites, settings, and themes.
            </div>
            <div>
              <strong className="font-bold text-[#632D40]">Staff:</strong> Can manage products, orders, and customer queries. Cannot alter team permissions or billing.
            </div>
          </div>
        </div>
      )}

      {/* Team Members List */}
      <div className="p-6 rounded-2xl bg-white border border-[#E8DDE0] shadow-2xs">
        <h2 className="text-lg font-bold text-[#3D202B] mb-5">Team Members</h2>
        <TeamMembersList
          members={teamMembers}
          currentUserId={user.id}
          isOwner={isOwner}
        />
      </div>
    </div>
  )
}
