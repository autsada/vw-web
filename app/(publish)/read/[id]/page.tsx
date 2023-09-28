import React from "react"
import { notFound, redirect } from "next/navigation"
import { BsDot } from "react-icons/bs"
import type { Metadata, ResolvingMetadata } from "next"

import Avatar from "@/components/Avatar"
import ProfileName from "@/components/ProfileName"
import Link from "next/link"
import ManageFollow from "@/components/ManageFollow"
import Reactions from "./Reactions"
import Content from "./Content"
import BlogComments from "./BlogComments"
import { getAccount } from "@/lib/server"
import { fetchComments, getProfileById, getWatchingPublish } from "@/graphql"
import { calculateTimeElapsed, formatDate } from "@/lib/client"

type Props = {
  params: { id: string }
}

export async function generateMetadata(
  { params }: Props,
  parent?: ResolvingMetadata
): Promise<Metadata> {
  // Query a publish
  const publish = await getWatchingPublish({
    targetId: params.id,
  })

  const imageUrl = publish?.thumbnail || ""

  return {
    title: publish?.title || "",
    description: publish?.blog?.excerpt || "",
    openGraph: {
      title: publish?.title || "",
      description: publish?.blog?.excerpt || "",
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 600,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      title: publish?.title || "",
      description: publish?.blog?.excerpt || "",
      card: "summary_large_image",
      site: "@DiiRxyz",
      creator: "@DiiRxyz",
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: publish?.title || "",
        },
      ],
    },
    robots: {
      index: false,
      follow: true,
      nocache: true,
      googleBot: {
        index: true,
        follow: false,
        noimageindex: true,
        "max-video-preview": -1,
        "max-image-preview": "standard",
        "max-snippet": -1,
      },
    },
  }
}

export default async function Read({ params }: Props) {
  const data = await getAccount()
  const account = data?.account

  // Query profile by id
  const profile =
    account && account.defaultProfile
      ? await getProfileById(account?.defaultProfile?.id)
      : null

  // Query a publish
  const publish = await getWatchingPublish({
    targetId: params.id,
    requestorId: profile?.id,
  })

  if (!publish) {
    notFound()
  }

  if (publish.publishType === "Short") {
    redirect(`/shorts?id=${publish.id}`)
  }

  if (publish.publishType === "Video") {
    redirect(`/watch/${publish.id}`)
  }

  // Fetch blog comments
  const commentsResult = await fetchComments({
    publishId: publish.id,
    requestorId: profile?.id,
    cursor: null,
    orderBy: "counts",
  })

  return (
    <div className="h-max min-h-full w-full lg:px-5 sm:w-[80%] md:w-[600px] lg:w-[700px] xl:w-[800px] mx-auto pb-20">
      {publish.thumbnail && (
        <div className="mb-2 sm:mb-3 md:mb-4 lg:mb-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={publish.thumbnail}
            alt={publish.title || publish.filename || "ViewWit blog"}
            className="w-full h-[200px] md:h-[300px] lg:h-[320px] xl:h-[350px] object-cover"
          />
        </div>
      )}
      <div className="w-full p-2">
        <div className="w-full flex items-stretch gap-x-2">
          <Avatar profile={publish.creator} />
          <div className="flex-grow text-left">
            <ProfileName profile={publish.creator} />
            <p className="font-light text-textLight text-sm sm:text-base">
              {calculateTimeElapsed(publish.createdAt)}
            </p>
          </div>
          <ManageFollow
            isAuthenticated={!!account}
            follow={publish.creator}
            ownerHref={`/upload/${publish.id}`}
            ownerLinkText="Edit"
          />
        </div>

        <div className="mb-2 py-4 w-full overflow-x-auto scrollbar-hide">
          <Reactions
            isAuthenticated={!!account}
            account={account}
            publish={publish}
          />
        </div>

        <div className="w-full">
          <div className="mb-2 flex items-center gap-x-2">
            <p className="italic font-light text-textLight text-sm">
              Posted on {formatDate(new Date())}{" "}
            </p>
            <BsDot />
            <p className="font-light text-sm">{publish.blog?.readingTime}</p>
          </div>
          <div className="mb-4">
            <h1 className="mb-1 text-3xl md:text-4xl xl:text-5xl xl:leading-[3.5rem]">
              {publish.title}
            </h1>
            {publish.tags && publish.tags.split(" ").length > 0 && (
              <div className="w-max flex items-center gap-4 cursor-pointer">
                {publish.tags.split(" | ").map((tag) => (
                  <Link key={tag} href={`/tag/${tag}`}>
                    <div className="text-textLight px-2 py-1 rounded-full cursor-pointer hover:bg-neutral-100">
                      #{tag}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <Content content={publish.blog?.htmlContent || ""} />

        <BlogComments
          isAuthenticated={!!account}
          publish={publish}
          profile={profile}
          fetchResult={commentsResult}
        />
      </div>
    </div>
  )
}
