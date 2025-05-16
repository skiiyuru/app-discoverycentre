import { SignIn } from '@clerk/nextjs'
import Image from 'next/image'

import logo from '../../../../../public/images/tdc-logo.png'

export default function Page() {
  return (
    <div className="h-screen flex flex-col gap-20 justify-center items-center">
      <Image
        src={logo}
        alt="Picture of company logo"
        priority
        className="w-1/2 md:w-1/3 lg:w-1/4"
        placeholder="blur"
      />
      <SignIn />
    </div>
  )
}
