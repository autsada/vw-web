import React from "react"
import { AiOutlineSend } from "react-icons/ai"

import Avatar from "@/components/Avatar"
import ProfileName from "@/components/ProfileName"
import type { Profile } from "@/graphql/codegen/graphql"

interface Props {
  profile: Profile
}

export default function Chats({ profile }: Props) {
  return (
    <div className="w-full h-full flex flex-col justify-stretch items-stretch">
      <div className="w-full flex-grow p-2">
        <div className="h-full w-full overflow-y-auto">Chats</div>
      </div>
      <div className="h-[100px] min-h-[100px] w-full p-2 bg-neutral-800">
        <div className="flex gap-x-2">
          <Avatar profile={profile} width={30} height={30} />
          <div className="px-2 py-[2px] bg-orangeBase rounded-md h-max flex items-center justify-center">
            <ProfileName profile={profile} withLink={false} fontSize="sm" />
          </div>
        </div>
        <div className="flex mt-4 pr-6 relative">
          <input
            name=""
            id=""
            placeholder="Chat..."
            className="w-full bg-neutral-800 border-b border-neutral-300 text-neutral-300"
          />
          <div className="absolute right-0 h-full w-max">
            <AiOutlineSend
              size={24}
              className="text-neutral-300 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
