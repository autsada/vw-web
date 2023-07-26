import Link from "next/link"
import { usePathname } from "next/navigation"
import React from "react"
import type { IconType } from "react-icons"

import { useAuthContext } from "@/context/AuthContext"

interface Props {
  name: string
  href: string
  ActiveIcon?: IconType
  InActiveIcon?: IconType
  isVertical?: boolean // If true the icon is above the name, default to false
  requiredAuth?: boolean
  requiredAuthText?: string
  withLink?: boolean
  isSubLink?: boolean
}

export default function ActiveLink({
  name,
  href,
  ActiveIcon,
  InActiveIcon,
  isVertical = false,
  requiredAuth = false,
  requiredAuthText,
  withLink = true,
  isSubLink,
}: Props) {
  const { onVisible: openAuthModal } = useAuthContext()

  return requiredAuth ? (
    <Body
      name={name}
      href={href}
      ActiveIcon={ActiveIcon}
      InActiveIcon={InActiveIcon}
      isVertical={isVertical}
      onClick={openAuthModal.bind(undefined, requiredAuthText)}
      isSubLink={isSubLink}
    />
  ) : !withLink ? (
    <Body
      name={name}
      href={href}
      ActiveIcon={ActiveIcon}
      InActiveIcon={InActiveIcon}
      isVertical={isVertical}
      isSubLink={isSubLink}
    />
  ) : (
    <Link href={href}>
      <Body
        name={name}
        href={href}
        ActiveIcon={ActiveIcon}
        InActiveIcon={InActiveIcon}
        isVertical={isVertical}
        isSubLink={isSubLink}
      />
    </Link>
  )
}

interface BodyProps {
  name: string
  href: string
  ActiveIcon?: IconType
  InActiveIcon?: IconType
  isVertical?: boolean // If true the icon is above the name, default to false
  onClick?: () => void
  isSubLink?: boolean
}

function Body({
  name,
  href,
  ActiveIcon,
  InActiveIcon,
  isVertical = false,
  onClick,
  isSubLink = false,
}: BodyProps) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <div
      className={`flex cursor-pointer items-center hover:bg-neutral-100 rounded-md ${
        isVertical
          ? "flex-col justify-center h-[70px]"
          : "flex-row px-2 h-[50px]"
      } ${isActive ? "bg-neutral-100" : "bg-white"}`}
      onClick={onClick}
    >
      {ActiveIcon && InActiveIcon && (
        <div
          className={`flex ${
            isVertical
              ? "h-[50%] w-full items-end"
              : "items-center h-full w-[50px]"
          }`}
        >
          {isActive ? (
            <ActiveIcon
              size={isVertical ? 22 : 24}
              className={`${isVertical ? "mb-0" : "mb-1"} mx-auto`}
            />
          ) : (
            <InActiveIcon
              size={isVertical ? 22 : 24}
              className={`${isVertical ? "mb-0" : "mb-1"} mx-auto`}
            />
          )}
        </div>
      )}
      <div className={`flex items-center ${isVertical ? "h-[50%]" : "h-full"}`}>
        {isVertical ? (
          isActive ? (
            <h6 className={isSubLink ? "text-xs" : "text-sm"}>{name}</h6>
          ) : (
            <p className={isSubLink ? "text-xs" : "text-sm"}>{name}</p>
          )
        ) : isActive ? (
          <h6 className={isSubLink ? "text-base" : "text-lg"}>{name}</h6>
        ) : (
          <p className={isSubLink ? "text-base" : "text-lg"}>{name}</p>
        )}
      </div>
    </div>
  )
}
