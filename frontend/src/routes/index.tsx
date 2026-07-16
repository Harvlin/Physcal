import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Flame, ArrowRight, Activity, Sparkles, HeartPulse, Shield } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Physcal — Move beyond your limits with AI" },
      {
        name: "description",
        content:
          "AI-powered inclusive sports platform for beginners, women, and people with accessibility needs.",
      },
      { property: "og:title", content: "Physcal — Move beyond your limits with AI" },
      {
        property: "og:description",
        content:
          "Sport is for everyone. Adaptive coaching, real community, movement that respects your body.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="text-white font-sans" style={{ background: "#0A0A0A", overflowX: "clip" }}>
      <Header />
      <HeroSection />
      <StorySection />
      <FeaturesBento />
      <HorizontalScroll />
      <FooterCTA />
      <Footer />
    </div>
  );
}

/* ────────────────────────────────────────────
   HEADER
──────────────────────────────────────────── */
function Header() {
  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-5"
      style={{ mixBlendMode: "difference" }}
    >
      <div className="flex items-center gap-2 text-white">
        <Flame size={24} style={{ color: "#D6E800" }} />
        <span className="font-bold text-xl tracking-tight">Physcal</span>
      </div>
      <div className="flex items-center gap-4">
        <Link
          to="/login"
          className="text-sm font-semibold text-white/80 hover:text-white transition-colors"
        >
          Sign In
        </Link>
        <Link
          to="/signup"
          className="text-sm font-bold bg-white text-black px-5 py-2.5 rounded-full hover:bg-[#D6E800] transition-colors"
        >
          Get Started
        </Link>
      </div>
    </motion.header>
  );
}

/* ────────────────────────────────────────────
   HERO — video that morphs into a card on scroll
──────────────────────────────────────────── */
function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const smooth = useSpring(scrollYProgress, { damping: 20, stiffness: 100 });

  const clipInset = useTransform(smooth, [0, 1], [0, 7]);
  const clipRadius = useTransform(smooth, [0, 1], [0, 40]);
  const opacity = useTransform(smooth, [0.6, 1], [1, 0]);
  const scale = useTransform(smooth, [0, 1], [1, 1.04]);
  const clipPath = useTransform(
    [clipInset, clipRadius],
    ([i, r]: number[]) => `inset(${i}% round ${r}px)`,
  );

  return (
    <div ref={ref} style={{ position: "relative", height: "170vh", background: "#0A0A0A" }}>
      <motion.div
        style={{ opacity, height: "100vh" }}
        className="sticky top-0 w-full overflow-hidden flex items-center justify-center"
      >
        {/* ── Video panel with morph clip-path ── */}
        <motion.div style={{ clipPath, position: "absolute", inset: 0 }}>
          <motion.video
            autoPlay
            muted
            loop
            playsInline
            style={{ scale }}
            className="absolute inset-0 w-full h-full object-cover opacity-55"
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260511_131941_d136af49-e243-493a-be14-6ff3f24e09e6.mp4"
          />
          {/* deep gradient so video bleeds seamlessly into dark page */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(10,10,10,0.25) 0%, transparent 18%, transparent 52%, rgba(10,10,10,0.65) 80%, #0A0A0A 100%)",
            }}
          />
        </motion.div>

        {/* ── Hero copy ── */}
        <div className="relative z-10 text-center px-5 max-w-5xl mx-auto pt-16">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="font-black text-white tracking-tighter uppercase"
            style={{ fontSize: "clamp(72px, 13vw, 148px)", lineHeight: 0.88 }}
          >
            Move
            <br />
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(90deg, #D6E800, #F5522A)" }}
            >
              Beyond
            </span>
          </motion.h1>
        </div>
      </motion.div>

      {/* Seamless bleed into next section — gradient extends into document flow */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{ height: "25vh", background: "linear-gradient(to bottom, transparent, #0A0A0A)" }}
      />
    </div>
  );
}

