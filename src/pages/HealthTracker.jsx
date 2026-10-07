import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Droplets,
  Footprints,
  Moon,
  Smile,
  CalendarDays,
  CheckCircle2,
  Sparkles,
  TrendingUp,
} from "lucide-react";

function HealthTracker() {
  const navigate = useNavigate();

  // --------------------------------------------------
  // DATE HELPERS
  // --------------------------------------------------

  const getLocalDateKey = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const todayKey = getLocalDateKey();

  const parseDateKey = (key) => {
    const [year, month, day] = key.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const formatDate = (key) => {
    const date = parseDateKey(key);

    return date.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatShortDate = (key) => {
    const date = parseDateKey(key);

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  };


  // --------------------------------------------------
  // DEFAULT RECORD
  // --------------------------------------------------

  const createEmptyRecord = () => ({
    water: 0,
    steps: 0,
    sleep: 0,
    mood: "",
  });


  // --------------------------------------------------
  // RECORDS
  // --------------------------------------------------

  const [records, setRecords] = useState(() => {
    try {
      const saved = localStorage.getItem("mediai_wellness_records");

      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.error("Unable to load wellness records:", error);
      return {};
    }
  });


  // --------------------------------------------------
  // SELECTED DATE
  // --------------------------------------------------

  const [selectedDate, setSelectedDate] = useState(todayKey);


  // --------------------------------------------------
  // CURRENT CALENDAR MONTH
  // --------------------------------------------------

  const today = new Date();

  const [calendarMonth, setCalendarMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );


  // --------------------------------------------------
  // GOALS
  // --------------------------------------------------

  const waterGoal = 8;
  const stepsGoal = 10000;
  const sleepGoal = 8;


  // --------------------------------------------------
  // CURRENT RECORD
  // --------------------------------------------------

  const currentRecord = records[selectedDate] || createEmptyRecord();


  // --------------------------------------------------
  // SAVE RECORDS
  // --------------------------------------------------

  useEffect(() => {
    localStorage.setItem(
      "mediai_wellness_records",
      JSON.stringify(records)
    );
  }, [records]);


  // --------------------------------------------------
  // UPDATE RECORD
  // --------------------------------------------------

  const updateRecord = (changes) => {
    setRecords((previous) => ({
      ...previous,
      [selectedDate]: {
        ...(previous[selectedDate] || createEmptyRecord()),
        ...changes,
      },
    }));
  };


  // --------------------------------------------------
  // ADD WATER
  // --------------------------------------------------

  const addWater = () => {
    const newValue = Math.min(
      currentRecord.water + 1,
      waterGoal
    );

    updateRecord({
      water: newValue,
    });
  };


  // --------------------------------------------------
  // ADD STEPS
  // --------------------------------------------------

  const addSteps = () => {
    const newValue = Math.min(
      currentRecord.steps + 500,
      stepsGoal
    );

    updateRecord({
      steps: newValue,
    });
  };


  // --------------------------------------------------
  // ADD SLEEP
  // --------------------------------------------------

  const addSleep = () => {
    const newValue = Math.min(
      currentRecord.sleep + 1,
      sleepGoal
    );

    updateRecord({
      sleep: newValue,
    });
  };


  // --------------------------------------------------
  // MOOD
  // --------------------------------------------------

  const moods = [
    {
      name: "Great",
      emoji: "😄",
    },
    {
      name: "Good",
      emoji: "🙂",
    },
    {
      name: "Okay",
      emoji: "😐",
    },
    {
      name: "Low",
      emoji: "😔",
    },
  ];


  // --------------------------------------------------
  // PROGRESS
  // --------------------------------------------------

  const waterProgress = Math.min(
    (currentRecord.water / waterGoal) * 100,
    100
  );

  const stepsProgress = Math.min(
    (currentRecord.steps / stepsGoal) * 100,
    100
  );

  const sleepProgress = Math.min(
    (currentRecord.sleep / sleepGoal) * 100,
    100
  );

  const wellnessScore = Math.round(
    (waterProgress +
      stepsProgress +
      sleepProgress) /
      3
  );


  // --------------------------------------------------
  // CALENDAR DAYS
  // --------------------------------------------------

  const calendarDays = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const daysInMonth = lastDay.getDate();

    // Monday = 0
    let startingDay = firstDay.getDay() - 1;

    if (startingDay < 0) {
      startingDay = 6;
    }

    const days = [];

    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        new Date(year, month, day)
      );
    }

    return days;
  }, [calendarMonth]);


  // --------------------------------------------------
  // MONTH NAME
  // --------------------------------------------------

  const monthName = calendarMonth.toLocaleDateString(
    "en-IN",
    {
      month: "long",
      year: "numeric",
    }
  );


  // --------------------------------------------------
  // MONTH NAVIGATION
  // --------------------------------------------------

  const previousMonth = () => {
    setCalendarMonth(
      new Date(
        calendarMonth.getFullYear(),
        calendarMonth.getMonth() - 1,
        1
      )
    );
  };

  const nextMonth = () => {
    const next = new Date(
      calendarMonth.getFullYear(),
      calendarMonth.getMonth() + 1,
      1
    );

    // Don't allow going beyond current month
    const currentMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    if (next <= currentMonth) {
      setCalendarMonth(next);
    }
  };


  // --------------------------------------------------
  // SELECT DATE
  // --------------------------------------------------

  const selectDate = (date) => {
    if (!date) return;

    const key = getLocalDateKey(date);

    // Don't allow future dates
    if (key > todayKey) return;

    setSelectedDate(key);
  };


  // --------------------------------------------------
  // FIND SELECTED MOOD
  // --------------------------------------------------

  const selectedMood =
    moods.find(
      (item) => item.name === currentRecord.mood
    ) || null;


  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <header className="border-b border-slate-200 bg-white">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">

          {/* Back */}

          <button
            onClick={() =>
              navigate("/health-check")
            }
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <ArrowLeft size={18} />

            Back to Health Hub
          </button>


          {/* Logo */}

          <div className="hidden items-center sm:flex">

            <img
              src="/mediai-logo.png"
              alt="MediAI"
              className="h-11 w-auto object-contain"
            />

          </div>


          {/* Page Label */}

          <div className="flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700">

            <Sparkles size={14} />

            Wellness Tracker

          </div>

        </div>

      </header>


      {/* ================================================= */}
      {/* MAIN */}
      {/* ================================================= */}

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">


        {/* ================================================= */}
        {/* INTRO */}
        {/* ================================================= */}

        <div className="mb-8">

          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1.5 text-sm font-medium text-teal-700">

            <CalendarDays size={16} />

            Daily wellness

          </div>


          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">

            Take care of yourself,
            <br />

            one day at a time.

          </h1>


          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">

            Track hydration, movement, sleep and mood.
            Select a date to view or update that day's
            wellness record.

          </p>

        </div>


        {/* ================================================= */}
        {/* DATE + SCORE */}
        {/* ================================================= */}

        <section className="mb-6 overflow-hidden rounded-3xl bg-slate-900 p-6 text-white shadow-sm sm:p-7">

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

            <div>

              <div className="flex items-center gap-2 text-sm font-medium text-teal-300">

                <CalendarDays size={16} />

                Selected day

              </div>


              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">

                {formatDate(selectedDate)}

              </h2>


              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">

                Your wellness information below belongs specifically
                to this date.

              </p>

            </div>


            {/* Score */}

            <div className="flex items-center gap-4">

              <div className="text-right">

                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">

                  Wellness progress

                </p>

                <p className="mt-1 text-2xl font-bold">

                  {wellnessScore}%

                </p>

              </div>


              <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-4 border-slate-700">

                <div
                  className="absolute inset-0 rounded-full border-4 border-teal-400"
                  style={{
                    clipPath: `inset(${100 - wellnessScore}% 0 0 0)`,
                  }}
                />

                <TrendingUp
                  size={24}
                  className="text-teal-300"
                />

              </div>

            </div>

          </div>

        </section>


        {/* ================================================= */}
        {/* CALENDAR + DAILY SUMMARY */}
        {/* ================================================= */}

        <div className="mb-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">


          {/* ================= CALENDAR ================= */}

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-6 flex items-center justify-between">

              <div>

                <p className="text-sm font-semibold text-teal-600">

                  WELLNESS CALENDAR

                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">

                  {monthName}

                </h2>

              </div>


              <div className="flex items-center gap-2">

                <button
                  onClick={previousMonth}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50"
                  title="Previous month"
                >

                  <ChevronLeft size={18} />

                </button>


                <button
                  onClick={nextMonth}
                  disabled={
                    calendarMonth.getFullYear() ===
                      today.getFullYear() &&
                    calendarMonth.getMonth() ===
                      today.getMonth()
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30"
                  title="Next month"
                >

                  <ChevronRight size={18} />

                </button>

              </div>

            </div>


            {/* Weekdays */}

            <div className="mb-2 grid grid-cols-7">

              {[
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat",
                "Sun",
              ].map((day) => (

                <div
                  key={day}
                  className="py-2 text-center text-xs font-semibold text-slate-400"
                >

                  {day}

                </div>

              ))}

            </div>


            {/* Calendar */}

            <div className="grid grid-cols-7 gap-1.5">

              {calendarDays.map((date, index) => {

                if (!date) {
                  return (
                    <div
                      key={`empty-${index}`}
                      className="aspect-square"
                    />
                  );
                }


                const key =
                  getLocalDateKey(date);

                const isSelected =
                  key === selectedDate;

                const isToday =
                  key === todayKey;

                const isFuture =
                  key > todayKey;

                const hasRecord =
                  Boolean(records[key]);


                return (

                  <button
                    key={key}
                    onClick={() =>
                      selectDate(date)
                    }
                    disabled={isFuture}
                    className={`relative aspect-square rounded-2xl text-sm font-medium transition ${
                      isSelected
                        ? "bg-indigo-600 text-white shadow-md"
                        : isFuture
                        ? "cursor-not-allowed text-slate-200"
                        : "text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
                    }`}
                  >

                    {date.getDate()}


                    {/* Today */}

                    {isToday && !isSelected && (

                      <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-indigo-500" />

                    )}


                    {/* Has Record */}

                    {hasRecord && !isSelected && (

                      <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-teal-500" />

                    )}

                  </button>

                );
              })}

            </div>


            {/* Legend */}

            <div className="mt-5 flex flex-wrap items-center gap-5 text-xs text-slate-500">

              <div className="flex items-center gap-2">

                <span className="h-2 w-2 rounded-full bg-teal-500" />

                Record saved

              </div>


              <div className="flex items-center gap-2">

                <span className="h-2 w-2 rounded-full bg-indigo-500" />

                Today

              </div>

            </div>

          </section>


          {/* ================= DAILY SUMMARY ================= */}

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-6">

              <p className="text-sm font-semibold text-teal-600">

                DAILY SUMMARY

              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">

                {formatShortDate(selectedDate)}

              </h2>

            </div>


            <div className="space-y-4">


              {/* Water */}

              <div className="rounded-2xl bg-cyan-50 p-4">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white">

                      <Droplets
                        size={20}
                        className="text-cyan-500"
                      />

                    </div>

                    <div>

                      <p className="text-sm font-semibold text-slate-800">

                        Water

                      </p>

                      <p className="text-xs text-slate-500">

                        Hydration

                      </p>

                    </div>

                  </div>


                  <p className="font-bold text-slate-800">

                    {currentRecord.water}/{waterGoal}

                  </p>

                </div>


                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">

                  <div
                    className="h-full rounded-full bg-cyan-500 transition-all duration-500"
                    style={{
                      width: `${waterProgress}%`,
                    }}
                  />

                </div>

              </div>


              {/* Steps */}

              <div className="rounded-2xl bg-orange-50 p-4">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white">

                      <Footprints
                        size={20}
                        className="text-orange-500"
                      />

                    </div>

                    <div>

                      <p className="text-sm font-semibold text-slate-800">

                        Steps

                      </p>

                      <p className="text-xs text-slate-500">

                        Daily movement

                      </p>

                    </div>

                  </div>


                  <p className="font-bold text-slate-800">

                    {currentRecord.steps.toLocaleString()}

                  </p>

                </div>


                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">

                  <div
                    className="h-full rounded-full bg-orange-400 transition-all duration-500"
                    style={{
                      width: `${stepsProgress}%`,
                    }}
                  />

                </div>

              </div>


              {/* Sleep */}

              <div className="rounded-2xl bg-indigo-50 p-4">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white">

                      <Moon
                        size={20}
                        className="text-indigo-500"
                      />

                    </div>

                    <div>

                      <p className="text-sm font-semibold text-slate-800">

                        Sleep

                      </p>

                      <p className="text-xs text-slate-500">

                        Rest

                      </p>

                    </div>

                  </div>


                  <p className="font-bold text-slate-800">

                    {currentRecord.sleep}/{sleepGoal} hrs

                  </p>

                </div>


                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">

                  <div
                    className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                    style={{
                      width: `${sleepProgress}%`,
                    }}
                  />

                </div>

              </div>


              {/* Mood */}

              <div className="rounded-2xl bg-emerald-50 p-4">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white">

                      <Smile
                        size={20}
                        className="text-emerald-500"
                      />

                    </div>

                    <div>

                      <p className="text-sm font-semibold text-slate-800">

                        Mood

                      </p>

                      <p className="text-xs text-slate-500">

                        Daily check-in

                      </p>

                    </div>

                  </div>


                  <p className="font-bold text-slate-800">

                    {selectedMood
                      ? `${selectedMood.emoji} ${selectedMood.name}`
                      : "Not set"}

                  </p>

                </div>

              </div>

            </div>

          </section>

        </div>


        {/* ================================================= */}
        {/* TRACKERS */}
        {/* ================================================= */}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">


          {/* WATER */}

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-start justify-between">

              <div>

                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50">

                  <Droplets
                    size={23}
                    className="text-cyan-500"
                  />

                </div>


                <h3 className="text-lg font-bold">

                  Water

                </h3>


                <p className="mt-1 text-sm text-slate-500">

                  Daily hydration

                </p>

              </div>


              <span className="text-sm font-semibold text-slate-400">

                {currentRecord.water}/{waterGoal}

              </span>

            </div>


            <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-100">

              <div
                className="h-full rounded-full bg-cyan-500 transition-all duration-500"
                style={{
                  width: `${waterProgress}%`,
                }}
              />

            </div>


            <button
              onClick={addWater}
              disabled={currentRecord.water >= waterGoal}
              className="mt-5 w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            >

              + Add Glass

            </button>

          </section>


          {/* STEPS */}

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-start justify-between">

              <div>

                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50">

                  <Footprints
                    size={23}
                    className="text-orange-500"
                  />

                </div>


                <h3 className="text-lg font-bold">

                  Steps

                </h3>


                <p className="mt-1 text-sm text-slate-500">

                  Daily movement

                </p>

              </div>


              <span className="text-sm font-semibold text-slate-400">

                {currentRecord.steps.toLocaleString()}

              </span>

            </div>


            <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-100">

              <div
                className="h-full rounded-full bg-orange-400 transition-all duration-500"
                style={{
                  width: `${stepsProgress}%`,
                }}
              />

            </div>


            <button
              onClick={addSteps}
              disabled={currentRecord.steps >= stepsGoal}
              className="mt-5 w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            >

              + Add 500 Steps

            </button>

          </section>


          {/* SLEEP */}

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-start justify-between">

              <div>

                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50">

                  <Moon
                    size={23}
                    className="text-indigo-500"
                  />

                </div>


                <h3 className="text-lg font-bold">

                  Sleep

                </h3>


                <p className="mt-1 text-sm text-slate-500">

                  Nightly rest

                </p>

              </div>


              <span className="text-sm font-semibold text-slate-400">

                {currentRecord.sleep}/{sleepGoal} hrs

              </span>

            </div>


            <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-100">

              <div
                className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                style={{
                  width: `${sleepProgress}%`,
                }}
              />

            </div>


            <button
              onClick={addSleep}
              disabled={currentRecord.sleep >= sleepGoal}
              className="mt-5 w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            >

              + Add 1 Hour

            </button>

          </section>

        </div>


        {/* ================================================= */}
        {/* MOOD */}
        {/* ================================================= */}

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">

          <div className="mb-6">

            <p className="text-sm font-semibold text-teal-600">

              MOOD CHECK-IN

            </p>


            <h2 className="mt-1 text-xl font-bold text-slate-900">

              How are you feeling on this day?

            </h2>


            <p className="mt-1 text-sm text-slate-500">

              Your mood is saved with the selected date.

            </p>

          </div>


          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

            {moods.map((item) => (

              <button
                key={item.name}
                onClick={() =>
                  updateRecord({
                    mood: item.name,
                  })
                }
                className={`rounded-2xl border p-4 text-center transition ${
                  currentRecord.mood === item.name
                    ? "border-teal-500 bg-teal-50 shadow-sm"
                    : "border-slate-200 bg-white hover:border-teal-200 hover:bg-slate-50"
                }`}
              >

                <div className="text-3xl">

                  {item.emoji}

                </div>


                <p className="mt-2 text-sm font-semibold text-slate-800">

                  {item.name}

                </p>

              </button>

            ))}

          </div>

        </section>


        {/* ================================================= */}
        {/* SAVED RECORD MESSAGE */}
        {/* ================================================= */}

        {records[selectedDate] && (

          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white">

              <CheckCircle2
                size={19}
                className="text-emerald-600"
              />

            </div>


            <div>

              <p className="text-sm font-semibold text-slate-800">

                Wellness record saved

              </p>


              <p className="text-xs text-slate-500">

                Your information for {formatShortDate(selectedDate)}
                is stored on this device.

              </p>

            </div>

          </div>

        )}


        {/* ================================================= */}
        {/* FOOTER NOTE */}
        {/* ================================================= */}

        <section className="mt-6 rounded-3xl border border-teal-100 bg-teal-50 p-6">

          <div className="flex gap-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white">

              <Sparkles
                size={20}
                className="text-teal-600"
              />

            </div>


            <div>

              <h3 className="font-semibold text-slate-900">

                Wellness is about consistency

              </h3>


              <p className="mt-1 text-sm leading-6 text-slate-600">

                Use this tracker to notice your daily habits and patterns.
                It is designed for personal wellness tracking and does not
                replace professional medical advice.

              </p>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default HealthTracker;