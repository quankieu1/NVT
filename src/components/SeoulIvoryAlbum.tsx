"use client";

import Image from "next/image";
import { useState } from "react";
import type { PhotoItem } from "../data/wedding-config";
import { cropStyles } from "../lib/wedding-utils";
import { PhotoLightbox } from "./PhotoLightbox";
import { SeoulIvorySectionHeading } from "./SectionHeading";

function AlbumTile({
  photo,
  photoIndex,
  aspect,
  sizes,
  radius,
  className,
  delayMs = 0,
  onOpen,
}: {
  photo: PhotoItem;
  photoIndex: number;
  aspect: string;
  sizes: string;
  radius?: string;
  className?: string;
  delayMs?: number;
  onOpen: (idx: number) => void;
}) {
  const styles = cropStyles(photo.crop, "center");
  return (
    <button
      type="button"
      onClick={() => onOpen(photoIndex)}
      data-reveal="scale"
      style={
        {
          "--reveal-delay": `${delayMs}ms`,
          borderRadius: radius,
        } as React.CSSProperties
      }
      className={`si-album-item group block w-full ${className ?? ""}`}
      aria-label={`Xem ảnh ${photoIndex + 1} phóng to`}
    >
      <span
        className="relative block w-full overflow-hidden"
        style={{ aspectRatio: aspect, borderRadius: "inherit" }}
      >
        <span style={styles.frame}>
          <Image
            src={photo.src}
            alt={photo.alt || `Ảnh cưới ${photoIndex + 1}`}
            fill
            sizes={sizes}
            className="transition duration-900 group-hover:scale-[1.03]"
            style={styles.image}
          />
        </span>
      </span>
    </button>
  );
}

export function SeoulIvoryAlbum({
  photos,
  index = "03",
  english = "CAPTURED MOMENTS",
  title = "Album Cưới",
}: {
  photos: PhotoItem[];
  index?: string;
  english?: string;
  title?: string;
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const chunks: PhotoItem[][] = [];
  for (let i = 0; i < photos.length; i += 3) {
    chunks.push(photos.slice(i, i + 3));
  }

  return (
    <section className="relative overflow-hidden px-5 py-16 sm:px-6 sm:py-24">
      <SeoulIvorySectionHeading index={index} english={english} title={title} />

      <div className="relative mx-auto mt-1 flex max-w-140 flex-col gap-4 sm:gap-5">
        {chunks.map(([hero, ...pair], groupIdx) => {
          const baseIndex = groupIdx * 3;
          return (
            <div key={hero.src} className="flex flex-col gap-4 sm:gap-5">
              <AlbumTile
                photo={hero}
                photoIndex={baseIndex}
                aspect="4 / 5"
                sizes="(min-width: 640px) 560px, 100vw"
                radius="999px 999px 12px 12px"
                onOpen={setLightboxIndex}
              />
              {pair.length > 0 && (
                <div className="grid grid-cols-2 items-start gap-3 sm:gap-4">
                  {pair.map((p, idx) => (
                    <AlbumTile
                      key={p.src}
                      photo={p}
                      photoIndex={baseIndex + 1 + idx}
                      aspect="3 / 4"
                      sizes="(min-width: 640px) 280px, 50vw"
                      delayMs={150 * idx}
                      className={idx === 1 ? "mt-7" : undefined}
                      onOpen={setLightboxIndex}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {lightboxIndex !== null && (
        <PhotoLightbox
          photos={photos}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </section>
  );
}

