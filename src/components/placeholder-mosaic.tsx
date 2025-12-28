import Image from 'next/image';

type PlaceholderMosaicProps = {
    images: typeof import('@/lib/placeholder-images.json')['placeholderImages'];
};

export default function PlaceholderMosaic({ images }: PlaceholderMosaicProps) {
    return (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 p-4">
            {images.map((image, index) => {
                // Deterministically assign varying aspect ratios based on index
                const aspectRatios = [
                    'aspect-[3/4]', // Portrait (Tall)
                    'aspect-[1]',   // Square
                    'aspect-[4/3]', // Landscape
                    'aspect-[3/5]', // Taller Portrait
                ];
                const ratioClass = aspectRatios[index % aspectRatios.length];

                return (
                    <div key={image.id} className="break-inside-avoid relative group rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                        <div className={`relative w-full ${ratioClass}`}>
                            <Image
                                src={image.imageUrl}
                                alt={image.description}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover rounded-2xl transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-2xl">
                                <p className="text-white text-center px-4 font-medium font-headline transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    {image.description}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
