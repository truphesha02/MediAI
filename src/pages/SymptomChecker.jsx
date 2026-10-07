import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Stethoscope,
  AlertCircle,
  ShieldCheck,
  HeartPulse,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Siren,
} from "lucide-react";

function SymptomChecker() {
  const [symptoms, setSymptoms] = useState("");
  const [age, setAge] = useState("");
  const [result, setResult] = useState(null);

  const quickSymptoms = [
    "Fever",
    "Cough",
    "Headache",
    "Dizziness",
    "Vomiting",
    "Fatigue",
  ];

  const addSymptom = (symptom) => {
    if (symptoms.trim() === "") {
      setSymptoms(symptom);
    } else {
      setSymptoms((prev) => `${prev}, ${symptom}`);
    }
  };

  const analyzeSymptoms = (e) => {
    e.preventDefault();

    if (symptoms.trim() === "") {
      alert("Please enter your symptoms.");
      return;
    }

    const text = symptoms.toLowerCase();

    let risk = "Low";
    let message =
      "Your symptoms appear to have a lower risk based on this basic screening. Continue monitoring your symptoms.";

    if (
      text.includes("chest pain") ||
      text.includes("difficulty breathing") ||
      text.includes("breathing problem") ||
      text.includes("severe bleeding")
    ) {
      risk = "High";
      message =
        "Some symptoms you entered may require urgent medical attention. Please seek emergency medical care.";
    } else if (
      text.includes("high fever") ||
      text.includes("vomiting") ||
      text.includes("dizziness") ||
      text.includes("severe headache") ||
      text.includes("cough")
    ) {
      risk = "Medium";
      message =
        "Some symptoms may require medical attention. Monitor your condition and consider consulting a healthcare professional.";
    }

    setResult({
      risk,
      message,
    });
  };

  const getRiskStyles = () => {
    if (result?.risk === "High") {
      return {
        bg: "bg-red-50",
        border: "border-red-200",
        iconBg: "bg-red-100",
        icon: "text-red-600",
        text: "text-red-700",
        label: "Urgent attention recommended",
      };
    }

    if (result?.risk === "Medium") {
      return {
        bg: "bg-amber-50",
        border: "border-amber-200",
        iconBg: "bg-amber-100",
        icon: "text-amber-600",
        text: "text-amber-700",
        label: "Monitor your symptoms",
      };
    }

    return {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      iconBg: "bg-emerald-100",
      icon: "text-emerald-600",
      text: "text-emerald-700",
      label: "Continue monitoring",
    };
  };

  const riskStyles = getRiskStyles();

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">

          <Link
            to="/health-check"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <ArrowLeft size={18} />
            <span>Back to Health Hub</span>
          </Link>

          <div className="hidden items-center gap-2 sm:flex">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50">
              <HeartPulse className="text-indigo-600" size={20} />
            </div>

            <span className="text-lg font-bold text-slate-900">
              Medi<span className="text-indigo-600">AI</span>
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
            <ShieldCheck size={15} />
            Educational screening
          </div>

        </div>
      </header>


      {/* Main */}
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-12">

        {/* Page Heading */}
        <div className="mb-8 max-w-3xl">

          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700">
            <Activity size={16} />
            Health Risk Check
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            How are you feeling today?
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Answer a few simple questions about your symptoms to get an
            educational health-risk overview.
          </p>

        </div>


        {/* Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.05fr_0.95fr]">


          {/* LEFT — FORM */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

            <div className="mb-7 flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50">
                <Stethoscope className="text-indigo-600" size={25} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Tell us about your symptoms
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  This only takes a minute.
                </p>
              </div>

            </div>


            <form onSubmit={analyzeSymptoms}>

              {/* Age */}
              <div className="mb-6">

                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Your age
                </label>

                <input
                  type="number"
                  min="1"
                  max="120"
                  placeholder="Enter your age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />

              </div>


              {/* Quick Symptoms */}
              <div className="mb-5">

                <div className="mb-2 flex items-center justify-between">

                  <label className="text-sm font-semibold text-slate-800">
                    Common symptoms
                  </label>

                  <span className="text-xs text-slate-400">
                    Optional
                  </span>

                </div>

                <div className="flex flex-wrap gap-2">

                  {quickSymptoms.map((symptom) => (
                    <button
                      key={symptom}
                      type="button"
                      onClick={() => addSymptom(symptom)}
                      className="rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                    >
                      + {symptom}
                    </button>
                  ))}

                </div>

              </div>


              {/* Symptoms */}
              <div className="mb-6">

                <div className="mb-2 flex items-center justify-between">

                  <label className="text-sm font-semibold text-slate-800">
                    Describe your symptoms
                  </label>

                  <span className="text-xs text-slate-400">
                    Required
                  </span>

                </div>

                <textarea
                  rows="6"
                  placeholder="Example: I have fever, cough and headache..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />

                <p className="mt-2 text-xs text-slate-400">
                  You can describe multiple symptoms in your own words.
                </p>

              </div>


              {/* Submit */}
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-4 font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md active:scale-[0.99]"
              >
                <HeartPulse size={19} />
                Check My Health Risk
              </button>

            </form>


            {/* Safety note */}
            <div className="mt-5 flex gap-3 rounded-2xl bg-slate-50 p-4">

              <ShieldCheck
                size={19}
                className="mt-0.5 shrink-0 text-slate-500"
              />

              <p className="text-xs leading-5 text-slate-500">
                This screening provides educational information only and does
                not replace professional medical advice or diagnosis.
              </p>

            </div>

          </section>


          {/* RIGHT — RESULT */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

            <div className="mb-7">

              <p className="text-sm font-semibold text-indigo-600">
                YOUR RESULT
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                Health Risk Overview
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Your result is based only on the information you provide.
              </p>

            </div>


            {!result ? (

              /* Empty State */
              <div className="flex min-h-[430px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 text-center">

                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50">
                  <Stethoscope
                    size={36}
                    className="text-indigo-300"
                  />
                </div>

                <h3 className="text-lg font-bold text-slate-800">
                  Your result will appear here
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  Enter your symptoms on the left and select
                  <span className="font-semibold text-slate-700">
                    {" "}Check My Health Risk
                  </span>
                  {" "}to begin.
                </p>

                <div className="mt-6 flex items-center gap-2 text-xs font-medium text-slate-400">
                  <CheckCircle2 size={15} />
                  Quick and simple screening
                </div>

              </div>

            ) : (

              /* Result */
              <div>

                {/* Risk Card */}
                <div
                  className={`rounded-3xl border p-6 ${riskStyles.bg} ${riskStyles.border}`}
                >

                  <div className="flex items-start justify-between gap-4">

                    <div>

                      <p className="text-sm font-semibold text-slate-600">
                        Estimated risk level
                      </p>

                      <h3
                        className={`mt-2 text-4xl font-bold ${riskStyles.text}`}
                      >
                        {result.risk}
                      </h3>

                      <p className="mt-2 text-sm font-medium text-slate-600">
                        {riskStyles.label}
                      </p>

                    </div>


                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${riskStyles.iconBg}`}
                    >
                      {result.risk === "High" ? (
                        <Siren className={riskStyles.icon} size={24} />
                      ) : result.risk === "Medium" ? (
                        <AlertTriangle
                          className={riskStyles.icon}
                          size={24}
                        />
                      ) : (
                        <CheckCircle2
                          className={riskStyles.icon}
                          size={24}
                        />
                      )}
                    </div>

                  </div>

                </div>


                {/* Message */}
                <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-5">

                  <div className="flex gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
                      <AlertCircle
                        size={18}
                        className="text-indigo-600"
                      />
                    </div>

                    <div>

                      <h4 className="font-semibold text-slate-900">
                        What this means
                      </h4>

                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {result.message}
                      </p>

                    </div>

                  </div>

                </div>


                {/* Emergency notice */}
                {result.risk === "High" && (
                  <div className="mt-5 rounded-3xl border border-red-200 bg-red-50 p-5">

                    <div className="flex gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100">
                        <Siren
                          size={20}
                          className="text-red-600"
                        />
                      </div>

                      <div>

                        <h4 className="font-bold text-red-800">
                          Urgent medical attention
                        </h4>

                        <p className="mt-1 text-sm leading-6 text-red-700">
                          If you are experiencing severe or worsening
                          symptoms, seek emergency medical care immediately.
                        </p>

                      </div>

                    </div>

                  </div>
                )}


                {/* Disclaimer */}
                <div className="mt-5 rounded-2xl bg-slate-50 p-4">

                  <p className="text-xs leading-5 text-slate-500">
                    <strong className="text-slate-700">
                      Important:
                    </strong>{" "}
                    This result is an educational screening and is not a
                    medical diagnosis. A qualified healthcare professional
                    should evaluate persistent, severe, or concerning
                    symptoms.
                  </p>

                </div>


                {/* Check Again */}
                <button
                  onClick={() => setResult(null)}
                  className="mt-5 w-full rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Check Again
                </button>

              </div>

            )}

          </section>

        </div>

      </main>

    </div>
  );
}

export default SymptomChecker;