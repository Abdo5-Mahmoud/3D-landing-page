import { Suspense, lazy } from "react";
const ThreeScene = lazy(() => import("./ThreeScene"));
const DarkVeil = lazy(() => import("./Animation/DarkVeil.jsx"));

export default function Hero() {
  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col lg:flex-row items-center justify-evenly gap-10 px-6 lg:px-12 py-16"
    >
      <div className="w-full h-[600px] absolute ">
        <Suspense>
          <DarkVeil />
        </Suspense>
      </div>

      <div className="flex-1 max-w-lg space-y-6 z-10">
        <h1 className="text-4xl md:text-6xl font-extrabold extrude">
          Welcome to the Future
        </h1>
        <p className="text-neon1/80 text-lg">
          Innovative 3D solutions for your business — immersive visuals,
          interactive products, and next-gen web experiences.
        </p>

        <div className="flex gap-4">
          <button className="px-6 py-3 bg-linear-to-r from-neon1 to-neon2 font-bold rounded-xl text-black shadow-xl hover:scale-105 transition">
            Get Started
          </button>
          <a
            href="#about"
            className="px-6 py-3 border border-white/20 rounded-xl text-white hover:bg-white/10 transition"
          >
            Learn More
          </a>
        </div>

        <div className="flex gap-4 mt-4">
          <span className="flex items-center gap-2 text-sm text-neutral-300">
            <span className="w-2 h-2 rounded-sm bg-gradient-to-r from-neon1 to-neon2 inline-block shadow" />{" "}
            Real-time 3D
          </span>
          <span className="flex items-center gap-2 text-sm text-neutral-300">
            <span className="w-2 h-2 rounded-sm bg-gradient-to-r from-neon2 to-neon1 inline-block shadow" />{" "}
            Interactive UI
          </span>
        </div>
      </div>

      <div className="z-10">
        <Suspense
          fallback={
            <div className=" h-72 md:h-[60vh] bg-white/20 rounded-2xl animate-pulse" />
          }
        >
          <ThreeScene />
        </Suspense>
      </div>
    </section>
  );
}
