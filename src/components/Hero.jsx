import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-gradient-to-br from-slate-50 via-white to-cyan-50">

      {/* Background decoration */}
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-cyan-200/30 blur-3xl"></div>
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 py-16 lg:py-20">

        <div className="grid lg:grid-cols-2 gap-14 items-center min-h-[70vh]">

          {/* LEFT SIDE */}
          <div>

            {/* Small badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-cyan-100 shadow-sm text-sm font-medium text-cyan-700 mb-6">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Your intelligent health companion
            </div>

            {/* Main heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.05] tracking-tight">

              Your Health.
              <br />

              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Smarter with AI.
              </span>

            </h1>

            {/* Description */}
            <p className="mt-7 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-xl">
              Understand your symptoms, track your wellness, manage medicines,
              and get personalized health guidance — all in one simple place.
            </p>

            {/* Buttons */}
            <div className="mt-9 flex flex-col sm:flex-row gap-4">

              <button
                onClick={() => navigate("/health-check")}
                className="group px-7 py-4 rounded-2xl bg-slate-900 text-white font-semibold shadow-lg shadow-slate-900/10 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-300"
              >
                Start Your Health Check
                <span className="ml-2 group-hover:translate-x-1 inline-block transition-transform">
                  →
                </span>
              </button>

              <button
                onClick={() => {
                  document
                    .getElementById("features")
                    ?.scrollIntoView({
                      behavior: "smooth"
                    });
                }}
                className="px-7 py-4 rounded-2xl bg-white border border-slate-200 text-slate-700 font-semibold shadow-sm hover:border-cyan-300 hover:bg-cyan-50 transition-all duration-300"
              >
                Explore MediAI
              </button>

            </div>

            {/* Trust points */}
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">

              <div className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span>
                Easy to use
              </div>

              <div className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span>
                Personal health tracking
              </div>

              <div className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span>
                AI-powered guidance
              </div>

            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="relative flex justify-center lg:justify-end">

            {/* Main health card */}
            <div className="relative w-full max-w-md">

              {/* Floating card - top */}
              <div className="absolute -top-8 -left-5 sm:-left-10 z-10 bg-white rounded-2xl shadow-xl border border-slate-100 px-5 py-4 flex items-center gap-3 animate-[bounce_4s_ease-in-out_infinite]">

                <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-xl">
                  ❤️
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Wellness status
                  </p>
                  <p className="font-semibold text-slate-800">
                    Looking good
                  </p>
                </div>

              </div>

              {/* Main card */}
              <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] border border-white shadow-2xl shadow-blue-900/10 p-6 sm:p-8">

                {/* Card header */}
                <div className="flex items-center justify-between mb-7">

                  <div>
                    <p className="text-sm text-slate-400">
                      Today's overview
                    </p>

                    <h3 className="text-xl font-bold text-slate-800 mt-1">
                      Your Health
                    </h3>
                  </div>

                  <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-xl">
                    🩺
                  </div>

                </div>

                {/* Health score */}
                <div className="flex items-center gap-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-5">

                  <div className="relative w-24 h-24 flex-shrink-0">

                    <div className="w-24 h-24 rounded-full border-[8px] border-cyan-100 flex items-center justify-center">

                      <div className="text-center">
                        <span className="text-2xl font-bold text-slate-800">
                          82
                        </span>

                        <p className="text-[10px] text-slate-400">
                          score
                        </p>
                      </div>

                    </div>

                  </div>

                  <div>
                    <p className="text-sm font-semibold text-emerald-600">
                      Good range
                    </p>

                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                      Keep tracking your daily wellness to understand your
                      health patterns.
                    </p>
                  </div>

                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-3 mt-5">

                  <div className="rounded-2xl bg-slate-50 p-4 text-center">
                    <div className="text-lg">💧</div>
                    <p className="text-lg font-bold text-slate-800 mt-1">
                      6
                    </p>
                    <p className="text-xs text-slate-400">
                      glasses
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4 text-center">
                    <div className="text-lg">😴</div>
                    <p className="text-lg font-bold text-slate-800 mt-1">
                      7.5h
                    </p>
                    <p className="text-xs text-slate-400">
                      sleep
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4 text-center">
                    <div className="text-lg">👟</div>
                    <p className="text-lg font-bold text-slate-800 mt-1">
                      6.2k
                    </p>
                    <p className="text-xs text-slate-400">
                      steps
                    </p>
                  </div>

                </div>

                {/* AI suggestion */}
                <div className="mt-5 flex items-start gap-3 rounded-2xl bg-slate-900 p-4 text-white">

                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                    ✨
                  </div>

                  <div>
                    <p className="text-sm font-semibold">
                      MediAI suggestion
                    </p>

                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Stay hydrated and keep your daily activity consistent.
                    </p>
                  </div>

                </div>

              </div>

              {/* Floating card - bottom */}
              <div className="absolute -bottom-7 -right-3 sm:-right-8 bg-white rounded-2xl shadow-xl border border-slate-100 px-5 py-4">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                    🤖
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      AI Assistant
                    </p>

                    <p className="text-sm font-semibold text-slate-800">
                      Always ready
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;