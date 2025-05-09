'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import FadeIn from '@/components/animations/FadeIn';
import FadeInLeft from '@/components/animations/FadeInLeft';
import FadeInRight from '@/components/animations/FadeInRight';
import FadeInDown from '@/components/animations/FadeInDown';


interface GalleryItem {
  id: number;
  image_url: string;
  caption: string | null;
  uploaded_at: string;
  featured: boolean;
}

export default function GallerySection() {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (!error && data) {
        setImages(data);
      }

      setLoading(false);
    };

    fetchGallery();
  }, []);

  const openModal = (index: number) => setActiveIndex(index);
  const closeModal = () => setActiveIndex(null);
  const next = () => setActiveIndex((prev) => (prev !== null ? (prev + 1) % images.length : null));
  const prev = () =>
    setActiveIndex((prev) =>
      prev !== null ? (prev - 1 + images.length) % images.length : null
    );

  if (loading) return <p className="text-center py-20">Loading gallery...</p>;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <FadeInDown>
          <h1 className="text-4xl font-bold text-center text-red-600 mb-16">
            Gallery
          </h1>
        </FadeInDown>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {images.map((item, index) => {
          let Wrapper;

          if (index % 3 === 0) Wrapper = FadeInLeft;
          else if (index % 3 === 2) Wrapper = FadeInRight;
          else Wrapper = FadeIn;

          return (
            <Wrapper key={item.id} delay={index * 0.1}>
              <div
                className="rounded-lg shadow-md overflow-hidden cursor-pointer bg-white"
                onClick={() => openModal(index)}
              >
                <img
                  src={item.image_url}
                  alt={item.caption ?? 'Gallery image'}
                  className="w-full max-h-[500px] object-contain bg-gray-100"
                />
                {item.caption && (
                  <div className="p-4 text-gray-700 text-center text-sm">
                    {item.caption}
                  </div>
                )}
              </div>
            </Wrapper>
          );
        })}
        </div>
      </div>

      {/* Modal */}
      {activeIndex !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-[9999] flex items-center justify-center px-4"
          onClick={closeModal}
        >
          <div
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white text-2xl font-bold"
            >
              &times;
            </button>
            <img
              src={images[activeIndex].image_url}
              alt={images[activeIndex].caption ?? ''}
              className="w-full max-h-[80vh] object-contain rounded"
            />
            {images[activeIndex].caption && (
              <div className="text-white text-center mt-4 text-sm">
                {images[activeIndex].caption}
              </div>
            )}
            <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
              <button
                onClick={prev}
                className="text-white text-3xl font-bold hover:scale-125 transition"
              >
                &#8592;
              </button>
            </div>
            <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
              <button
                onClick={next}
                className="text-white text-3xl font-bold hover:scale-125 transition"
              >
                &#8594;
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
