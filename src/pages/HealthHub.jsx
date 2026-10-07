import { useNavigate } from "react-router-dom";

function HealthHub() {
  const navigate = useNavigate();

  const features = [
    {
      icon: "🩺",
      title: "Health Risk Check",
      description:
        "Understand your symptoms and receive an educational health assessment.",
      path: "/symptom-checker",
      tag: "Check",
    },
    {
      icon: "🤖",
      title: "AI Health Assistant",
      description:
        "Chat, speak, or upload a health image and interact with MediAI in one place.",
      path: "/chat",
      tag: "AI Assistant",
      featured: true,
    },
    {
      icon: "💊",
      title: "Medicine Reminder",
      description:
        "Keep track of your medicines and never miss your daily schedule.",
      path: "/medicine-reminder",
      tag: "Manage",
    },
    {
      icon: "📊",
      title: "Wellness Tracker",
      description:
        "Track your sleep, water, steps, mood and everyday wellness.",
      path: "/health-tracker",
      tag: "Track",
    },
    {
      icon: "📋",
      title: "Health Reports",
      description:
        "Keep your health information organized and generate health reports.",
      path: "/health-reports",
      tag: "Reports",
    },
    {
      icon: "🚨",
      title: "Emergency Mode",
      description:
        "Get clear guidance when symptoms may require urgent medical attention.",
      path: "/emergency",
      tag: "Get Help",
      emergency: true,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden">

      {/* Background decoration */}

      <div className="fixed -top-40 -left-40 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="fixed -bottom-40 -right-40 w-96 h-96 bg-cyan-100/30 rounded-full blur-3xl pointer-events-none" />

      <main className="relative max-w-7xl mx-auto px-6 sm:px-8 py-10">

        {/* Back */}

        <button
          onClick={() => navigate("/")}
          className="group flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-all duration-300"
        >
          <span className="group-hover:-translate-x-1 transition-transform duration-300">
            ←
          </span>
          Back to Home
        </button>

        {/* Header */}

        <div className="text-center max-w-3xl mx-auto mt-12">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-100 shadow-sm text-sm font-semibold text-blue-600">

            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
              <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>

            MediAI is ready

          </div>

          <h1 className="mt-7 text-5xl sm:text-6xl font-bold tracking-tight text-slate-900">

            Your health,

            <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              all in one place.
            </span>

          </h1>

          <p className="mt-6 text-lg text-slate-500 leading-relaxed">
            Choose a health tool to get started. Everything you need is
            organized in one simple experience.
          </p>

        </div>

        {/* AI ORB */}

        <div className="flex justify-center mt-14 mb-14">

          <div className="relative">

            <div className="absolute inset-[-25px] rounded-full bg-cyan-200/30 blur-2xl animate-pulse" />

            <div
              className="absolute inset-[-10px] rounded-full border border-slate-200 animate-spin"
              style={{ animationDuration: "12s" }}
            />

            <div className="relative w-28 h-28 rounded-full bg-white border border-slate-100 shadow-2xl flex items-center justify-center">

              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center text-4xl shadow-xl shadow-blue-500/20 animate-pulse">
                🩺
              </div>

            </div>

            <div className="absolute -right-20 top-8 hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-100 shadow-lg">

              <span className="w-2 h-2 bg-emerald-400 rounded-full" />

              <span className="text-xs font-medium text-slate-600">
                Online
              </span>

            </div>

          </div>

        </div>

        {/* Section heading */}

        <div className="text-center mb-9">

          <h2 className="text-2xl font-bold text-slate-800">
            What would you like to do today?
          </h2>

          <p className="text-sm text-slate-400 mt-2">
            Choose a health tool to get started.
          </p>

        </div>

        {/* CARDS */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {features.map((feature) => (

            <button
              key={feature.title}
              onClick={() => navigate(feature.path)}
              className="group relative text-left p-7 rounded-3xl bg-white border border-slate-100 shadow-sm hover:-translate-y-2 hover:shadow-xl hover:shadow-slate-900/5 transition-all duration-500 overflow-hidden"
            >

              {/* Very subtle hover background */}

              <div className="absolute inset-0 rounded-3xl bg-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Small AI glow */}

              {feature.featured && (
                <div className="absolute -top-16 -right-16 w-40 h-40 bg-blue-100/30 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              )}

              <div className="relative">

                {/* Icon + tag */}

                <div className="flex items-center justify-between">

                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 group-hover:rotate-2 transition-all duration-500 ${
                      feature.featured
                        ? "bg-blue-50"
                        : feature.emergency
                        ? "bg-red-50"
                        : "bg-slate-50"
                    }`}
                  >
                    {feature.icon}
                  </div>

                  <div className="flex items-center gap-2">

                    {feature.featured && (
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wide">
                        Recommended
                      </span>
                    )}

                    <span
                      className={`text-xs font-semibold ${
                        feature.emergency
                          ? "text-red-500"
                          : "text-slate-400"
                      }`}
                    >
                      {feature.tag}
                    </span>

                  </div>

                </div>

                {/* Title */}

                <h3 className="mt-6 text-xl font-bold text-slate-800">
                  {feature.title}
                </h3>

                {/* Description */}

                <p className="mt-3 text-sm leading-relaxed text-slate-500">
                  {feature.description}
                </p>

                {/* AI options */}

                {feature.featured && (
                  <div className="mt-5 flex flex-wrap gap-2">

                    <span className="px-3 py-1.5 rounded-full bg-slate-50 text-xs font-medium text-slate-500">
                      💬 Chat
                    </span>

                    <span className="px-3 py-1.5 rounded-full bg-slate-50 text-xs font-medium text-slate-500">
                      🎙️ Voice
                    </span>

                    <span className="px-3 py-1.5 rounded-full bg-slate-50 text-xs font-medium text-slate-500">
                      🖼️ Images
                    </span>

                  </div>
                )}

                {/* Explore */}

                <div
                  className={`mt-6 flex items-center gap-2 text-sm font-semibold ${
                    feature.emergency
                      ? "text-slate-300 group-hover:text-red-500"
                      : "text-slate-300 group-hover:text-slate-700"
                  } transition-colors`}
                >

                  {feature.emergency ? "Get Help" : "Explore"}

                  <span className="group-hover:translate-x-2 transition-transform duration-300">
                    →
                  </span>

                </div>

              </div>

            </button>

          ))}

        </div>

        {/* AI CALLOUT */}

        <div className="mt-14 max-w-4xl mx-auto">

          <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 sm:p-8 shadow-2xl">

            <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl" />

            <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">

              <div className="w-14 h-14 shrink-0 rounded-2xl bg-white/10 flex items-center justify-center text-2xl">
                🤖
              </div>

              <div className="flex-1">

                <p className="text-sm font-semibold text-cyan-300">
                  One AI. Three ways to interact.
                </p>

                <h3 className="mt-1 text-xl font-bold text-white">
                  Chat, speak, or share an image with MediAI.
                </h3>

                <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                  Everything is available inside your AI Health Assistant,
                  so you don't need to switch between different tools.
                </p>

              </div>

              <button
                onClick={() => navigate("/chat")}
                className="shrink-0 px-5 py-3 rounded-xl bg-white text-slate-900 font-semibold hover:bg-cyan-50 hover:-translate-y-0.5 transition-all duration-300"
              >
                Open Assistant →
              </button>

            </div>

          </div>

        </div>

        {/* Disclaimer */}

        <div className="mt-8 max-w-3xl mx-auto text-center">

          <p className="text-xs text-slate-400 leading-relaxed">
            MediAI provides educational health information and is not a
            substitute for professional medical advice, diagnosis, or
            treatment. For serious or emergency concerns, seek appropriate
            medical care immediately.
          </p>

        </div>

      </main>

    </div>
  );
}

export default HealthHub;