/* ────────────────────────────────────────────
   STORY — word-by-word scroll reveal
──────────────────────────────────────────── */
function Word({ word, progress, range }: { word: string; progress: any; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.08, 1]);
  const y = useTransform(progress, range, [14, 0]);
  return (
    <motion.span style={{ opacity, y }} className="inline-block">
      {word}
    </motion.span>
  );
}

function StorySection() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 55%"] });
  const words =
    "Sport is for everyone. We believe in adaptive coaching, real community, and movement that respects your body. Welcome to the future of fitness.".split(
      " ",
    );

  return (
    <section
      className="relative z-10 flex items-center justify-center px-6 lg:px-12"
      style={{
        minHeight: "100vh",
        paddingTop: "8rem",
        paddingBottom: "8rem",
        background: "#0A0A0A",
      }}
    >
      <p
        ref={ref}
        className="flex flex-wrap justify-center text-white font-bold"
        style={{
          fontSize: "clamp(28px, 5vw, 68px)",
          lineHeight: 1.15,
          maxWidth: "1100px",
          gap: "0.3em 0.35em",
        }}
      >
        {words.map((word, i) => (
          <Word
            key={i}
            word={word}
            progress={scrollYProgress}
            range={[i / words.length, (i + 1) / words.length]}
          />
        ))}
      </p>
    </section>
  );
}

