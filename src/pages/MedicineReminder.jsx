import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Pill,
  Trash2,
  Clock,
  HeartPulse,
  ShieldCheck,
  Plus,
  CalendarDays,
  CheckCircle2,
  Bell,
  Volume2,
} from "lucide-react";

/* =========================================================
   STORAGE KEY
========================================================= */

const STORAGE_KEY = "mediai_medicine_reminders";

/* =========================================================
   MEDICINE REMINDER
========================================================= */

function MedicineReminder() {
  const [medicineName, setMedicineName] = useState("");
  const [dosage, setDosage] = useState("");
  const [time, setTime] = useState("");

  const [reminders, setReminders] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (!saved) {
        return [];
      }

      const parsed = JSON.parse(saved);

      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error(
        "Unable to load medicine reminders:",
        error
      );

      return [];
    }
  });

  const [notificationPermission, setNotificationPermission] =
    useState(
      typeof Notification !== "undefined"
        ? Notification.permission
        : "default"
    );

  const audioContextRef = useRef(null);

  /* =======================================================
     SAVE REMINDERS TO LOCAL STORAGE
  ======================================================= */

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(reminders)
      );
    } catch (error) {
      console.error(
        "Unable to save medicine reminders:",
        error
      );
    }
  }, [reminders]);

  /* =======================================================
     REQUEST NOTIFICATION PERMISSION
  ======================================================= */

  const requestNotificationPermission = async () => {
    if (
      typeof Notification === "undefined"
    ) {
      return;
    }

    if (
      Notification.permission === "granted"
    ) {
      setNotificationPermission("granted");
      return;
    }

    if (
      Notification.permission === "denied"
    ) {
      setNotificationPermission("denied");
      return;
    }

    try {
      const permission =
        await Notification.requestPermission();

      setNotificationPermission(permission);
    } catch (error) {
      console.error(
        "Notification permission error:",
        error
      );
    }
  };

  /* =======================================================
     ALARM SOUND
  ======================================================= */

  const playAlarmSound = () => {
    try {
      const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;

      if (!AudioContext) {
        return;
      }

      if (!audioContextRef.current) {
        audioContextRef.current =
          new AudioContext();
      }

      const audioContext =
        audioContextRef.current;

      if (
        audioContext.state === "suspended"
      ) {
        audioContext.resume();
      }

      const playBeep = (
        startTime,
        frequency
      ) => {
        const oscillator =
          audioContext.createOscillator();

        const gain =
          audioContext.createGain();

        oscillator.type = "sine";
        oscillator.frequency.value =
          frequency;

        gain.gain.setValueAtTime(
          0.0001,
          startTime
        );

        gain.gain.exponentialRampToValueAtTime(
          0.35,
          startTime + 0.03
        );

        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          startTime + 0.45
        );

        oscillator.connect(gain);
        gain.connect(
          audioContext.destination
        );

        oscillator.start(startTime);
        oscillator.stop(startTime + 0.5);
      };

      const now =
        audioContext.currentTime;

      playBeep(now, 880);
      playBeep(now + 0.55, 660);
      playBeep(now + 1.1, 880);
      playBeep(now + 1.65, 660);
    } catch (error) {
      console.error(
        "Unable to play reminder alarm:",
        error
      );
    }
  };

  /* =======================================================
     SHOW NOTIFICATION
  ======================================================= */

  const showMedicineNotification = (
    reminder
  ) => {
    if (
      typeof Notification === "undefined"
    ) {
      return;
    }

    if (
      Notification.permission !== "granted"
    ) {
      return;
    }

    try {
      const notification =
        new Notification(
          "💊 MediAI Medicine Reminder",
          {
            body: `Time to take ${reminder.medicineName}${
              reminder.dosage
                ? ` — ${reminder.dosage}`
                : ""
            }`,
            icon: "/favicon.ico",
            tag: `medicine-${reminder.id}`,
            requireInteraction: true,
          }
        );

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } catch (error) {
      console.error(
        "Unable to show notification:",
        error
      );
    }
  };

  /* =======================================================
     CHECK REMINDERS
  ======================================================= */

  useEffect(() => {
    if (!reminders.length) {
      return;
    }

    const checkReminders = () => {
      const now = new Date();

      const currentHours =
        String(now.getHours()).padStart(
          2,
          "0"
        );

      const currentMinutes =
        String(now.getMinutes()).padStart(
          2,
          "0"
        );

      const currentTime = `${currentHours}:${currentMinutes}`;

      const currentDate =
        now.toISOString().split("T")[0];

      reminders.forEach((reminder) => {
        if (
          reminder.time !== currentTime
        ) {
          return;
        }

        const alreadyTriggered =
          reminder.lastTriggeredDate ===
          currentDate;

        if (alreadyTriggered) {
          return;
        }

        /* Play alarm */
        playAlarmSound();

        /* Browser notification */
        showMedicineNotification(
          reminder
        );

        /* Save today's trigger date */
        setReminders((currentReminders) =>
          currentReminders.map((item) =>
            item.id === reminder.id
              ? {
                  ...item,
                  lastTriggeredDate:
                    currentDate,
                }
              : item
          )
        );
      });
    };

    /* Check immediately */
    checkReminders();

    /* Check every 5 seconds */
    const interval = setInterval(
      checkReminders,
      5000
    );

    return () => {
      clearInterval(interval);
    };
  }, [reminders]);

  /* =======================================================
     ADD REMINDER
  ======================================================= */

  const addReminder = async (e) => {
    e.preventDefault();

    if (
      medicineName.trim() === "" ||
      dosage.trim() === "" ||
      time === ""
    ) {
      alert(
        "Please fill all the fields."
      );

      return;
    }

    /* Ask notification permission */
    await requestNotificationPermission();

    const newReminder = {
      id: Date.now(),
      medicineName:
        medicineName.trim(),
      dosage: dosage.trim(),
      time: time,
      lastTriggeredDate: null,
    };

    setReminders((currentReminders) => [
      ...currentReminders,
      newReminder,
    ]);

    setMedicineName("");
    setDosage("");
    setTime("");
  };

  /* =======================================================
     DELETE REMINDER
  ======================================================= */

  const deleteReminder = (id) => {
    setReminders((currentReminders) =>
      currentReminders.filter(
        (reminder) =>
          reminder.id !== id
      )
    );
  };

  /* =======================================================
     REQUEST NOTIFICATION BUTTON
  ======================================================= */

  const enableNotifications = async () => {
    await requestNotificationPermission();
  };

  /* =======================================================
     FORMAT TIME
  ======================================================= */

  const formatTime = (timeValue) => {
    if (!timeValue) {
      return "";
    }

    const [hours, minutes] =
      timeValue.split(":");

    const date = new Date();

    date.setHours(
      Number(hours),
      Number(minutes),
      0,
      0
    );

    return date.toLocaleTimeString(
      [],
      {
        hour: "numeric",
        minute: "2-digit",
      }
    );
  };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">

          <Link
            to="/health-check"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <ArrowLeft size={18} />

            <span>
              Back to Health Hub
            </span>
          </Link>

          <div className="hidden items-center gap-2 sm:flex">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50">
              <HeartPulse
                size={20}
                className="text-indigo-600"
              />
            </div>

            <span className="text-lg font-bold text-slate-900">
              Medi
              <span className="text-indigo-600">
                AI
              </span>
            </span>

          </div>

          <div className="flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
            <ShieldCheck size={15} />
            Medication tracking
          </div>

        </div>
      </header>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-12">

        {/* =================================================
            HEADING
        ================================================= */}

        <div className="mb-8">

          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700">
            <Pill size={16} />
            Medicine Reminder
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Stay on top of your medicines
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Add your medicines and set simple reminders to help you keep track
            of your daily schedule.
          </p>

        </div>

        {/* =================================================
            NOTIFICATION STATUS
        ================================================= */}

        <div className="mb-6 rounded-2xl border border-indigo-100 bg-indigo-50 p-4">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-start gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600">
                <Bell size={19} />
              </div>

              <div>

                <p className="text-sm font-semibold text-indigo-900">
                  Reminder notifications
                </p>

                <p className="mt-1 text-xs leading-5 text-indigo-700">
                  {notificationPermission ===
                  "granted"
                    ? "Notifications are enabled. MediAI can notify you when a medicine is due."
                    : notificationPermission ===
                      "denied"
                    ? "Notifications are blocked in your browser. You can enable them from your browser settings."
                    : "Allow notifications so MediAI can alert you when your medicine is due."}
                </p>

              </div>

            </div>

            {notificationPermission !==
              "granted" &&
              notificationPermission !==
                "denied" && (
                <button
                  type="button"
                  onClick={
                    enableNotifications
                  }
                  className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-indigo-700"
                >
                  <Bell size={15} />
                  Enable Notifications
                </button>
              )}

          </div>

        </div>

        {/* =================================================
            MAIN GRID
        ================================================= */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.9fr_1.1fr]">

          {/* =================================================
              ADD MEDICINE
          ================================================= */}

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

            <div className="mb-7 flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50">
                <Plus
                  size={25}
                  className="text-indigo-600"
                />
              </div>

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  Add a medicine
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Create a new reminder in a few seconds.
                </p>

              </div>

            </div>

            <form onSubmit={addReminder}>

              {/* Medicine Name */}

              <div className="mb-5">

                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Medicine name
                </label>

                <input
                  type="text"
                  placeholder="Example: Paracetamol"
                  value={medicineName}
                  onChange={(e) =>
                    setMedicineName(
                      e.target.value
                    )
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />

              </div>

              {/* Dosage */}

              <div className="mb-5">

                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Dosage
                </label>

                <input
                  type="text"
                  placeholder="Example: 500 mg"
                  value={dosage}
                  onChange={(e) =>
                    setDosage(
                      e.target.value
                    )
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />

              </div>

              {/* Time */}

              <div className="mb-6">

                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Reminder time
                </label>

                <div className="relative">

                  <Clock
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="time"
                    value={time}
                    onChange={(e) =>
                      setTime(
                        e.target.value
                      )
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-11 py-3.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  />

                </div>

              </div>

              {/* Button */}

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-4 font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md active:scale-[0.99]"
              >
                <Plus size={19} />
                Add Reminder
              </button>

            </form>

            {/* Information */}

            <div className="mt-5 flex gap-3 rounded-2xl bg-slate-50 p-4">

              <ShieldCheck
                size={19}
                className="mt-0.5 shrink-0 text-slate-500"
              />

              <p className="text-xs leading-5 text-slate-500">
                Enter the medicine and dosage exactly as prescribed by your
                healthcare professional.
              </p>

            </div>

          </section>

          {/* =================================================
              REMINDERS
          ================================================= */}

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

            <div className="mb-7 flex items-start justify-between gap-4">

              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50">
                  <CalendarDays
                    size={24}
                    className="text-indigo-600"
                  />
                </div>

                <div>

                  <h2 className="text-xl font-bold text-slate-900">
                    Today's schedule
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Your scheduled medicines.
                  </p>

                </div>

              </div>

              <div className="hidden rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 sm:block">
                {reminders.length}{" "}
                {reminders.length === 1
                  ? "reminder"
                  : "reminders"}
              </div>

            </div>

            {reminders.length === 0 ? (

              /* =================================================
                 EMPTY STATE
              ================================================= */

              <div className="flex min-h-[390px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 text-center">

                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50">
                  <Pill
                    size={36}
                    className="text-indigo-300"
                  />
                </div>

                <h3 className="text-lg font-bold text-slate-800">
                  No medicines added yet
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  Add your first medicine using the form on the left. Your
                  scheduled medicines will appear here.
                </p>

                <div className="mt-6 flex items-center gap-2 text-xs font-medium text-slate-400">
                  <CheckCircle2 size={15} />
                  Easy daily tracking
                </div>

              </div>

            ) : (

              /* =================================================
                 REMINDER LIST
              ================================================= */

              <div className="space-y-4">

                {reminders.map(
                  (reminder) => (

                    <div
                      key={reminder.id}
                      className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-indigo-200 hover:shadow-md"
                    >

                      <div className="flex items-center justify-between gap-4">

                        <div className="flex min-w-0 items-center gap-4">

                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50">
                            <Pill
                              size={23}
                              className="text-indigo-600"
                            />
                          </div>

                          <div className="min-w-0">

                            <h3 className="truncate text-base font-bold text-slate-900">
                              {reminder.medicineName}
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                              {reminder.dosage}
                            </p>

                            <div className="mt-2 flex flex-wrap items-center gap-2">

                              <div className="flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">

                                <Clock size={13} />

                                {formatTime(
                                  reminder.time
                                )}

                              </div>

                              <span className="text-xs text-slate-400">
                                Scheduled daily
                              </span>

                            </div>

                          </div>

                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            deleteReminder(
                              reminder.id
                            )
                          }
                          title="Delete reminder"
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                        >
                          <Trash2 size={18} />
                        </button>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </section>

        </div>

        {/* =================================================
            BOTTOM INFO
        ================================================= */}

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-start gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                <CheckCircle2
                  size={19}
                  className="text-emerald-600"
                />
              </div>

              <div>

                <h3 className="text-sm font-semibold text-slate-800">
                  Keep your medication schedule organized
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Your reminders are saved on this device and remain scheduled
                  until you delete them.
                </p>

              </div>

            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <Volume2 size={14} />
              MediAI Health Tools
            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default MedicineReminder;