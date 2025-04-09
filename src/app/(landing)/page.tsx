import Image from 'next/image'

import RegisterForm from '@/features/events/components/register-form'

import flyer from '../../../public/images/flyer-web.png'

export default function Home() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="">
        <div className="flex size-full items-center justify-center">
          <Image
            src={flyer}
            alt="Picture of chess tornament flyer"
            priority
            className="w-10/12 sm:w-2/3 lg:w-4/5"
            placeholder="blur"
          />
        </div>
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xl ">
            <RegisterForm />
          </div>
        </div>
      </div>

    </div>
  )
}
