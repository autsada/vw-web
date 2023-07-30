import { notFound, redirect } from "next/navigation"

import { getShort } from "@/graphql"

type Props = {
  params: { id: string }
}

export default async function Page({ params }: Props) {
  const publishId = params.id
  const publish = await getShort({
    targetId: publishId,
  })

  if (!publish) {
    notFound()
  } else {
    if (publish.publishType === "Short") {
      redirect(`/shorts?id=${publish.id}`)
    } else {
      redirect(`/watch/${publish.id}`)
    }
  }
}
