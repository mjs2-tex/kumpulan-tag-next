import Image from 'next/image';
import Link from 'next/link';

interface TagCardProps {
  title: string;
  subTitle: string;
  imageUrl: string;
    urlSite?: string;
}

const CardTag = ({ title, subTitle, imageUrl, urlSite = '/manual' }: TagCardProps) => {
  return (
    <Link href={urlSite} className="group relative h-48 w-full overflow-hidden rounded-xl cursor-pointer shadow-lg transition-all duration-300 border border-white/10 hover:border-white/40">
      {/* Gambar Background */}
      <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-110">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
        />
      </div>

      {/* Overlay Gradasi agar teks terbaca */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100"></div>

      {/* Konten Teks */}
      <div className="absolute bottom-0 left-0 p-4 w-full">
        <h3 className="text-white font-bold text-sm md:text-base leading-tight">
          {title}
        </h3>
        <p className="text-white/70 text-[10px] md:text-xs mt-1 transform translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          {subTitle}
        </p>
      </div>
    </Link>
  );
};

export default CardTag;