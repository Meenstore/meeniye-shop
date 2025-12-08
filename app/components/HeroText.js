'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function HeroText() {
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);

  useEffect(() => {
    const line1 = line1Ref.current;
    const line2 = line2Ref.current;
    if (!line1 || !line2) return;

    // Animation mask reveal
    const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } });

    tl.fromTo(
      line1,
      {
        clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
      },
      {
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        duration: 1.5,
        delay: 0.5,
      }
    ).fromTo(
      line2,
      {
        clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
      },
      {
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        duration: 1.2,
        delay: -1,
      }
    );
  }, []);

  return (
    <div className="absolute left-0 bottom-0 z-10 pointer-events-none px-6 md:px-12 lg:px-20 pb-12 md:pb-16">
      <div className="text-left">
        <h1
          ref={line1Ref}
          className="text-[clamp(1.5rem,3vw,2.5rem)] font-black tracking-tight leading-tight text-[#582900] drop-shadow-[0_4px_20px_rgba(255,255,255,0.8)]"
        >
          Cosmétiques Capillaires
        </h1>
        <h1
          ref={line2Ref}
          className="text-[clamp(1.5rem,3vw,2.5rem)] font-black tracking-tight leading-tight text-[#077532] drop-shadow-[0_4px_20px_rgba(255,255,255,0.8)]"
        >
          Naturels
        </h1>
      </div>
    </div>
  );
}
