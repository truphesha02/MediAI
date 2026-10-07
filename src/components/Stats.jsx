function Stats() {
  const stats = [
    {
      number: "8+",
      title: "Health Tools",
      description: "Connected in one simple platform",
    },
    {
      number: "3",
      title: "Languages",
      description: "English, Hindi & Gujarati support",
    },
    {
      number: "1",
      title: "Health Dashboard",
      description: "Your information organized in one place",
    },
    {
      number: "24/7",
      title: "Access",
      description: "Designed to be available whenever you need it",
    },
  ];

  return (
    <section className="relative py-24 bg-white overflow-hidden">

      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-blue-100/40 blur-3xl rounded-full"></div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8">

        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-100 text-slate-600 text-sm font-semibold">
            <span className="text-blue-600">✦</span>
            MediAI at a glance
          </div>

          <h2 className="mt-5 text-4xl sm:text-5xl font-bold text-slate-900">
            Everything you need,
            <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              in one place.
            </span>
          </h2>

          <p className="mt-5 text-lg text-slate-500 leading-relaxed">
            A simple health companion designed to help you understand,
            track, and organize your everyday health information.
          </p>

        </div>

        {/* Stats */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          {stats.map((stat) => (
            <div
              key={stat.title}
              className="group relative text-center p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >

              {/* Small top accent */}
              <div className="mx-auto w-10 h-1 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 group-hover:w-16 transition-all duration-300"></div>

              <h3 className="mt-7 text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                {stat.number}
              </h3>

              <p className="mt-3 text-lg font-bold text-slate-800">
                {stat.title}
              </p>

              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                {stat.description}
              </p>

            </div>
          ))}

        </div>

        {/* Trust message */}
        <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-3 text-center">

          <div className="flex -space-x-2">
            <div className="w-9 h-9 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center">
              🩺
            </div>

            <div className="w-9 h-9 rounded-full bg-cyan-100 border-2 border-white flex items-center justify-center">
              🤖
            </div>

            <div className="w-9 h-9 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center">
              📊
            </div>
          </div>

          <p className="text-sm text-slate-500">
            Built to make everyday health information easier to understand.
          </p>

        </div>

      </div>
    </section>
  );
}

export default Stats;