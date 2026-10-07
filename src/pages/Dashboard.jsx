import { useNavigate } from "react-router-dom";

import {
  MessageCircle,
  Stethoscope,
  Pill,
  FileText,
  Activity,
  ShieldAlert,
} from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}

      <div className="bg-blue-600 text-white p-6 shadow-lg">

        <div className="max-w-7xl mx-auto">

          <button
            onClick={() => navigate("/")}
            className="mb-4 bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition"
          >
            ← Home
          </button>

          <h1 className="text-3xl font-bold">
            MediAI Dashboard
          </h1>

          <p className="mt-2 text-blue-100">
            Welcome! Manage your health in one place.
          </p>

        </div>

      </div>


      {/* MAIN */}

      <div className="max-w-7xl mx-auto p-8">

        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Health Services
        </h2>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">


          {/* AI CHAT */}

          <div
            onClick={() => navigate("/chat")}
            className="bg-white rounded-2xl shadow-md p-6 border border-blue-100 hover:shadow-xl hover:-translate-y-1 transition duration-300 cursor-pointer"
          >

            <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center">

              <MessageCircle
                className="text-blue-600"
                size={30}
              />

            </div>

            <h2 className="text-xl font-bold text-gray-800 mt-5">
              AI Chat
            </h2>

            <p className="mt-2 text-gray-600">
              Chat with your AI healthcare assistant.
            </p>

            <button className="mt-4 text-blue-600 font-semibold">
              Open AI Chat →
            </button>

          </div>


          {/* SYMPTOM CHECKER */}

          <div
            onClick={() => navigate("/symptom-checker")}
            className="bg-white rounded-2xl shadow-md p-6 border border-blue-100 hover:shadow-xl hover:-translate-y-1 transition duration-300 cursor-pointer"
          >

            <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center">

              <Stethoscope
                className="text-blue-600"
                size={30}
              />

            </div>

            <h2 className="text-xl font-bold text-gray-800 mt-5">
              Symptom Checker
            </h2>

            <p className="mt-2 text-gray-600">
              Check symptoms and get general health guidance.
            </p>

            <button className="mt-4 text-blue-600 font-semibold">
              Check Symptoms →
            </button>

          </div>


          {/* MEDICINE REMINDER */}

          <div
            onClick={() => navigate("/medicine-reminder")}
            className="bg-white rounded-2xl shadow-md p-6 border border-blue-100 hover:shadow-xl hover:-translate-y-1 transition duration-300 cursor-pointer"
          >

            <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center">

              <Pill
                className="text-blue-600"
                size={30}
              />

            </div>

            <h2 className="text-xl font-bold text-gray-800 mt-5">
              Medicine Reminder
            </h2>

            <p className="mt-2 text-gray-600">
              Manage medicines and daily medication schedules.
            </p>

            <button className="mt-4 text-blue-600 font-semibold">
              Manage Medicines →
            </button>

          </div>


          {/* HEALTH TRACKER */}

          <div
            onClick={() => navigate("/health-tracker")}
            className="bg-white rounded-2xl shadow-md p-6 border border-blue-100 hover:shadow-xl hover:-translate-y-1 transition duration-300 cursor-pointer"
          >

            <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center">

              <Activity
                className="text-blue-600"
                size={30}
              />

            </div>

            <h2 className="text-xl font-bold text-gray-800 mt-5">
              Daily Health Tracker
            </h2>

            <p className="mt-2 text-gray-600">
              Track food, habits, mood and how you feel.
            </p>

            <button className="mt-4 text-blue-600 font-semibold">
              Open Tracker →
            </button>

          </div>


          {/* HEALTH REPORTS */}

          <div
            onClick={() => navigate("/health-reports")}
            className="bg-white rounded-2xl shadow-md p-6 border border-blue-100 hover:shadow-xl hover:-translate-y-1 transition duration-300 cursor-pointer"
          >

            <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center">

              <FileText
                className="text-blue-600"
                size={30}
              />

            </div>

            <h2 className="text-xl font-bold text-gray-800 mt-5">
              Health Reports
            </h2>

            <p className="mt-2 text-gray-600">
              Create and download your health reports.
            </p>

            <button className="mt-4 text-blue-600 font-semibold">
              View Reports →
            </button>

          </div>


          {/* EMERGENCY MODE */}

          <div
            onClick={() => navigate("/emergency")}
            className="bg-white rounded-2xl shadow-md p-6 border border-blue-100 hover:shadow-xl hover:-translate-y-1 transition duration-300 cursor-pointer"
          >

            <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center">

              <ShieldAlert
                className="text-blue-600"
                size={30}
              />

            </div>

            <h2 className="text-xl font-bold text-gray-800 mt-5">
              Emergency Assistance
            </h2>

            <p className="mt-2 text-gray-600">
              Quickly access emergency assistance and location tools.
            </p>

            <button className="mt-4 text-blue-600 font-semibold">
              Open Emergency Mode →
            </button>

          </div>


        </div>

      </div>

    </div>
  );
}

export default Dashboard;