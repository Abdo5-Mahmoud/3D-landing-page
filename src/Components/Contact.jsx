export default function Contact() {
  return (
    <section id="contact" className="py-20 px-6 lg:px-12 bg-transparent">
      <h2 className="text-3xl md:text-5xl font-extrabold mb-8">Contact Us</h2>

      <div className="grid gap-8 lg:grid-cols-2">
        <form className="space-y-5 bg-white/5 border border-white/10 p-8 rounded-xl shadow">
          <div>
            <label className="text-sm text-neon1/80 block mb-2">Name</label>
            <input
              required
              className="w-full p-3 rounded-lg bg-white/6 border border-white/10 focus:ring-2 focus:ring-neon1 outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-neon1/80 block mb-2">Email</label>
            <input
              type="email"
              required
              className="w-full p-3 rounded-lg bg-white/6 border border-white/10 focus:ring-2 focus:ring-neon1 outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-neon1/80 block mb-2">Message</label>
            <textarea
              required
              className="w-full p-3 rounded-lg bg-white/6 border border-white/10 min-h-[140px] focus:ring-2 focus:ring-neon1 outline-none"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="px-6 py-3 bg-gradient-to-r from-neon1 to-neon2 font-bold rounded-xl text-black shadow-xl hover:scale-105 transition">
              Send Message
            </button>
            <div className="text-sm text-neutral-300">
              Or email{" "}
              <strong className="text-white">hello@future3d.example</strong>
            </div>
          </div>
        </form>

        <div className="space-y-4">
          <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
            <p className="text-sm text-neutral-300">
              <span className="text-white font-bold">Email:</span>{" "}
              hello@future3d.example
            </p>
            <p className="text-sm text-neutral-300 mt-2">
              <span className="text-white font-bold">Phone:</span> +20 100 000
              0000
            </p>
            <p className="text-sm text-neutral-300 mt-2">
              <span className="text-white font-bold">Location:</span> Cairo,
              Egypt
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl h-44 flex items-center justify-center text-5xl">
            📍
          </div>
        </div>
      </div>

      <footer className="mt-10 flex items-center justify-between text-neutral-400">
        <div>
          © <strong className="text-white">Future3D</strong> — Crafted with care
        </div>
        <div className="flex gap-3">
          <a className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
            T
          </a>
          <a className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
            G
          </a>
          <a className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
            in
          </a>
        </div>
      </footer>
    </section>
  );
}
