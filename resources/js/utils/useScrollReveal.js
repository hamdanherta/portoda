import { useEffect } from 'react';

/**
 * Custom Hook for Scroll Reveal Animation when scrolling DOWN and UP.
 * Re-animates elements smoothly whenever they enter the viewport from top or bottom.
 */
export function useScrollReveal(dependencies = []) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Fallback if IntersectionObserver is not supported
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal-on-scroll').forEach((el) => {
        el.classList.add('reveal-visible');
      });
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -20px 0px',
      threshold: 0.05,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
        } else {
          entry.target.classList.remove('reveal-visible');
        }
      });
    }, observerOptions);

    const observeElements = () => {
      const targets = document.querySelectorAll('.reveal-on-scroll');
      targets.forEach((el) => observer.observe(el));
    };

    observeElements();

    const timer = setTimeout(observeElements, 150);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, dependencies);
}
