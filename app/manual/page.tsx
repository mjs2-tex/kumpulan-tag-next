import CardTag from '@/components/manual/CardTag'
import Link from 'next/link'
import React from 'react'

const page = () => {
    return (
        <div className="relative flex flex-col z-10 w-full max-w-xl p-8 bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20">
            <Link href="/" className='w-[80px] text-center bg-transparent border border-white/50 hover:bg-white/10 text-white font-semibold py-2 rounded-lg transition-all'>BACK</Link>
            <h2 className='text-center text-2xl'>PILIH JENIS TAG</h2>
            <div className='w-full h-full grid grid-cols-3 gap-1.5'>
                <CardTag
                    title="SABRINA"
                    subTitle="Latest Gadgets & Software"
                    imageUrl="/sabrina.png"
                />
                <CardTag
                    title="AFQ"
                    subTitle="Daily Habits & Tips"
                    imageUrl="https://images.unsplash.com/photo-1511764904403-9df25824981a"
                />
                <CardTag
                    title="Nature"
                    subTitle="Explore the Wild"
                    imageUrl="https://images.unsplash.com/photo-1441974231531-c6227db76b6e"
                />
            </div>
        </div>
    )
}

export default page