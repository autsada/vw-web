import React from "react"

// Template to display while rendering client component
export default function ManageProfilesTemplate() {
  return (
    <div className="mt-5">
      <h6 className="text-lg sm:text-xl">Manage profiles</h6>
      <button className="btn-blue px-6 mx-0 my-5 rounded-full">
        Create new profile
      </button>

      <p>All profiles</p>
      <div className="py-2 px-2 sm:px-4 flex items-center cursor-pointer rounded-lg bg-gray-100">
        <div className="flex items-center justify-center rounded-full overflow-hidden cursor-pointer w-[50px] min-w-[50px] h-[50px] min-h-[50px] bg-orangeDark opacity-30"></div>
        <div className="ml-5 flex-grow">
          <p className="opacity-10">VW</p>
          <p className="text-textExtraLight opacity-10">@vw</p>
          <div className="flex items-center gap-x-2 mt-1 opacity-10">
            <p className="font-light text-textExtraLight">
              <span className="text-textRegular opacity-5">4</span> Followers
            </p>
            <p className="font-light text-textExtraLight">
              <span className="text-textRegular opacity-5">12</span> Following
            </p>
            <p className="font-light text-textExtraLight">
              <span className="text-textRegular opacity-5">5</span> Publishes
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
