import { SignOutButton } from '@clerk/nextjs'
import Image from 'next/image'

import logo from '../../../public/images/tdc-logo.png'

export default function Layout({
  children,
}: {
  children: Readonly<React.ReactNode>
}) {
  return (
    <>
      <header className="flex bg-accent justify-between p-2 md:p-4">
        <Image
          src={logo}
          alt="Picture of company logo"
          priority
          className="w-24"
          placeholder="blur"
        />
        <SignOutButton />
      </header>
      <section className="p-4">{children}</section>
    </>
  )
}
