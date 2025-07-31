import type { UserResponse, UserResponseWithActivity } from "@/interfaces/api/user-response"
import type { UserEntity, UserEntityWithActivity } from "@/interfaces/user"

export const userMapper = ({ user, token }: { user: UserResponse; token: string }): UserEntity => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    description: user.description,
    image: user.profilePic,
    active: user.active,
    wallet: user.wallet,
    social: {
      github: user.github,
      linkedIn: user.linkd,
      discord: user.discord,
      facebook: user.facebook,
      twitter: user.twitter,
      instagram: user.instagram,
      other: user.other,
    },
    conection: user.conection,
    roles: user.roles,
    token,
    skills: user.skills?.reduce<{ general: string[]; technical: string[] }>(
      (acc, skill) => {
        if (skill.type === "GENERAL") {
          acc.general.push(skill.name)
        } else {
          acc.technical.push(skill.name)
        }
        return acc
      },
      { general: [], technical: [] },
    ) || { general: [], technical: [] },
    initiatives: user.initiatives,
    totalVotes: user.totalVotes,
    totalInitiatives: user.totalInitiatives,
    totalComments: user.totalComments,
    votedInitiatives: user.votedInitiatives,
  }
}

export const userMapperWithActivity = (userData: UserResponseWithActivity): UserEntityWithActivity => {
  return {
    id: userData.user.id,
    name: userData.user.name,
    email: userData.user.email,
    description: userData.user.description,
    image: userData.user.profilePic,
    wallet: userData.user.wallet || "",
    social: {
      github: userData.user.github || "",
      linkedIn: userData.user.linkd || "",
      discord: userData.user.discord || "",
      facebook: userData.user.facebook || "",
      twitter: userData.user.twitter || "",
      instagram: userData.user.instagram || "",
      other: userData.user.other || "",
    },
    // skills: userData.user.skills?.reduce<{ general: string[]; technical: string[] }>(
    //   (acc, skill) => {
    //     if (skill.type === "GENERAL") {
    //       acc.general.push(skill.name)
    //     } else {
    //       acc.technical.push(skill.name)
    //     }
    //     return acc
    //   },
    //   { general: [], technical: [] },
    // ) || { general: [], technical: [] },
    votes: userData.votes,
    initiatives: userData.initiatives,
    comments: userData.comments,
    skills: userData.user.skills,
    participation: userData.participation?.map((p) => ({
      id: p.id,
      title: p.title,
      img: p.img,
      state: p.state,
      description: p.description,
      date: p.date,
      roles: p.roles,
    })),
  }
}
