"use client";

import { useEffect } from "react";

export function RevealOnScroll() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("js-reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    const observeAll = () => {
      const elements = document.querySelectorAll("[data-reveal]:not(.is-visible)");
      elements.forEach((el) => observer.observe(el));
    };

    observeAll();

    const mutationObserver = new MutationObserver(() => {
      observeAll();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    const handleOpened = () => {
      setTimeout(observeAll, 60);
    };
    window.addEventListener("thiep-opened", handleOpened);

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener("thiep-opened", handleOpened);
    };
  }, []);

  return null;
}

