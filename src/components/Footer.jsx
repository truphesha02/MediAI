import { useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative bg-slate-950 text-white overflow-hidden">

      {/* Background decoration */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>

      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 pt-16 pb-8">

        {/* Main footer */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="lg:col-span-2">

            <button
              onClick={() => scrollToSection("home")}
              className="flex items-center gap-3 group"
            >

              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-xl shadow-lg shadow-blue-500/20">
                🩺
              </div>

              <span className="text-2xl font-bold">
                Medi<span className="text-cyan-400">AI</span>
              </span>

            </button>

            <p className="mt-6 text-slate-400 leading-relaxed max-w-md">
              Your intelligent health companion for understanding,
              tracking, and organizing your everyday health information.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Built for simpler healthcare
            </div>

          </div>

          {/* Quick Links */}
          <div>

            <h3 className="font-semibold text-white mb-5">
              Explore
            </h3>

            <ul className="space-y-3 text-sm">

              <li>
                <button
                  onClick={() => scrollToSection("home")}
                  className="text-slate-400 hover:text-cyan-400 transition"
                >
                  Home
                </button>
              </li>

              <li>
                <button
                  onClick={() => scrollToSection("features")}
                  className="text-slate-400 hover:text-cyan-400 transition"
                >
                  Features
                </button>
              </li>

              <li>
                <button
                  onClick={() => scrollToSection("about")}
                  className="text-slate-400 hover:text-cyan-400 transition"
                >
                  About MediAI
                </button>
              </li>

              <li>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="text-slate-400 hover:text-cyan-400 transition"
                >
                  Dashboard
                </button>
              </li>

            </ul>

          </div>

          {/* Health Tools */}
          <div>

            <h3 className="font-semibold text-white mb-5">
              Health Tools
            </h3>

            <ul className="space-y-3 text-sm">

              <li>
                <button
                  onClick={() => navigate("/chat")}
                  className="text-slate-400 hover:text-cyan-400 transition"
                >
                  AI Health Chat
                </button>
              </li>

              <li>
                <button
                  onClick={() => navigate("/symptom-checker")}
                  className="text-slate-400 hover:text-cyan-400 transition"
                >
                  Health Risk Check
                </button>
              </li>

              <li>
                <button
                  onClick={() => navigate("/medicine-reminder")}
                  className="text-slate-400 hover:text-cyan-400 transition"
                >
                  Medicine Reminder
                </button>
              </li>

              <li>
                <button
                  onClick={() => navigate("/health-tracker")}
                  className="text-slate-400 hover:text-cyan-400 transition"
                >
                  Wellness Tracker
                </button>
              </li>

            </ul>

          </div>

        </div>

        {/* Disclaimer */}
        <div className="mt-14 p-5 rounded-2xl bg-white/5 border border-white/10">

          <div className="flex items-start gap-3">

            <div className="w-9 h-9 shrink-0 rounded-xl bg-amber-400/10 flex items-center justify-center">
              ⚠️
            </div>

            <div>

              <p className="text-sm font-semibold text-slate-200">
                Important health information
              </p>

              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                MediAI provides educational health information and is not a
                substitute for professional medical advice, diagnosis, or
                treatment. If you have a serious or emergency concern, seek
                appropriate medical care immediately.
              </p>

            </div>

          </div>

        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">

          <p className="text-sm text-slate-500">
            © 2026 MediAI. All rights reserved.
          </p>

          <div className="flex items-center gap-5 text-sm">

            <button className="text-slate-500 hover:text-cyan-400 transition">
              Privacy
            </button>

            <button className="text-slate-500 hover:text-cyan-400 transition">
              Terms
            </button>

            <span className="text-slate-700">
              •
            </span>

            <span className="text-slate-500">
              Made for smarter health journeys
            </span>

          </div>

        </div>

      </div>

    </footer>
  );
}

export default Footer;