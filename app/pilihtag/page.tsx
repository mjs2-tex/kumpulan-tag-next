"use client"
import CardTag from '@/components/manual/CardTag'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react' // 1. Import Suspense

// 2. Buat komponen terpisah untuk konten yang butuh searchParams
const PilihtagContent = () => {
    const searchParams = useSearchParams();
    const productionName = searchParams.get("production_name") || "";

    return (
        <div className="relative flex flex-col z-10 w-full max-w-xl p-8 bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20">
            <Link href="/" className='w-[80px] text-center bg-transparent border border-white/50 hover:bg-white/10 text-white font-semibold py-2 rounded-lg transition-all'>BACK</Link>
            <h2 className='text-center text-2xl mb-4'>PILIH JENIS TAG</h2>
            <div className='w-full h-full grid grid-cols-3 gap-1.5'>
                <CardTag
                    title="SABRINA"
                    subTitle="Latest Gadgets & Software"
                    imageUrl="/sabrina.png"
                    urlSite={`/pilihtag/sabrina?production_name=${productionName}`}
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

// 3. Halaman utama membungkus konten dengan Suspense
const Page = () => {
    return (
        <Suspense fallback={<div className="text-white">Loading...</div>}>
            <PilihtagContent />
        </Suspense>
    )
}

export default Page