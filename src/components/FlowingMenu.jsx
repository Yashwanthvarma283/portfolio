import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ArrowUpRight, Trophy, Certificate } from '@phosphor-icons/react';
import './FlowingMenu.css';

function FlowingMenu({
  items = [],
  speed = 20,
  textColor = 'currentColor',
  bgColor = 'transparent',
  marqueeBgColor = '#C2622D',
  marqueeTextColor = '#FEFDFB',
  borderColor = 'rgba(140, 135, 125, 0.22)'
}) {
  return (
    <div className="menu-wrap" style={{ backgroundColor: bgColor }}>
      <nav className="menu">
        {items.map((item, idx) => (
          <MenuItem
            key={item.id || idx}
            index={idx}
            {...item}
            speed={speed}
            textColor={textColor}
            marqueeBgColor={marqueeBgColor}
            marqueeTextColor={marqueeTextColor}
            borderColor={borderColor}
          />
        ))}
      </nav>
    </div>
  );
}

function MenuItem({
  index = 0,
  link,
  title,
  shortTitle,
  issuer,
  year,
  type = 'cert',
  image,
  speed = 20,
  textColor,
  marqueeBgColor,
  marqueeTextColor,
  borderColor
}) {
  const itemRef = useRef(null);
  const marqueeRef = useRef(null);
  const marqueeInnerRef = useRef(null);
  const animationRef = useRef(null);
  const [repetitions, setRepetitions] = useState(4);

  const animationDefaults = { duration: 0.6, ease: 'expo' };
  const displayTitle = title || shortTitle;
  const isAward = type === 'award';

  const findClosestEdge = (mouseX, mouseY, width, height) => {
    const topEdgeDist = distMetric(mouseX, mouseY, width / 2, 0);
    const bottomEdgeDist = distMetric(mouseX, mouseY, width / 2, height);
    return topEdgeDist < bottomEdgeDist ? 'top' : 'bottom';
  };

  const distMetric = (x, y, x2, y2) => {
    const xDiff = x - x2;
    const yDiff = y - y2;
    return xDiff * xDiff + yDiff * yDiff;
  };

  useEffect(() => {
    const calculateRepetitions = () => {
      if (!marqueeInnerRef.current) return;

      const marqueeContent = marqueeInnerRef.current.querySelector('.marquee__part');
      if (!marqueeContent) return;

      const contentWidth = marqueeContent.offsetWidth;
      const viewportWidth = window.innerWidth;

      const needed = Math.ceil(viewportWidth / (contentWidth || 300)) + 2;
      setRepetitions(Math.max(3, needed));
    };

    calculateRepetitions();
    window.addEventListener('resize', calculateRepetitions);
    return () => window.removeEventListener('resize', calculateRepetitions);
  }, [title, issuer, year, image]);

  useEffect(() => {
    const setupMarquee = () => {
      if (!marqueeInnerRef.current) return;

      const marqueeContent = marqueeInnerRef.current.querySelector('.marquee__part');
      if (!marqueeContent) return;

      const contentWidth = marqueeContent.offsetWidth;
      if (contentWidth === 0) return;

      if (animationRef.current) {
        animationRef.current.kill();
      }

      animationRef.current = gsap.to(marqueeInnerRef.current, {
        x: -contentWidth,
        duration: speed,
        ease: 'none',
        repeat: -1
      });
    };

    const timer = setTimeout(setupMarquee, 50);

    return () => {
      clearTimeout(timer);
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [title, issuer, year, image, repetitions, speed]);

  const handleMouseEnter = ev => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    const edge = findClosestEdge(x, y, rect.width, rect.height);

    gsap
      .timeline({ defaults: animationDefaults })
      .set(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .set(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0)
      .to([marqueeRef.current, marqueeInnerRef.current], { y: '0%' }, 0);
  };

  const handleMouseLeave = ev => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    const edge = findClosestEdge(x, y, rect.width, rect.height);

    gsap
      .timeline({ defaults: animationDefaults })
      .to(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .to(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0);
  };

  return (
    <div className="menu__item" ref={itemRef} style={{ borderColor }}>
      {/* ── RESTING / DEFAULT STATE LINK ──────────────────────── */}
      <a
        className="menu__item-link group"
        href={link || '#'}
        target={link && link.startsWith('http') ? '_blank' : undefined}
        rel={link && link.startsWith('http') ? 'noopener noreferrer' : undefined}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ color: textColor }}
      >
        <div className="flex items-center gap-3 sm:gap-6 min-w-0 pr-4">
          <span className="font-mono text-xs sm:text-sm font-semibold text-accent/60 group-hover:text-accent transition-colors">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="font-sans font-semibold text-base sm:text-lg md:text-xl text-ink-900 dark:text-paper-100 truncate tracking-tight">
            {displayTitle}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <span className="hidden lg:inline font-sans text-xs text-ink-400 dark:text-ink-500 max-w-[220px] truncate">
            {issuer}
          </span>
          <span className="font-mono text-[11px] uppercase tracking-wider px-2.5 py-0.5 rounded border border-paper-300 dark:border-ink-700 bg-paper-100/70 dark:bg-ink-900/70 text-ink-700 dark:text-paper-300 font-medium">
            {isAward ? 'Award' : 'Certificate'}
          </span>
          <span className="font-mono text-xs font-bold text-accent">
            {year}
          </span>
          <ArrowUpRight
            size={16}
            weight="bold"
            className="text-ink-400 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
          />
        </div>
      </a>

      {/* ── HOVER KINETIC STREAM MARQUEE (BOX DETAILS SCROLLED) ─ */}
      <div className="marquee" ref={marqueeRef} style={{ backgroundColor: marqueeBgColor }}>
        <div className="marquee__inner-wrap">
          <div className="marquee__inner" ref={marqueeInnerRef} aria-hidden="true">
            {[...Array(repetitions)].map((_, idx) => (
              <div className="marquee__part" key={idx} style={{ color: marqueeTextColor }}>
                {/* Type & Year Badge */}
                <span className="font-mono text-xs uppercase tracking-wider px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white font-bold inline-flex items-center gap-1.5 shadow-sm">
                  {isAward ? <Trophy size={14} weight="fill" /> : <Certificate size={14} weight="fill" />}
                  <span>{isAward ? 'Award' : 'Certificate'} · {year}</span>
                </span>

                {/* Full Credential Title */}
                <span className="font-sans font-extrabold text-base sm:text-lg md:text-xl uppercase tracking-tight text-white drop-shadow-sm">
                  {title || shortTitle}
                </span>

                {/* Visual Thumbnail Capsule */}
                {image && (
                  <div
                    className="marquee__img"
                    style={{ backgroundImage: `url(${image})` }}
                  />
                )}

                {/* Issuer Details from box */}
                <span className="font-sans text-sm sm:text-base font-semibold text-white/90">
                  Issued by {issuer}
                </span>

                {/* Verified Credential Tag from box */}
                <span className="font-mono text-xs uppercase tracking-wider px-3 py-1 rounded-full bg-black/30 text-white border border-white/30 inline-flex items-center gap-1 font-semibold">
                  <span>✓ Verified Credential</span>
                  <ArrowUpRight size={13} weight="bold" />
                </span>

                {/* Kinetic Star Separator */}
                <span className="text-white/40 text-lg font-mono px-2">✦</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlowingMenu;

