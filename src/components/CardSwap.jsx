import React, { Children, cloneElement, forwardRef, isValidElement, useEffect, useMemo, useRef, useState, useImperativeHandle } from 'react';
import gsap from 'gsap';
import './CardSwap.css';

export const Card = forwardRef(({ customClass, ...rest }, ref) => (
  <div ref={ref} {...rest} className={`card-swap-card ${customClass ?? ''} ${rest.className ?? ''}`.trim()} />
));
Card.displayName = 'Card';

const makeSlot = (i, distX, distY, total) => ({
  x: i * distX,
  y: -i * distY,
  z: -i * 40,
  zIndex: total - i,
  opacity: i === 0 ? 1 : Math.max(0.4, 1 - i * 0.28),
  scale: i === 0 ? 1 : 1 - i * 0.04
});

const placeNow = (el, slot, skew) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    scale: slot.scale,
    opacity: slot.opacity,
    transformOrigin: 'center center',
    zIndex: slot.zIndex,
    force3D: true
  });

const CardSwap = forwardRef(({
  width = 860,
  height = 480,
  cardDistance = 35,
  verticalDistance = 25,
  delay = 5500,
  pauseOnHover = true,
  onCardClick,
  onCardChange,
  skewAmount = 0,
  easing = 'power1.inOut',
  children
}, ref) => {
  const config =
    easing === 'elastic'
      ? {
          ease: 'elastic.out(0.6,0.9)',
          durDrop: 1.4,
          durMove: 1.4,
          durReturn: 1.4,
          promoteOverlap: 0.8,
          returnDelay: 0.05
        }
      : {
          ease: 'power2.inOut',
          durDrop: 0.9,
          durMove: 0.9,
          durReturn: 0.9,
          promoteOverlap: 0.5,
          returnDelay: 0.15
        };

  const childArr = useMemo(() => Children.toArray(children), [children]);
  const refs = useMemo(
    () => childArr.map(() => React.createRef()),
    [childArr.length]
  );

  const order = useRef(Array.from({ length: childArr.length }, (_, i) => i));
  const [currentFrontIndex, setCurrentFrontIndex] = useState(0);

  const tlRef = useRef(null);
  const intervalRef = useRef();
  const container = useRef(null);

  const swap = () => {
    if (order.current.length < 2) return;

    const [front, ...rest] = order.current;
    const elFront = refs[front].current;
    if (!elFront) return;

    const tl = gsap.timeline();
    tlRef.current = tl;

    // Drop front card down and fade out slightly
    tl.to(elFront, {
      y: '+=380',
      opacity: 0,
      scale: 0.92,
      duration: config.durDrop,
      ease: config.ease
    });

    tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`);

    rest.forEach((idx, i) => {
      const el = refs[idx].current;
      if (!el) return;
      const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
      tl.set(el, { zIndex: slot.zIndex }, 'promote');
      tl.to(
        el,
        {
          x: slot.x,
          y: slot.y,
          z: slot.z,
          scale: slot.scale,
          opacity: slot.opacity,
          duration: config.durMove,
          ease: config.ease
        },
        `promote+=${i * 0.1}`
      );
    });

    const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
    tl.addLabel('return', `promote+=${config.durMove * config.returnDelay}`);
    tl.call(
      () => {
        gsap.set(elFront, { zIndex: backSlot.zIndex });
      },
      undefined,
      'return'
    );
    tl.to(
      elFront,
      {
        x: backSlot.x,
        y: backSlot.y,
        z: backSlot.z,
        scale: backSlot.scale,
        opacity: backSlot.opacity,
        duration: config.durReturn,
        ease: config.ease
      },
      'return'
    );

    tl.call(() => {
      const nextOrder = [...rest, front];
      order.current = nextOrder;
      const newFront = nextOrder[0];
      setCurrentFrontIndex(newFront);
      onCardChange?.(newFront);
    });
  };

  useImperativeHandle(ref, () => ({
    next: () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      swap();
      if (delay > 0) intervalRef.current = window.setInterval(swap, delay);
    },
    getCurrentIndex: () => currentFrontIndex,
  }));

  useEffect(() => {
    const total = refs.length;
    refs.forEach((r, i) => {
      if (r.current) {
        placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, total), skewAmount);
      }
    });

    if (delay > 0) {
      intervalRef.current = window.setInterval(swap, delay);
    }

    const node = container.current;
    if (pauseOnHover && node) {
      const pause = () => {
        clearInterval(intervalRef.current);
      };
      const resume = () => {
        if (delay > 0) {
          intervalRef.current = window.setInterval(swap, delay);
        }
      };
      node.addEventListener('mouseenter', pause);
      node.addEventListener('mouseleave', resume);
      return () => {
        node.removeEventListener('mouseenter', pause);
        node.removeEventListener('mouseleave', resume);
        clearInterval(intervalRef.current);
      };
    }
    return () => clearInterval(intervalRef.current);
  }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, easing, refs]);

  const rendered = childArr.map((child, i) =>
    isValidElement(child)
      ? cloneElement(child, {
          key: i,
          ref: refs[i],
          style: { width: typeof width === 'number' ? `${width}px` : width, height: typeof height === 'number' ? `${height}px` : height, ...(child.props.style ?? {}) },
          onClick: e => {
            child.props.onClick?.(e);
            onCardClick?.(i);
          }
        })
      : child
  );

  return (
    <div
      ref={container}
      className="card-swap-container"
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    >
      {rendered}
    </div>
  );
});

CardSwap.displayName = 'CardSwap';

export default CardSwap;
