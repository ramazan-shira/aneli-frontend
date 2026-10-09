import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

export default function useSiteEffects() {
  useEffect(() => {
    const root = document.documentElement;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    const scan = () =>
      document
        .querySelectorAll("[data-reveal]:not([data-seen])")
        .forEach((el) => {
          el.dataset.seen = "1";
          io.observe(el);
        });
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.getElementById("root"), {
      childList: true,
      subtree: true,
    });

    const lenis = reduce ? null : new Lenis({ lerp: 0.09 });
    let raf;
    const loop = (t) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    if (lenis) raf = requestAnimationFrame(loop);

    const onScroll = () => {
      const y = scrollY,
        h = root.scrollHeight - innerHeight;
      root.style.setProperty("--progress", h > 0 ? y / h : 0);
      root.classList.toggle("scrolled", y > 40);
      if (!reduce)
        document.querySelectorAll("[data-speed]").forEach((el) => {
          const r = el.getBoundingClientRect();
          el.style.setProperty(
            "--py",
            `${-(r.top + r.height / 2 - innerHeight / 2) * Number(el.dataset.speed)}px`,
          );
        });
    };
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href").slice(1),
        el = id && !id.startsWith("/") && document.getElementById(id);
      if (el && lenis) {
        e.preventDefault();
        lenis.scrollTo(el, { offset: -64, duration: 1.3 });
      }
    };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    document.addEventListener("click", onClick);
    onScroll();
    return () => {
      io.disconnect();
      mo.disconnect();
      cancelAnimationFrame(raf);
      lenis?.destroy();
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      document.removeEventListener("click", onClick);
      root.classList.remove("scrolled");
    };
  }, []);
}