/* ────────────────────────────────────────────
   FEATURES BENTO
──────────────────────────────────────────── */
function FeaturesBento() {
  return (
    <section
      className="relative z-10 px-6 lg:px-12"
      style={{
        paddingTop: "8rem",
        paddingBottom: "8rem",
        background: "#0A0A0A",
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      <div style={{ marginBottom: "4rem" }}>
        <h2
          className="font-bold tracking-tight"
          style={{ fontSize: "clamp(32px, 5vw, 60px)", lineHeight: 1.1 }}
        >
          Intelligence
          <br />
          <span style={{ color: "rgba(255,255,255,0.3)" }}>in every movement</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5" style={{ gridAutoRows: "340px" }}>
        {/* Big card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65 }}
          className="md:col-span-2 md:row-span-2 relative group overflow-hidden flex flex-col justify-end p-10 md:p-14"
          style={{
            borderRadius: "36px",
            background: "#121212",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{
              background:
                "radial-gradient(ellipse at 30% 80%, rgba(214,232,0,0.08) 0%, transparent 60%)",
            }}
          />
          <Activity size={44} style={{ color: "#D6E800", marginBottom: "1.5rem" }} />
          <h3 className="font-bold mb-3" style={{ fontSize: "clamp(28px, 3.5vw, 48px)" }}>
            Adaptive AI Coaching
          </h3>
          <p
            className="text-xl leading-relaxed"
            style={{ color: "rgba(255,255,255,0.45)", maxWidth: "420px" }}
          >
            Your workout plan evolves in real-time based on your feedback, energy levels, and
            physical conditions.
          </p>
        </motion.div>

        {/* Small card 1 */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, delay: 0.15 }}
          className="relative group overflow-hidden flex flex-col justify-end p-10"
          style={{
            borderRadius: "36px",
            background: "#121212",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{
              background:
                "radial-gradient(ellipse at 30% 80%, rgba(245,82,42,0.08) 0%, transparent 60%)",
            }}
          />
          <Shield size={32} style={{ color: "#F5522A", marginBottom: "1rem" }} />
          <h3 className="text-2xl font-bold mb-2">Injury Prevention</h3>
          <p style={{ color: "rgba(255,255,255,0.45)" }}>
            Smart modifications to keep you safe and consistent.
          </p>
        </motion.div>

        {/* Small card 2 */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, delay: 0.25 }}
          className="relative group overflow-hidden flex flex-col justify-end p-10"
          style={{
            borderRadius: "36px",
            background: "#121212",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{
              background:
                "radial-gradient(ellipse at 30% 80%, rgba(107,95,195,0.08) 0%, transparent 60%)",
            }}
          />
          <HeartPulse size={32} style={{ color: "#6B5FC3", marginBottom: "1rem" }} />
          <h3 className="text-2xl font-bold mb-2">Holistic Health</h3>
          <p style={{ color: "rgba(255,255,255,0.45)" }}>
            Integrating sleep, stress, and recovery into your routine.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────
   HORIZONTAL SCROLL
   Approach: tall wrapper (300vh) + sticky inner.
   No body lock, no fixed overlay → seamless entry & exit.
   User scrolls 300vh vertically = slides through all 3 phases.
──────────────────────────────────────────── */
const PHASES = [
  {
    num: "Phase 01",
    numColor: "rgba(255,255,255,0.05)",
    title: "Analyze",
    titleColor: "#ffffff",
    body: "We start by understanding your baseline. Movement patterns, goals, and limitations are analyzed to build a perfect foundation.",
  },
  {
    num: "Phase 02",
    numColor: "rgba(214,232,0,0.1)",
    title: "Adapt",
    titleColor: "#D6E800",
    body: "Our AI generates a custom pathway. Dynamic workouts that adapt in real-time as your body and energy levels change.",
  },
  {
    num: "Phase 03",
    numColor: "rgba(245,82,42,0.1)",
    title: "Achieve",
    titleColor: "#F5522A",
    body: "Break through plateaus safely. Experience real results built on sustainable habits and intelligent programming.",
  },
];

function HorizontalScroll() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  const spring = useSpring(scrollYProgress, { stiffness: 380, damping: 45, restDelta: 0.0005 });
  const x = useTransform(spring, [0, 1], ["0vw", `${-(PHASES.length - 1) * 100}vw`]);

  // Subtle slide-in on first entry
  const contentY = useTransform(scrollYProgress, [0, 0.06], [20, 0]);

  // Dark veil that fades in as section exits — dissolves into FooterCTA
  const exitVeil = useTransform(scrollYProgress, [0.88, 1], [0, 1]);

  return (
    <div
      ref={wrapperRef}
      style={{ height: `${PHASES.length * 100}vh`, background: "#0A0A0A", position: "relative" }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Horizontal track */}
        <motion.div
          style={{ x, display: "flex", width: `${PHASES.length * 100}vw`, flexShrink: 0 }}
        >
          {PHASES.map((p) => (
            <motion.div
              key={p.num}
              style={{
                width: "100vw",
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                paddingLeft: "clamp(2rem, 8vw, 6rem)",
                paddingRight: "clamp(2rem, 8vw, 6rem)",
                y: contentY,
              }}
            >
              <h2
                style={{
                  fontSize: "clamp(56px, 8.5vw, 128px)",
                  color: p.numColor,
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                  userSelect: "none",
                }}
              >
                {p.num}
              </h2>
              <h3
                style={{
                  fontSize: "clamp(36px, 5.5vw, 82px)",
                  color: p.titleColor,
                  fontWeight: 700,
                  marginTop: "0.5rem",
                }}
              >
                {p.title}
              </h3>
              <p
                style={{
                  fontSize: "clamp(15px, 1.4vw, 20px)",
                  color: "rgba(255,255,255,0.45)",
                  maxWidth: "500px",
                  lineHeight: 1.7,
                  marginTop: "1.25rem",
                }}
              >
                {p.body}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Dots */}
        <div
          style={{
            position: "absolute",
            bottom: "2.5rem",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "0.75rem",
          }}
        >
          {PHASES.map((_, i) => (
            <div
              key={i}
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
              }}
            />
          ))}
        </div>

        {/* Scroll hint */}
        <div
          style={{
            position: "absolute",
            bottom: "2.5rem",
            right: "2.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "rgba(255,255,255,0.2)",
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            fontWeight: 600,
          }}
        >
          <span>Scroll</span>
          <motion.span
            animate={{ y: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            ↓
          </motion.span>
        </div>

        {/* Exit veil — seamless dissolve into FooterCTA */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            background: "#0A0A0A",
            opacity: exitVeil,
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   FOOTER CTA — original rounded-top shape,
   refined staggered scroll reveal
──────────────────────────────────────────── */
function FooterCTA() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const smooth = useSpring(scrollYProgress, { damping: 24, stiffness: 100 });

  const headingY = useTransform(smooth, [0, 0.65], [56, 0]);
  const headingOp = useTransform(smooth, [0, 0.55], [0, 1]);
  const subY = useTransform(smooth, [0.25, 0.8], [36, 0]);
  const subOp = useTransform(smooth, [0.25, 0.8], [0, 1]);
  const btnY = useTransform(smooth, [0.45, 1], [28, 0]);
  const btnOp = useTransform(smooth, [0.45, 1], [0, 1]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden text-black"
      style={{
        background: "#D6E800",
        paddingTop: "10rem",
        paddingBottom: "10rem",
        paddingLeft: "1.5rem",
        paddingRight: "1.5rem",
        borderRadius: "56px 56px 0 0",
      }}
    >
      {/* Subtle radial orbs for depth */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-10rem",
          right: "-10rem",
          width: "480px",
          height: "480px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,0,0,0.07) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "-8rem",
          left: "-8rem",
          width: "320px",
          height: "320px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,0,0,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Clip container so heading slides up from clipped edge */}
        <div style={{ overflow: "hidden", paddingBottom: "0.1em" }}>
          <motion.h2
            style={{
              y: headingY,
              opacity: headingOp,
              lineHeight: 0.88,
              fontSize: "clamp(60px, 13vw, 160px)",
            }}
            className="font-black tracking-tighter uppercase"
          >
            Start
            <br />
            Moving
          </motion.h2>
        </div>

        <motion.p
          style={{
            y: subY,
            opacity: subOp,
            fontSize: "clamp(16px, 1.4vw, 20px)",
            color: "rgba(0,0,0,0.55)",
            maxWidth: "360px",
            margin: "1.5rem auto 0",
          }}
          className="mt-6 leading-relaxed"
        >
          Adaptive coaching for every body.
          <br />
          Start free — no equipment needed.
        </motion.p>

        <motion.div
          style={{ y: btnY, opacity: btnOp, marginTop: "2.5rem" }}
          className="flex justify-center"
        >
          <Link
            to="/signup"
            className="group relative inline-flex items-center justify-center gap-3 font-bold overflow-hidden"
            style={{
              background: "#0A0A0A",
              color: "#ffffff",
              fontSize: "1.15rem",
              padding: "1.1rem 2.75rem",
              borderRadius: "9999px",
              boxShadow: "0 16px 48px rgba(0,0,0,0.3)",
            }}
          >
            <span className="relative z-10 flex items-center gap-3">
              Join Physcal
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </span>
            {/* Orange fill on hover */}
            <span
              className="absolute inset-0"
              style={{
                background: "#F5522A",
                transform: "translateY(100%)",
                transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLSpanElement).style.transform = "translateY(0)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLSpanElement).style.transform = "translateY(100%)";
              }}
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────
   FOOTER
──────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{ background: "#D6E800", color: "#0A0A0A", padding: "3rem 1.5rem 2.5rem" }}>
      <div
        className="mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 font-medium"
        style={{ maxWidth: "1280px", borderTop: "1px solid rgba(0,0,0,0.1)", paddingTop: "2rem" }}
      >
        <div className="flex items-center gap-2">
          <Flame size={22} />
          <span className="font-bold text-lg tracking-tight">Physcal</span>
        </div>
        <div className="flex items-center gap-8" style={{ color: "rgba(0,0,0,0.55)" }}>
          {["About", "Community", "Privacy", "Contact"].map((l) => (
            <a key={l} href="#" className="hover:text-black transition-colors text-sm">
              {l}
            </a>
          ))}
        </div>
        <div className="text-sm" style={{ color: "rgba(0,0,0,0.35)" }}>
          © 2026 Physcal
        </div>
      </div>
    </footer>
  );
}
