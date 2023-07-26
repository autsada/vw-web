import "./globals.css"

import AppLayoutServer from "@/components/nav/AppLayoutServer"
import AuthContextProvider from "@/context/AuthContext"
import WalletClient from "./WalletClient"
import { BASE_URL } from "@/lib/constants"

const basicMetadata = {
  title: {
    template: "%s - VW",
    default: "VW",
  },
  description: "Content sharing platform for everyone.",
}

export const metadata = {
  metadataBase: new URL(BASE_URL!),
  ...basicMetadata,
  icons: {
    icon: "/favicon/favicon.ico",
    shortcut: "/favicon/favicon.ico",
    apple: "/favicon/favicon.ico",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/favicon/favicon.ico",
    },
  },
  openGraph: {
    ...basicMetadata,
    url: "https://www.vewwit.xyz",
    siteName: "vewwit.xyz",
    images: [
      {
        url: process.env.LOGO_URL!,
        width: 800,
        height: 600,
        alt: "VW Logo",
      },
    ],
    locale: "en_US",

    type: "website",
  },
  twitter: {
    ...basicMetadata,
    card: "summary_large_image",
    site: "@vwxyz",
    creator: "@vwxyz",
    images: [
      {
        url: process.env.LOGO_URL!,
        width: 800,
        height: 600,
        alt: "VW Logo",
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
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://www.vewwit.xyz",
    media: {
      "only screen and (max-width: 639px)": "https://m.vewwit.xyz",
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="text-textRegular">
        <AuthContextProvider>
          <WalletClient>
            <AppLayoutServer />

            <div className="min-h-screen overflow-y-auto">{children}</div>
          </WalletClient>
        </AuthContextProvider>
      </body>
    </html>
  )
}
