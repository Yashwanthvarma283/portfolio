# DESIGN SYSTEM & ARCHITECTURE

<!-- impeccable:design-authority 1 -->

## Design Read
- **Target**: Technical recruiters, senior engineering managers, and FAANG/Tier-1 hiring leads.
- **Identity**: Yashwanth Varma Racharla — Backend-focused Software Developer (Java, Spring Boot, RESTful API design, Database Performance Optimization).
- **Aesthetic Direction**: Premium Architectural / Editorial Print-Inspired. Studio Freight & Active Theory restraint.
- **Dials**: `DESIGN_VARIANCE: 7` | `MOTION_INTENSITY: 7` | `VISUAL_DENSITY: 4`

## Color Calibration (Strict Warm Neutral Base)
- **Mode Default**: Light Mode (Warm Paper / Stone).
  - Background Base: `#FBF9F5` (Warm Cream / Linen)
  - Surface Card / Elev: `#FFFFFF` / `#F4F1EA`
  - Border Subdued: `#E5E0D8` (Warm Hairline)
  - Border Strong: `#1A1C20`
- **Text & Contrast**:
  - Ink Primary: `#121316` (Deep Charcoal Ink, AA 14.8:1)
  - Ink Secondary: `#545761` (Neutral Slate, AA 5.2:1)
  - Ink Tertiary / Meta: `#7A7E8B`
- **Singular Brand Accent**:
  - Accent Core: `#E25822` (Burnt Terracotta / International Orange)
  - Accent Muted: `#FDF2EC`
  - Dark Theme Alternate: `#0D0E11` Base, `#16181D` Surface, `#E8E8ED` Ink, `#E25822` Accent.

## Typography Hierarchy
- **Display & Headline**: `Instrument Serif` & `Fraunces` (Refined High-Contrast Display Serif)
- **Body & Technical Specs**: `Space Grotesk` (Clean Geometric Technical Sans)
- **Code & Metadata Badges**: `JetBrains Mono` (High-legibility Monospace)
- **Banned**: Inter, Arial, Roboto, default system sans.

## Section Architecture & Rhythm
1. **Hero**: Architectural asymmetric header, kinetic split-title, live location badge, dual primary CTAs (Projects / Resume).
2. **About & Academic Core**: Split narrative with CGPA 9.4/10 distinction + 4 categorized skill pill clusters from resume.
3. **Experience**: Featured internship dossier for Cognifyz Technologies with layered architecture breakdown.
4. **Projects**: ScrollTriggered engineering showcases for Blood Donation Management System (Spring) & Weather Forecast Application (Python).
5. **Awards & Certifications**: Numbered editorial timeline/dossier for 5 verified credentials.
6. **Contact & Colophon**: Tactile copy-to-clipboard email interaction, verified social links, and clean footer colophon.

## Motion Guidelines (Emil Kowalski + Awwwards)
- **Lenis Smooth Scroll**: `lerp: 0.08, smoothWheel: true`
- **GSAP ScrollTrigger**: Hardware-accelerated transforms (`yPercent`, `clipPath`, `opacity`), scoped to container refs.
- **Micro-interactions**: 160ms - 220ms with active `:scale(0.97)` tactile press feedback.
- **Easing**: Custom cubic-bezier `[0.16, 1, 0.3, 1]` and `power3.out`. Zero bounce/elastic jitter.
