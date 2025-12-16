'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

export default function ImageParallaxZoom({
  src,
  alt = '',
  height = '100vh',
  zoomIntensity = 1.4,
  className = ''
}) {
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const image = imageRef.current;

    // Zoom in pendant le scroll
    gsap.fromTo(
      image,
      {
        scale: 1
      },
      {
        scale: zoomIntensity,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === container) trigger.kill();
      });
    };
  }, [zoomIntensity]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ height }}
    >
      <div ref={imageRef} className="w-full h-full relative">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>
    </div>
  );
}
