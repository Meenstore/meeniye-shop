'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function RevealText({ children, className = '', delay = 0 }) {
  const textRef = useRef(null);

  useEffect(() => {
    if (!textRef.current) return;

    const text = textRef.current;

    // Attendre que le DOM soit complètement rendu
    const initAnimation = () => {
      // Split le texte en mots (filtrer les espaces vides)
      const words = text.innerText.split(' ').filter(word => word.trim() !== '');

      // Vider le contenu et créer des spans pour chaque mot
      text.innerHTML = '';
      words.forEach((word, index) => {
        const wordSpan = document.createElement('span');
        wordSpan.style.display = 'inline-block';
        wordSpan.style.overflow = 'hidden';
        wordSpan.style.whiteSpace = 'nowrap';

        const innerSpan = document.createElement('span');
        innerSpan.innerText = word;
        innerSpan.style.display = 'inline-block';
        innerSpan.style.transform = 'translateY(100%)';

        wordSpan.appendChild(innerSpan);
        text.appendChild(wordSpan);

        // Ajouter un espace après chaque mot sauf le dernier
        if (index < words.length - 1) {
          text.appendChild(document.createTextNode(' '));
        }
      });

      // Animation GSAP
      const wordSpans = text.querySelectorAll('span span');

      gsap.fromTo(
        wordSpans,
        {
          y: '100%',
          opacity: 0,
        },
        {
          y: '0%',
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.05,
          delay: delay,
          scrollTrigger: {
            trigger: text,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    };

    // Attendre un tick pour s'assurer que le DOM est prêt
    requestAnimationFrame(initAnimation);

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [delay]);

  return (
    <div ref={textRef} className={className}>
      {children}
    </div>
  );
}
