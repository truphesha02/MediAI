import { useNavigate } from "react-router-dom";

function AISection() {
  const navigate = useNavigate();

  return (
    <section className="relative py-24 bg-slate-50 overflow-hidden">

      {/* Background decoration */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-cyan-100/50 rounded-full blur-3xl"></div>

      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT SIDE */}
          <div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-blue-100 text-blue-700 text-sm font-semibold shadow-sm">
              <span>✦</span>
              Your AI health companion
            </div>

            <h2 className="mt-6 text-4xl sm:text-5xl font-bold text-slate-900 leading-tight">
              Healthcare guidance,
              <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                whenever you need it.
              </span>
            </h2>

            <p className="mt-6 text-lg text-slate-500 leading-relaxed max-w-xl">
              Ask questions, understand your health information, track your
              wellness, and keep your health journey organized with MediAI.
            </p>

            {/* Benefits */}
            <div className="mt-8 space-y-4">

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  💬
                </div>

                <div>
                  <h3 className="font-semibold text-slate-800">
                    Ask health questions
                  </h3>

                  <p className="text-sm text-slate-500">
                    Get easy-to-understand educational information.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center">
                  🧠
                </div>

                <div>
                  <h3 className="font-semibold text-slate-800">
                    Understand your health
                  </h3>

                  <p className="text-sm text-slate-500">
                    Turn health information into simple insights.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  📊
                </div>

                <div>
                  <h3 className="font-semibold text-slate-800">
                    Track your progress
                  </h3>

                  <p className="text-sm text-slate-500">
                    Keep your wellness information organized over time.
                  </p>
                </div>
              </div>

            </div>

            <button
              onClick={() => navigate("/chat")}
              className="mt-9 px-7 py-3.5 rounded-xl bg-slate-900 text-white font-semibold hover:bg-blue-600 transition-all duration-300 shadow-lg"
            >
              Try AI Assistant →
            </button>

          </div>

          {/* RIGHT SIDE - AI CHAT PREVIEW */}
          <div className="relative">

            {/* Floating status */}
            <div className="absolute -top-5 right-5 z-10 bg-white rounded-2xl shadow-xl px-5 py-3 border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>

                <div>
                  <p className="text-xs text-slate-400">
                    MediAI Assistant
                  </p>

                  <p className="text-sm font-semibold text-slate-800">
                    Ready to help
                  </p>
                </div>
              </div>
            </div>

            {/* Chat window */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl p-5 sm:p-7">

              {/* Chat header */}
              <div className="flex items-center justify-between pb-5 border-b border-slate-100">

                <div className="flex items-center gap-3">

                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center text-2xl">
                    🤖
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800">
                      MediAI
                    </h3>

                    <p className="text-xs text-emerald-500 font-medium">
                      ● Online
                    </p>
                  </div>

                </div>

                <div className="px-3 py-1.5 rounded-lg bg-slate-50 text-xs text-slate-500">
                  AI Assistant
                </div>

              </div>

              {/* Chat messages */}
              <div className="mt-6 space-y-5">

                {/* User */}
                <div className="flex justify-end">

                  <div className="max-w-[80%] bg-blue-600 text-white rounded-2xl rounded-br-md px-5 py-4">
                    <p className="text-sm leading-relaxed">
                      I've been feeling tired and having a mild headache.
                      What should I do?
                    </p>
                  </div>

                </div>

                {/* AI */}
                <div className="flex gap-3">

                  <div className="w-9 h-9 shrink-0 rounded-xl bg-cyan-50 flex items-center justify-center">
                    🤖
                  </div>

                  <div className="max-w-[82%] bg-slate-50 rounded-2xl rounded-bl-md px-5 py-4">

                    <p className="text-sm text-slate-600 leading-relaxed">
                      Headaches and tiredness can have several possible causes.
                      Getting enough rest, staying hydrated, and monitoring your
                      symptoms may help.
                    </p>

                    <div className="mt-4 p-3 rounded-xl bg-white border border-slate-100">
                      <p className="text-xs font-semibold text-blue-600">
                        💡 Important
                      </p>

                      <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                        This information is educational and does not confirm a
                        medical diagnosis.
                      </p>
                    </div>

                  </div>

                </div>

              </div>

              {/* Chat input */}
              <div className="mt-6 flex items-center gap-3 p-2 rounded-2xl bg-slate-50 border border-slate-100">

                <div className="flex-1 px-3 text-sm text-slate-400">
                  Ask MediAI anything...
                </div>

                <button
                  onClick={() => navigate("/chat")}
                  className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition"
                >
                  ↑
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default AISection;