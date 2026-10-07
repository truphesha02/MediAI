import { useState } from "react";
import { Link } from "react-router-dom";
import { jsPDF } from "jspdf";
import {
  ArrowLeft,
  User,
  Activity,
  HeartPulse,
  Brain,
  Download,
  FileText,
  CalendarDays,
  Thermometer,
  Droplets,
  Moon,
  Dumbbell,
  Smile,
  Stethoscope,
  ShieldCheck,
  ClipboardCheck,
  AlertCircle,
  CheckCircle2,
  Clock3,
  Sparkles,
} from "lucide-react";

function HealthReports() {
  // =====================================================
  // PATIENT INFORMATION
  // =====================================================

  const [patientName, setPatientName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [reportReason, setReportReason] = useState("");

  // =====================================================
  // SYMPTOMS
  // =====================================================

  const [symptoms, setSymptoms] = useState("");

  // =====================================================
  // VITALS
  // =====================================================

  const [temperature, setTemperature] = useState("");
  const [bloodPressure, setBloodPressure] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [oxygen, setOxygen] = useState("");

  // =====================================================
  // DAILY HEALTH
  // =====================================================

  const [sleep, setSleep] = useState("");
  const [water, setWater] = useState("");
  const [exercise, setExercise] = useState("");
  const [food, setFood] = useState("Balanced");
  const [mood, setMood] = useState("Good");
  const [feeling, setFeeling] = useState("Normal");

  // =====================================================
  // DOCTOR REVIEW
  // =====================================================

  const [doctorName, setDoctorName] = useState("");
  const [registrationNumber, setRegistrationNumber] =
    useState("");
  const [qualification, setQualification] =
    useState("");
  const [doctorComments, setDoctorComments] =
    useState("");
  const [doctorDecision, setDoctorDecision] =
    useState("Pending Doctor Review");

  const [report, setReport] = useState(null);

  // =====================================================
  // GENERATE HEALTH REPORT
  // =====================================================

  const generateReport = () => {
    if (
      patientName.trim() === "" ||
      age.trim() === "" ||
      symptoms.trim() === ""
    ) {
      alert(
        "Please enter Patient Name, Age and Symptoms."
      );
      return;
    }

    let score = 100;
    const observations = [];

    // Sleep
    if (sleep !== "" && Number(sleep) < 6) {
      score -= 15;

      observations.push(
        "Sleep duration is below 6 hours."
      );
    }

    // Water
    if (water !== "" && Number(water) < 4) {
      score -= 10;

      observations.push(
        "Reported water intake is relatively low."
      );
    }

    // Exercise
    if (exercise !== "" && Number(exercise) < 15) {
      score -= 10;

      observations.push(
        "Reported physical activity is relatively low."
      );
    }

    // Food
    if (food === "Needs Improvement") {
      score -= 10;

      observations.push(
        "Reported food habits may benefit from improvement."
      );
    }

    // Mood
    if (mood === "Low" || mood === "Very Low") {
      score -= 10;

      observations.push(
        "The patient reported a lower mood."
      );
    }

    // Feeling
    if (
      feeling === "Weak" ||
      feeling === "Feverish" ||
      feeling === "Dizzy"
    ) {
      score -= 10;

      observations.push(
        `Patient reported feeling ${feeling.toLowerCase()}.`
      );
    }

    // Temperature
    if (
      temperature !== "" &&
      Number(temperature) >= 38
    ) {
      score -= 15;

      observations.push(
        "An elevated temperature was entered."
      );
    }

    // Oxygen
    if (oxygen !== "" && Number(oxygen) < 94) {
      score -= 20;

      observations.push(
        "Entered oxygen saturation is below the usual range and should be clinically assessed."
      );
    }

    score = Math.max(score, 0);

    let risk = "Low";

    if (score < 60) {
      risk = "High";
    } else if (score < 80) {
      risk = "Medium";
    }

    const generatedReport = {
      reportId:
        "MED-" +
        Date.now().toString().slice(-8),

      date: new Date().toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }
      ),

      patientName,
      age,
      gender,
      reportReason,

      symptoms,

      temperature,
      bloodPressure,
      heartRate,
      oxygen,

      sleep,
      water,
      exercise,

      food,
      mood,
      feeling,

      score,
      risk,
      observations,

      doctorName,
      registrationNumber,
      qualification,
      doctorComments,
      doctorDecision,
    };

    setReport(generatedReport);
  };

  // =====================================================
  // DOWNLOAD PDF
  // =====================================================

  const downloadPDF = () => {
    if (!report) {
      alert("Please generate the health report first.");
      return;
    }

    const doc = new jsPDF();

    const pageWidth =
      doc.internal.pageSize.getWidth();

    const pageHeight =
      doc.internal.pageSize.getHeight();

    const margin = 18;

    let y = 20;

    const checkPage = (space = 15) => {
      if (y + space > pageHeight - 20) {
        doc.addPage();
        y = 20;
      }
    };

    const addText = (
      text,
      x = margin,
      fontSize = 10
    ) => {
      doc.setFontSize(fontSize);

      const lines = doc.splitTextToSize(
        String(text),
        pageWidth - 36
      );

      checkPage(lines.length * 6 + 5);

      doc.text(lines, x, y);

      y += lines.length * 6 + 4;
    };

    // ===================================================
    // PDF HEADER
    // ===================================================

    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);

    doc.text(
      "MediAI",
      pageWidth / 2,
      y,
      { align: "center" }
    );

    y += 9;

    doc.setFontSize(15);

    doc.text(
      "HEALTH ASSESSMENT REPORT",
      pageWidth / 2,
      y,
      { align: "center" }
    );

    y += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    doc.text(
      `Report ID: ${report.reportId}`,
      pageWidth / 2,
      y,
      { align: "center" }
    );

    y += 5;

    doc.text(
      `Report Date: ${report.date}`,
      pageWidth / 2,
      y,
      { align: "center" }
    );

    y += 8;

    doc.line(
      margin,
      y,
      pageWidth - margin,
      y
    );

    y += 10;

    // ===================================================
    // PATIENT INFORMATION
    // ===================================================

    doc.setFont("helvetica", "bold");

    addText(
      "1. PATIENT INFORMATION",
      margin,
      13
    );

    doc.setFont("helvetica", "normal");

    addText(
      `Patient Name: ${report.patientName}`
    );

    addText(`Age: ${report.age}`);

    addText(
      `Gender: ${report.gender || "Not provided"}`
    );

    addText(
      `Reason for Assessment: ${
        report.reportReason || "Not provided"
      }`
    );

    y += 3;

    // ===================================================
    // SYMPTOMS
    // ===================================================

    doc.setFont("helvetica", "bold");

    addText(
      "2. PATIENT-REPORTED SYMPTOMS",
      margin,
      13
    );

    doc.setFont("helvetica", "normal");

    addText(report.symptoms);

    y += 3;

    // ===================================================
    // VITALS
    // ===================================================

    doc.setFont("helvetica", "bold");

    addText(
      "3. VITAL MEASUREMENTS",
      margin,
      13
    );

    doc.setFont("helvetica", "normal");

    addText(
      `Temperature: ${
        report.temperature || "Not provided"
      } °C`
    );

    addText(
      `Blood Pressure: ${
        report.bloodPressure || "Not provided"
      }`
    );

    addText(
      `Heart Rate: ${
        report.heartRate || "Not provided"
      } BPM`
    );

    addText(
      `SpO₂: ${
        report.oxygen || "Not provided"
      } %`
    );

    y += 3;

    // ===================================================
    // DAILY HEALTH
    // ===================================================

    doc.setFont("helvetica", "bold");

    addText(
      "4. DAILY HEALTH INFORMATION",
      margin,
      13
    );

    doc.setFont("helvetica", "normal");

    addText(
      `Sleep: ${
        report.sleep || "Not provided"
      } hours`
    );

    addText(
      `Water: ${
        report.water || "Not provided"
      } glasses`
    );

    addText(
      `Exercise: ${
        report.exercise || "Not provided"
      } minutes`
    );

    addText(`Food: ${report.food}`);

    addText(`Mood: ${report.mood}`);

    addText(
      `Physical Feeling: ${report.feeling}`
    );

    y += 3;

    // ===================================================
    // AI ASSESSMENT
    // ===================================================

    doc.setFont("helvetica", "bold");

    addText(
      "5. AI-ASSISTED ASSESSMENT",
      margin,
      13
    );

    doc.setFont("helvetica", "normal");

    addText(
      `Wellness Score: ${report.score}/100`
    );

    addText(
      `Potential Risk Indicator: ${report.risk}`
    );

    y += 3;

    // ===================================================
    // OBSERVATIONS
    // ===================================================

    doc.setFont("helvetica", "bold");

    addText(
      "6. OBSERVATIONS",
      margin,
      13
    );

    doc.setFont("helvetica", "normal");

    if (report.observations.length === 0) {
      addText(
        "No additional observations were generated."
      );
    } else {
      report.observations.forEach(
        (observation) => {
          addText(`• ${observation}`);
        }
      );
    }

    y += 3;

    // ===================================================
    // DOCTOR REVIEW
    // ===================================================

    doc.setFont("helvetica", "bold");

    addText(
      "7. DOCTOR REVIEW",
      margin,
      13
    );

    doc.setFont("helvetica", "normal");

    addText(
      `Doctor Name: ${
        report.doctorName || "Not provided"
      }`
    );

    addText(
      `Medical Registration Number: ${
        report.registrationNumber ||
        "Not provided"
      }`
    );

    addText(
      `Qualification: ${
        report.qualification ||
        "Not provided"
      }`
    );

    addText(
      `Doctor Decision: ${
        report.doctorDecision
      }`
    );

    addText(
      `Clinical Comments: ${
        report.doctorComments ||
        "No comments provided."
      }`
    );

    y += 8;

    // ===================================================
    // SIGNATURE
    // ===================================================

    checkPage(40);

    doc.text(
      "Doctor Signature:",
      margin,
      y
    );

    doc.line(
      margin,
      y + 12,
      margin + 70,
      y + 12
    );

    doc.text(
      "Date:",
      pageWidth / 2,
      y
    );

    doc.line(
      pageWidth / 2,
      y + 12,
      pageWidth - margin,
      y + 12
    );

    y += 25;

    // ===================================================
    // DISCLAIMER
    // ===================================================

    checkPage(45);

    doc.setFont("helvetica", "bold");

    doc.setFontSize(10);

    doc.text(
      "IMPORTANT DISCLAIMER",
      margin,
      y
    );

    y += 6;

    doc.setFont("helvetica", "normal");

    doc.setFontSize(8);

    const disclaimer =
      "This report contains patient-provided information and AI-assisted wellness analysis. It is not a medical diagnosis and does not replace evaluation by a qualified healthcare professional. Clinical interpretation, approval, and signature must be performed by an appropriately qualified healthcare professional.";

    const disclaimerLines =
      doc.splitTextToSize(
        disclaimer,
        pageWidth - 36
      );

    doc.text(
      disclaimerLines,
      margin,
      y
    );

    // ===================================================
    // FOOTER
    // ===================================================

    const totalPages =
      doc.internal.getNumberOfPages();

    for (
      let page = 1;
      page <= totalPages;
      page++
    ) {
      doc.setPage(page);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);

      doc.text(
        "MediAI - AI-assisted healthcare information",
        margin,
        pageHeight - 10
      );

      doc.text(
        `Page ${page} of ${totalPages}`,
        pageWidth - margin,
        pageHeight - 10,
        {
          align: "right",
        }
      );
    }

    // ===================================================
    // SAVE PDF
    // ===================================================

    doc.save(
      `MediAI_Health_Report_${report.reportId}.pdf`
    );
  };

  // =====================================================
  // UPDATE REPORT
  // =====================================================

  const updateReport = (field, value) => {
    if (!report) return;

    setReport({
      ...report,
      [field]: value,
    });
  };

  // =====================================================
  // SMALL INPUT COMPONENT
  // =====================================================

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3.5 text-slate-800 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 placeholder:text-slate-400";

  const labelClass =
    "mb-2 block text-sm font-semibold text-slate-700";

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="border-b border-slate-200 bg-white">

        <div className="mx-auto max-w-7xl px-5 py-5 md:px-8">

          <div className="flex items-center justify-between gap-4">

            <div className="flex items-center gap-4">

              <Link to="/dashboard">

                <button
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                >
                  <ArrowLeft size={21} />
                </button>

              </Link>

              <div>

                <div className="flex items-center gap-2">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
                    <FileText size={19} />
                  </div>

                  <h1 className="text-xl font-bold tracking-tight md:text-2xl">
                    Health Reports
                  </h1>

                </div>

                <p className="mt-1 text-sm text-slate-500">
                  Create, review and download your MediAI health report.
                </p>

              </div>

            </div>

            <div className="hidden items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 md:flex">

              <ShieldCheck size={16} />

              Private Health Record

            </div>

          </div>

        </div>

      </header>


      <main className="mx-auto max-w-7xl px-5 py-7 md:px-8 md:py-10">

        {/* =================================================
            INTRO / STATUS
        ================================================= */}

        <div className="mb-8 grid gap-5 lg:grid-cols-[1fr_auto]">

          <div className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-6 md:p-7">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">

                <ClipboardCheck size={24} />

              </div>

              <div>

                <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                  Health Report Builder
                </p>

                <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                  Build your health summary
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
                  Add your health information below to create a structured MediAI report that you can review and download.
                </p>

              </div>

            </div>

          </div>


          <div className="flex min-w-[220px] items-center gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-indigo-600">
              <CalendarDays size={23} />
            </div>

            <div>

              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Report Date
              </p>

              <p className="mt-1 font-bold text-slate-800">
                {new Date().toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>

            </div>

          </div>

        </div>


        {/* =================================================
            DISCLAIMER
        ================================================= */}

        <div className="mb-8 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5">

          <AlertCircle
            size={21}
            className="mt-0.5 shrink-0 text-amber-600"
          />

          <div>

            <p className="font-semibold text-amber-900">
              Important health information
            </p>

            <p className="mt-1 text-sm leading-6 text-amber-800">
              This report contains patient-provided information and AI-assisted wellness analysis. It does not replace professional medical diagnosis or treatment.
            </p>

          </div>

        </div>


        {/* =================================================
            PATIENT INFORMATION
        ================================================= */}

        <section className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">

          <div className="mb-7 flex items-center gap-4">

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <User size={21} />
            </div>

            <div>

              <h2 className="text-xl font-bold text-slate-900">
                Patient Information
              </h2>

              <p className="text-sm text-slate-500">
                Basic information for this report
              </p>

            </div>

          </div>


          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            <div>

              <label className={labelClass}>
                Patient Name
              </label>

              <input
                type="text"
                value={patientName}
                onChange={(e) =>
                  setPatientName(e.target.value)
                }
                placeholder="Enter patient name"
                className={inputClass}
              />

            </div>


            <div>

              <label className={labelClass}>
                Age
              </label>

              <input
                type="number"
                value={age}
                onChange={(e) =>
                  setAge(e.target.value)
                }
                placeholder="Enter age"
                className={inputClass}
              />

            </div>


            <div>

              <label className={labelClass}>
                Gender
              </label>

              <select
                value={gender}
                onChange={(e) =>
                  setGender(e.target.value)
                }
                className={inputClass}
              >

                <option value="">
                  Select gender
                </option>

                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
                <option>Prefer not to say</option>

              </select>

            </div>


            <div>

              <label className={labelClass}>
                Reason for Assessment
              </label>

              <input
                type="text"
                value={reportReason}
                onChange={(e) =>
                  setReportReason(e.target.value)
                }
                placeholder="Example: Fever and cough"
                className={inputClass}
              />

            </div>

          </div>

        </section>


        {/* =================================================
            SYMPTOMS
        ================================================= */}

        <section className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">

          <div className="mb-6 flex items-center justify-between gap-4">

            <div className="flex items-center gap-4">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <Activity size={21} />
              </div>

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  Symptoms
                </h2>

                <p className="text-sm text-slate-500">
                  Describe what the patient is experiencing
                </p>

              </div>

            </div>

            <span className="hidden rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 sm:block">
              Required
            </span>

          </div>


          <textarea
            rows="5"
            value={symptoms}
            onChange={(e) =>
              setSymptoms(e.target.value)
            }
            placeholder="Describe patient's symptoms, duration and anything else that may be relevant..."
            className={`${inputClass} resize-none`}
          />

          <p className="mt-2 text-xs text-slate-400">
            Example: Fever for two days with cough and mild fatigue.
          </p>

        </section>


        {/* =================================================
            VITAL MEASUREMENTS
        ================================================= */}

        <section className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">

          <div className="mb-7 flex items-center gap-4">

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <HeartPulse size={21} />
            </div>

            <div>

              <h2 className="text-xl font-bold text-slate-900">
                Vital Measurements
              </h2>

              <p className="text-sm text-slate-500">
                Enter available readings from the patient
              </p>

            </div>

          </div>


          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {/* Temperature */}

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">

              <div className="mb-3 flex items-center gap-2">

                <Thermometer
                  size={18}
                  className="text-orange-500"
                />

                <span className="text-sm font-semibold text-slate-700">
                  Temperature
                </span>

              </div>

              <input
                type="number"
                step="0.1"
                value={temperature}
                onChange={(e) =>
                  setTemperature(e.target.value)
                }
                placeholder="°C"
                className={inputClass}
              />

            </div>


            {/* Blood Pressure */}

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">

              <div className="mb-3 flex items-center gap-2">

                <HeartPulse
                  size={18}
                  className="text-rose-500"
                />

                <span className="text-sm font-semibold text-slate-700">
                  Blood Pressure
                </span>

              </div>

              <input
                type="text"
                value={bloodPressure}
                onChange={(e) =>
                  setBloodPressure(e.target.value)
                }
                placeholder="120/80"
                className={inputClass}
              />

            </div>


            {/* Heart Rate */}

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">

              <div className="mb-3 flex items-center gap-2">

                <Activity
                  size={18}
                  className="text-indigo-500"
                />

                <span className="text-sm font-semibold text-slate-700">
                  Heart Rate
                </span>

              </div>

              <input
                type="number"
                value={heartRate}
                onChange={(e) =>
                  setHeartRate(e.target.value)
                }
                placeholder="BPM"
                className={inputClass}
              />

            </div>


            {/* Oxygen */}

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">

              <div className="mb-3 flex items-center gap-2">

                <ShieldCheck
                  size={18}
                  className="text-cyan-600"
                />

                <span className="text-sm font-semibold text-slate-700">
                  Oxygen
                </span>

              </div>

              <input
                type="number"
                value={oxygen}
                onChange={(e) =>
                  setOxygen(e.target.value)
                }
                placeholder="SpO₂ %"
                className={inputClass}
              />

            </div>

          </div>

        </section>


        {/* =================================================
            DAILY HEALTH
        ================================================= */}

        <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">

          <div className="mb-7 flex items-center gap-4">

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
              <Brain size={21} />
            </div>

            <div>

              <h2 className="text-xl font-bold text-slate-900">
                Daily Health
              </h2>

              <p className="text-sm text-slate-500">
                Add lifestyle and wellness information
              </p>

            </div>

          </div>


          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">

            {/* Sleep */}

            <div className="rounded-2xl border border-slate-200 p-4">

              <div className="mb-3 flex items-center gap-2">

                <Moon
                  size={18}
                  className="text-indigo-500"
                />

                <span className="text-sm font-semibold text-slate-700">
                  Sleep
                </span>

              </div>

              <input
                type="number"
                step="0.5"
                value={sleep}
                onChange={(e) =>
                  setSleep(e.target.value)
                }
                placeholder="Hours slept"
                className={inputClass}
              />

            </div>


            {/* Water */}

            <div className="rounded-2xl border border-slate-200 p-4">

              <div className="mb-3 flex items-center gap-2">

                <Droplets
                  size={18}
                  className="text-cyan-500"
                />

                <span className="text-sm font-semibold text-slate-700">
                  Water
                </span>

              </div>

              <input
                type="number"
                value={water}
                onChange={(e) =>
                  setWater(e.target.value)
                }
                placeholder="Glasses"
                className={inputClass}
              />

            </div>


            {/* Exercise */}

            <div className="rounded-2xl border border-slate-200 p-4">

              <div className="mb-3 flex items-center gap-2">

                <Dumbbell
                  size={18}
                  className="text-emerald-500"
                />

                <span className="text-sm font-semibold text-slate-700">
                  Exercise
                </span>

              </div>

              <input
                type="number"
                value={exercise}
                onChange={(e) =>
                  setExercise(e.target.value)
                }
                placeholder="Minutes"
                className={inputClass}
              />

            </div>


            {/* Food */}

            <div className="rounded-2xl border border-slate-200 p-4">

              <label className="mb-3 block text-sm font-semibold text-slate-700">
                Food habits
              </label>

              <select
                value={food}
                onChange={(e) =>
                  setFood(e.target.value)
                }
                className={inputClass}
              >
                <option>Healthy</option>
                <option>Balanced</option>
                <option>Needs Improvement</option>
              </select>

            </div>


            {/* Mood */}

            <div className="rounded-2xl border border-slate-200 p-4">

              <div className="mb-3 flex items-center gap-2">

                <Smile
                  size={18}
                  className="text-amber-500"
                />

                <span className="text-sm font-semibold text-slate-700">
                  Mood
                </span>

              </div>

              <select
                value={mood}
                onChange={(e) =>
                  setMood(e.target.value)
                }
                className={inputClass}
              >
                <option>Excellent</option>
                <option>Good</option>
                <option>Okay</option>
                <option>Low</option>
                <option>Very Low</option>
              </select>

            </div>


            {/* Feeling */}

            <div className="rounded-2xl border border-slate-200 p-4">

              <label className="mb-3 block text-sm font-semibold text-slate-700">
                Physical feeling
              </label>

              <select
                value={feeling}
                onChange={(e) =>
                  setFeeling(e.target.value)
                }
                className={inputClass}
              >
                <option>Normal</option>
                <option>Energetic</option>
                <option>Tired</option>
                <option>Weak</option>
                <option>Feverish</option>
                <option>Headache</option>
                <option>Dizzy</option>
              </select>

            </div>

          </div>

        </section>


        {/* =================================================
            GENERATE BUTTON
        ================================================= */}

        <div className="mb-10 flex justify-center">

          <button
            onClick={generateReport}
            className="group flex items-center gap-3 rounded-2xl bg-indigo-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 hover:shadow-xl md:px-10"
          >

            <FileText
              size={21}
            />

            Generate Health Report

            <span className="transition group-hover:translate-x-1">
              →
            </span>

          </button>

        </div>


        {/* =================================================
            GENERATED REPORT
        ================================================= */}

        {report && (

          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">

            {/* REPORT TOP */}

            <div className="border-b border-slate-200 bg-gradient-to-r from-indigo-50 via-white to-cyan-50 p-6 md:p-8">

              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

                <div>

                  <div className="mb-2 flex items-center gap-2">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
                      <Sparkles size={19} />
                    </div>

                    <span className="font-bold text-indigo-700">
                      MediAI
                    </span>

                  </div>

                  <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                    Health Assessment Report
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    Generated on {report.date}
                  </p>

                </div>


                <div className="rounded-2xl border border-white bg-white/80 px-5 py-4 shadow-sm">

                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Report ID
                  </p>

                  <p className="mt-1 font-bold text-slate-800">
                    {report.reportId}
                  </p>

                </div>

              </div>

            </div>


            <div className="p-6 md:p-8">

              {/* PATIENT SUMMARY */}

              <div className="mb-8 grid gap-4 md:grid-cols-4">

                <div className="rounded-2xl bg-slate-50 p-5">

                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Patient
                  </p>

                  <p className="mt-2 font-bold text-slate-800">
                    {report.patientName}
                  </p>

                </div>

                <div className="rounded-2xl bg-slate-50 p-5">

                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Age
                  </p>

                  <p className="mt-2 font-bold text-slate-800">
                    {report.age}
                  </p>

                </div>

                <div className="rounded-2xl bg-slate-50 p-5">

                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Gender
                  </p>

                  <p className="mt-2 font-bold text-slate-800">
                    {report.gender || "Not provided"}
                  </p>

                </div>

                <div className="rounded-2xl bg-slate-50 p-5">

                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Assessment
                  </p>

                  <p className="mt-2 font-bold text-slate-800">
                    {report.reportReason || "General"}
                  </p>

                </div>

              </div>


              {/* SYMPTOMS */}

              <div className="mb-8">

                <div className="mb-4 flex items-center gap-3">

                  <Activity
                    size={20}
                    className="text-emerald-600"
                  />

                  <h3 className="text-lg font-bold">
                    Symptoms
                  </h3>

                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 leading-7 text-slate-700">
                  {report.symptoms}
                </div>

              </div>


              {/* VITALS */}

              <div className="mb-8">

                <div className="mb-4 flex items-center gap-3">

                  <HeartPulse
                    size={20}
                    className="text-rose-600"
                  />

                  <h3 className="text-lg font-bold">
                    Vital Measurements
                  </h3>

                </div>


                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

                  <div className="rounded-2xl border border-slate-200 p-5">

                    <Thermometer
                      size={19}
                      className="mb-3 text-orange-500"
                    />

                    <p className="text-xs text-slate-400">
                      Temperature
                    </p>

                    <p className="mt-1 font-bold text-slate-800">
                      {report.temperature || "—"} °C
                    </p>

                  </div>


                  <div className="rounded-2xl border border-slate-200 p-5">

                    <HeartPulse
                      size={19}
                      className="mb-3 text-rose-500"
                    />

                    <p className="text-xs text-slate-400">
                      Blood Pressure
                    </p>

                    <p className="mt-1 font-bold text-slate-800">
                      {report.bloodPressure || "—"}
                    </p>

                  </div>


                  <div className="rounded-2xl border border-slate-200 p-5">

                    <Activity
                      size={19}
                      className="mb-3 text-indigo-500"
                    />

                    <p className="text-xs text-slate-400">
                      Heart Rate
                    </p>

                    <p className="mt-1 font-bold text-slate-800">
                      {report.heartRate || "—"} BPM
                    </p>

                  </div>


                  <div className="rounded-2xl border border-slate-200 p-5">

                    <ShieldCheck
                      size={19}
                      className="mb-3 text-cyan-600"
                    />

                    <p className="text-xs text-slate-400">
                      SpO₂
                    </p>

                    <p className="mt-1 font-bold text-slate-800">
                      {report.oxygen || "—"} %
                    </p>

                  </div>

                </div>

              </div>


              {/* DAILY HEALTH */}

              <div className="mb-8">

                <div className="mb-4 flex items-center gap-3">

                  <Brain
                    size={20}
                    className="text-violet-600"
                  />

                  <h3 className="text-lg font-bold">
                    Daily Health
                  </h3>

                </div>


                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">

                  <div className="rounded-2xl bg-indigo-50 p-5">
                    <Moon
                      size={18}
                      className="mb-3 text-indigo-500"
                    />
                    <p className="text-xs text-slate-500">
                      Sleep
                    </p>
                    <p className="mt-1 font-bold">
                      {report.sleep || "—"} hours
                    </p>
                  </div>

                  <div className="rounded-2xl bg-cyan-50 p-5">
                    <Droplets
                      size={18}
                      className="mb-3 text-cyan-500"
                    />
                    <p className="text-xs text-slate-500">
                      Water
                    </p>
                    <p className="mt-1 font-bold">
                      {report.water || "—"} glasses
                    </p>
                  </div>

                  <div className="rounded-2xl bg-emerald-50 p-5">
                    <Dumbbell
                      size={18}
                      className="mb-3 text-emerald-500"
                    />
                    <p className="text-xs text-slate-500">
                      Exercise
                    </p>
                    <p className="mt-1 font-bold">
                      {report.exercise || "—"} min
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-5">
                    <p className="text-xs text-slate-500">
                      Food
                    </p>
                    <p className="mt-1 font-bold">
                      {report.food}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-amber-50 p-5">
                    <Smile
                      size={18}
                      className="mb-3 text-amber-500"
                    />
                    <p className="text-xs text-slate-500">
                      Mood
                    </p>
                    <p className="mt-1 font-bold">
                      {report.mood}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-violet-50 p-5">
                    <p className="text-xs text-slate-500">
                      Physical Feeling
                    </p>
                    <p className="mt-1 font-bold">
                      {report.feeling}
                    </p>
                  </div>

                </div>

              </div>


              {/* AI ASSESSMENT */}

              <div className="mb-8 rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-6 md:p-8">

                <div className="mb-6 flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
                    <Sparkles size={18} />
                  </div>

                  <div>

                    <h3 className="text-lg font-bold">
                      AI-Assisted Assessment
                    </h3>

                    <p className="text-sm text-slate-500">
                      Based on the information entered above
                    </p>

                  </div>

                </div>


                <div className="grid gap-5 md:grid-cols-2">

                  {/* SCORE */}

                  <div className="rounded-2xl bg-white p-6 text-center shadow-sm">

                    <p className="text-sm font-semibold text-slate-500">
                      Wellness Score
                    </p>

                    <div className="mt-4 flex items-center justify-center">

                      <div className="flex h-32 w-32 items-center justify-center rounded-full border-[10px] border-indigo-100">

                        <div>

                          <p className="text-4xl font-bold text-indigo-600">
                            {report.score}
                          </p>

                          <p className="text-xs text-slate-400">
                            / 100
                          </p>

                        </div>

                      </div>

                    </div>

                  </div>


                  {/* RISK */}

                  <div className="rounded-2xl bg-white p-6 text-center shadow-sm">

                    <p className="text-sm font-semibold text-slate-500">
                      Potential Risk Indicator
                    </p>

                    <div className="mt-7 flex justify-center">

                      <div
                        className={`flex items-center gap-2 rounded-full px-6 py-3 text-lg font-bold ${
                          report.risk === "Low"
                            ? "bg-emerald-100 text-emerald-700"
                            : report.risk === "Medium"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >

                        {report.risk === "Low" ? (
                          <CheckCircle2 size={20} />
                        ) : (
                          <AlertCircle size={20} />
                        )}

                        {report.risk} Risk

                      </div>

                    </div>

                    <p className="mt-5 text-xs leading-5 text-slate-400">
                      This is an educational indicator and not a medical diagnosis.
                    </p>

                  </div>

                </div>

              </div>


              {/* OBSERVATIONS */}

              <div className="mb-8">

                <div className="mb-4 flex items-center gap-3">

                  <ClipboardCheck
                    size={20}
                    className="text-indigo-600"
                  />

                  <h3 className="text-lg font-bold">
                    Observations
                  </h3>

                </div>


                {report.observations.length === 0 ? (

                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5 text-sm text-emerald-700">

                    No additional observations were generated.

                  </div>

                ) : (

                  <div className="space-y-3">

                    {report.observations.map(
                      (item, index) => (

                        <div
                          key={index}
                          className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"
                        >

                          <AlertCircle
                            size={19}
                            className="mt-0.5 shrink-0 text-amber-500"
                          />

                          <p className="text-sm leading-6 text-slate-700">
                            {item}
                          </p>

                        </div>

                      )
                    )}

                  </div>

                )}

              </div>


              {/* =================================================
                  DOCTOR REVIEW
              ================================================= */}

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 md:p-8">

                <div className="mb-7 flex items-center gap-4">

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm">
                    <Stethoscope size={21} />
                  </div>

                  <div>

                    <h3 className="text-xl font-bold">
                      Doctor Review
                    </h3>

                    <p className="text-sm text-slate-500">
                      Optional clinical review and approval
                    </p>

                  </div>

                </div>


                <div className="grid gap-5 md:grid-cols-2">

                  <div>

                    <label className={labelClass}>
                      Doctor Name
                    </label>

                    <input
                      value={doctorName}
                      onChange={(e) => {
                        setDoctorName(e.target.value);

                        updateReport(
                          "doctorName",
                          e.target.value
                        );
                      }}
                      placeholder="Doctor name"
                      className={inputClass}
                    />

                  </div>


                  <div>

                    <label className={labelClass}>
                      Medical Registration Number
                    </label>

                    <input
                      value={registrationNumber}
                      onChange={(e) => {
                        setRegistrationNumber(
                          e.target.value
                        );

                        updateReport(
                          "registrationNumber",
                          e.target.value
                        );
                      }}
                      placeholder="Registration number"
                      className={inputClass}
                    />

                  </div>


                  <div>

                    <label className={labelClass}>
                      Qualification
                    </label>

                    <input
                      value={qualification}
                      onChange={(e) => {
                        setQualification(
                          e.target.value
                        );

                        updateReport(
                          "qualification",
                          e.target.value
                        );
                      }}
                      placeholder="Example: MBBS, MD"
                      className={inputClass}
                    />

                  </div>


                  <div>

                    <label className={labelClass}>
                      Doctor Decision
                    </label>

                    <select
                      value={doctorDecision}
                      onChange={(e) => {
                        setDoctorDecision(
                          e.target.value
                        );

                        updateReport(
                          "doctorDecision",
                          e.target.value
                        );
                      }}
                      className={inputClass}
                    >

                      <option>
                        Pending Doctor Review
                      </option>

                      <option>
                        Reviewed
                      </option>

                      <option>
                        Requires Further Investigation
                      </option>

                      <option>
                        Referred
                      </option>

                    </select>

                  </div>

                </div>


                <div className="mt-5">

                  <label className={labelClass}>
                    Clinical Comments
                  </label>

                  <textarea
                    rows="4"
                    value={doctorComments}
                    onChange={(e) => {
                      setDoctorComments(
                        e.target.value
                      );

                      updateReport(
                        "doctorComments",
                        e.target.value
                      );
                    }}
                    placeholder="Doctor's clinical comments..."
                    className={`${inputClass} resize-none`}
                  />

                </div>


                <div className="mt-7">

                  <p className="mb-3 text-sm font-semibold text-slate-700">
                    Doctor Signature
                  </p>

                  <div className="h-12 w-72 border-b-2 border-slate-300" />

                </div>

              </div>


              {/* =================================================
                  DOWNLOAD
              ================================================= */}

              <div className="mt-10 flex flex-col items-center justify-center border-t border-slate-200 pt-8">

                <button
                  onClick={downloadPDF}
                  className="flex items-center gap-3 rounded-2xl bg-emerald-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-emerald-100 transition hover:bg-emerald-700 hover:shadow-xl"
                >

                  <Download size={21} />

                  Download Health Report PDF

                </button>

                <p className="mt-3 flex items-center gap-2 text-xs text-slate-400">

                  <CheckCircle2 size={14} />

                  PDF will be downloaded securely to your device.

                </p>

              </div>


              {/* =================================================
                  DISCLAIMER
              ================================================= */}

              <div className="mt-8 flex items-start gap-3 rounded-2xl bg-slate-50 p-5">

                <ShieldCheck
                  size={19}
                  className="mt-0.5 shrink-0 text-slate-500"
                />

                <p className="text-xs leading-5 text-slate-500">

                  <strong className="text-slate-700">
                    Disclaimer:
                  </strong>{" "}
                  This report contains patient-provided
                  information and AI-assisted analysis. It
                  is not a medical diagnosis. A qualified
                  healthcare professional must review and
                  approve the report before it is treated as
                  a clinical document.

                </p>

              </div>

            </div>

          </section>

        )}

      </main>

    </div>
  );
}

export default HealthReports;