function Features() {
  const features = [
    {
      icon: "🩺",
      title: "Health Risk Check",
      description:
        "Share your symptoms and basic information to receive an educational health risk assessment.",
      label: "Understand",
    },
    {
      icon: "🤖",
      title: "AI Health Chat",
      description:
        "Ask health-related questions and continue conversations with your personal AI assistant.",
      label: "Ask MediAI",
    },
    {
      icon: "🎙️",
      title: "Voice Assistant",
      description:
        "Speak naturally with MediAI and receive responses in your preferred language.",
      label: "Talk naturally",
    },
    {
      icon: "💊",
      title: "Medicine Reminder",
      description:
        "Keep track of your medicines and receive reminders for your daily schedule.",
      label: "Stay on track",
    },
    {
      icon: "📊",
      title: "Wellness Tracker",
      description:
        "Track sleep, water, steps, mood, and vital information in one simple dashboard.",
      label: "Track progress",
    },
    {
      icon: "📋",
      title: "Smart Health Reports",
      description:
        "Keep your health information organized and generate downloadable health reports.",
      label: "Stay organized",
    },
    {
      icon: "🖼️",
      title: "Image Analysis",
      description:
        "Upload selected health-related images to receive educational AI-based information.",
      label: "Explore",
    },
    {
      icon: "🚨",
      title: "Emergency Mode",
      description:
        "Get clear emergency guidance when reported symptoms may require urgent medical attention.",
      label: "Get help",
    },
  ];

  return (
    <section className="relative py-24 bg-white overflow-hidden">

      {/* Background decoration */}
      <div className="absolute top-20 -left-32 w-72 h-72 bg-cyan-100/40 rounded-full blur-3xl"></div>

      <div className="absolute bottom-10 -right-32 w-80 h-80 bg-blue-100/40 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8">

        {/* Section heading */}
        <div className="text-center max-w-3xl mx-auto">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-semibold">
            <span>✦</span>
            Everything in one place
          </div>

          <h2 className="mt-5 text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
            Healthcare made
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              {" "}simpler.
            </span>
          </h2>

          <p className="mt-5 text-lg text-slate-500 leading-relaxed">
            MediAI brings your everyday health tools together in one simple,
            easy-to-use platform.
          </p>

        </div>

        {/* Feature cards */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`group relative p-6 rounded-3xl border border-slate-100 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${
                index === 0
                  ? "lg:col-span-2 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-100"
                  : ""
              }`}
            >

              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${
                  index === 0
                    ? "bg-white shadow-sm"
                    : "bg-slate-50 group-hover:bg-blue-50"
                } transition-colors duration-300`}
              >
                {feature.icon}
              </div>

              {/* Content */}
              <div className="mt-6">

                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                  {feature.label}
                </p>

                <h3 className="mt-2 text-xl font-bold text-slate-800">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-slate-500">
                  {feature.description}
                </p>

              </div>

              {/* Arrow */}
              <div className="mt-5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300">
                →
              </div>

            </div>
          ))}

        </div>

        {/* Bottom message */}
        <div className="mt-14 rounded-3xl bg-slate-900 px-7 py-8 sm:px-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">

          <div>
            <p className="text-sm font-medium text-cyan-300">
              One simple health companion
            </p>

            <h3 className="mt-2 text-2xl font-bold text-white">
              Understand. Track. Take action.
            </h3>

            <p className="mt-2 text-sm text-slate-400 max-w-xl">
              MediAI is designed to help you organize health information and
              make everyday wellness tracking easier.
            </p>
          </div>

          <button
            onClick={() => {
              document
                .getElementById("about")
                ?.scrollIntoView({
                  behavior: "smooth",
                });
            }}
            className="whitespace-nowrap px-6 py-3 rounded-xl bg-white text-slate-900 font-semibold hover:bg-cyan-50 transition"
          >
            Discover MediAI →
          </button>

        </div>

      </div>
    </section>
  );
}

export default Features;