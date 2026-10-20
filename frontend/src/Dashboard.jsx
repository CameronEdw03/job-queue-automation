
import { useState } from "react";

function Dashboard() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [tasks, setTasks] = useState([]);
  const [goals, setGoals] = useState([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

  const [taskForm, setTaskForm] = useState({
    title: "",
    dueDate: "",
    reminderTime: "09:00",
  });

  const [goalForm, setGoalForm] = useState({
    title: "",
    weeklyHours: "5",
    reminderTime: "19:00",
    startDate: new Date().toLocaleDateString("en-CA"),
  });

  const today = new Date();

  const formatDate = (date) => {
    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");
  };

  const todayString = formatDate(today);

  const openTaskModal = () => {
    setTaskForm({
      title: "",
      dueDate: "",
      reminderTime: "09:00",
    });
    setIsTaskModalOpen(true);
  };

  const openGoalModal = () => {
    setGoalForm({
      title: "",
      weeklyHours: "5",
      reminderTime: "19:00",
      startDate: todayString,
    });
    setIsGoalModalOpen(true);
  };

  const createTask = (e) => {
    e.preventDefault();

    if (!taskForm.title.trim() || !taskForm.dueDate) return;

    setTasks((current) => [
      ...current,
      {
        id: Date.now(),
        title: taskForm.title.trim(),
        dueDate: taskForm.dueDate,
        reminderTime: taskForm.reminderTime,
        completed: false,
      },
    ]);

    setIsTaskModalOpen(false);
  };

  const createGoal = (e) => {
    e.preventDefault();

    if (
      !goalForm.title.trim() ||
      !goalForm.weeklyHours ||
      Number(goalForm.weeklyHours) <= 0 ||
      !goalForm.startDate
    ) {
      return;
    }

    setGoals((current) => [
      ...current,
      {
        id: Date.now(),
        title: goalForm.title.trim(),
        weeklyHours: Number(goalForm.weeklyHours),
        reminderTime: goalForm.reminderTime,
        startDate: goalForm.startDate,
        sessions: [],
        completed: false,
      },
    ]);

    setIsGoalModalOpen(false);
    setActivePage("Goals");
  };

  const toggleTask = (id) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const logStudySession = (goalId) => {
    const input = window.prompt(
      "How many minutes did you spend on this goal?"
    );

    if (input === null || input.trim() === "") return;

    const minutes = Number(input);

    if (!Number.isFinite(minutes) || minutes <= 0) {
      window.alert("Please enter a valid number of minutes.");
      return;
    }

    setGoals((current) =>
      current.map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              sessions: [
                ...goal.sessions,
                { id: Date.now(), date: todayString, minutes },
              ],
            }
          : goal
      )
    );
  };

  const getWeeklyMinutes = (goal) => {
    const now = new Date();
    const startOfWeek = new Date(now);
    const dayOffset = (now.getDay() + 6) % 7;

    startOfWeek.setDate(now.getDate() - dayOffset);
    startOfWeek.setHours(0, 0, 0, 0);

    const nextWeek = new Date(startOfWeek);
    nextWeek.setDate(startOfWeek.getDate() + 7);

    return goal.sessions.reduce((total, session) => {
      const date = new Date(`${session.date}T00:00:00`);
      return date >= startOfWeek && date < nextWeek
        ? total + session.minutes
        : total;
    }, 0);
  };

  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(Number(hours), Number(minutes));
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const stats = [
    {
      title: "Open Tasks",
      value: tasks.filter((task) => !task.completed).length,
      icon: "☷",
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      title: "Active Goals",
      value: goals.filter((goal) => !goal.completed).length,
      icon: "◎",
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
    },
    {
      title: "Completed Tasks",
      value: tasks.filter((task) => task.completed).length,
      icon: "✓",
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
    },
    {
      title: "Daily Reminders",
      value: goals.filter((goal) => !goal.completed).length,
      icon: "♧",
      color: "text-purple-400",
      bg: "bg-purple-400/10",
    },
  ];

  const navigation = [
    { name: "Dashboard", icon: "⌂" },
    { name: "Tasks", icon: "☷" },
    { name: "Goals", icon: "◎" },
    { name: "Calendar", icon: "▦" },
    { name: "Settings", icon: "⚙" },
  ];

  const weekDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);

    const dateString = formatDate(date);

    return {
      name: date.toLocaleDateString("en-US", { weekday: "short" }),
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      count: tasks.filter(
        (task) => task.dueDate === dateString && !task.completed
      ).length,
    };
  });

  const closeModals = () => {
    setIsTaskModalOpen(false);
    setIsGoalModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#090b10] text-gray-100 md:flex">
      {/* Sidebar */}
      <aside className="w-full border-b border-white/10 bg-[#0b0d12] p-5 md:min-h-screen md:w-64 md:shrink-0 md:border-b-0 md:border-r">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400 text-xl font-bold text-black">
            N
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Nudge</h1>
        </div>

        <p className="mb-3 px-4 text-xs font-semibold uppercase tracking-widest text-gray-600">
          Workspace
        </p>

        <nav className="flex gap-2 overflow-x-auto md:flex-col">
          {navigation.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => setActivePage(item.name)}
              className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left transition ${
                activePage === item.name
                  ? "bg-yellow-400/10 text-yellow-400"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm font-medium">{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="mt-10 hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:block">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-400/10 text-yellow-400">
            ✦
          </div>
          <p className="text-sm font-semibold">Make progress daily.</p>
          <p className="mt-2 text-xs leading-5 text-gray-500">
            Small steps today lead to big results tomorrow.
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1 p-5 md:p-8 lg:p-10">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-medium tracking-widest text-gray-500">
              YOUR PERSONAL WORKSPACE
            </p>

            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              {activePage === "Dashboard"
                ? "Hi, Cam"
                : activePage}
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              {activePage === "Goals"
                ? "Build habits and stay consistent with your weekly goals."
                : activePage === "Tasks"
                  ? "Keep track of your deadlines and to-dos."
                  : activePage === "Calendar"
                    ? "See what's coming up this week."
                    : activePage === "Settings"
                      ? "Manage your Nudge preferences."
                      : "Welcome to Nudge. Your tasks, goals, and reminders in one place."}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {(activePage === "Dashboard" || activePage === "Tasks") && (
              <button
                type="button"
                onClick={openTaskModal}
                className="rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-gray-200 transition hover:bg-white/5"
              >
                + Add Task
              </button>
            )}

            {(activePage === "Dashboard" || activePage === "Goals") && (
              <button
                type="button"
                onClick={openGoalModal}
                className="rounded-xl bg-yellow-400 px-5 py-3 text-sm font-bold text-black transition hover:bg-yellow-300"
              >
                + Create Goal
              </button>
            )}
          </div>
        </header>

        {/* Dashboard Statistics */}
        {activePage === "Dashboard" && (
          <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.title}
                className="rounded-2xl border border-white/[0.08] bg-[#10131a] p-5 transition hover:border-white/20"
              >
                <div
                  className={`mb-5 flex h-10 w-10 items-center justify-center rounded-xl text-xl font-bold ${stat.color} ${stat.bg}`}
                >
                  {stat.icon}
                </div>
                <p className="text-sm text-gray-400">{stat.title}</p>
                <p className="mt-2 text-3xl font-bold">{stat.value}</p>
              </div>
            ))}
          </section>
        )}

        {/* Dashboard */}
        {activePage === "Dashboard" && (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <section className="min-w-0 rounded-2xl border border-white/[0.08] bg-[#10131a] p-5 md:p-6">
              <div className="mb-5 flex items-center justify-between border-b border-white/[0.08] pb-5">
                <div>
                  <h3 className="font-semibold">Upcoming Tasks</h3>
                  <p className="mt-1 text-xs text-gray-500">
                    Your next things to get done.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActivePage("Tasks")}
                  className="text-sm text-yellow-400 hover:text-yellow-300"
                >
                  View all
                </button>
              </div>

              {tasks.filter((task) => !task.completed).length === 0 ? (
                <EmptyState
                  title="No upcoming tasks"
                  description="Add a task when you have something you need to finish."
                  buttonText="Create Task"
                  onClick={openTaskModal}
                />
              ) : (
                <div className="space-y-3">
                  {tasks
                    .filter((task) => !task.completed)
                    .slice()
                    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
                    .slice(0, 5)
                    .map((task) => (
                      <TaskRow
                        key={task.id}
                        task={task}
                        onToggle={toggleTask}
                      />
                    ))}
                </div>
              )}
            </section>

            <div className="space-y-6">
              <section className="rounded-2xl border border-yellow-400/10 bg-gradient-to-br from-yellow-400/[0.08] to-[#10131a] p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400/10 text-2xl text-yellow-400">
                  ◎
                </div>
                <h3 className="text-lg font-semibold">Your Goals</h3>
                <p className="mt-2 text-sm leading-6 text-gray-400">
                  Build consistency with daily reminders and weekly targets.
                </p>
                <p className="mt-4 text-2xl font-bold">
                  {goals.filter((goal) => !goal.completed).length}
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    active goals
                  </span>
                </p>
                <button
                  type="button"
                  onClick={() => setActivePage("Goals")}
                  className="mt-5 text-sm font-semibold text-yellow-400 hover:text-yellow-300"
                >
                  View your goals →
                </button>
              </section>

              <WeekOverview weekDays={weekDays} />
            </div>
          </div>
        )}

        {/* Tasks Page */}
        {activePage === "Tasks" && (
          <section className="rounded-2xl border border-white/[0.08] bg-[#10131a] p-5 md:p-6">
            <h3 className="mb-5 font-semibold">All Tasks</h3>
            {tasks.length === 0 ? (
              <EmptyState
                title="No tasks yet"
                description="Create a task with a due date and reminder time."
                buttonText="Add Task"
                onClick={openTaskModal}
              />
            ) : (
              <div className="space-y-3">
                {tasks
                  .slice()
                  .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
                  .map((task) => (
                    <TaskRow
                      key={task.id}
                      task={task}
                      onToggle={toggleTask}
                    />
                  ))}
              </div>
            )}
          </section>
        )}

        {/* Goals Page */}
        {activePage === "Goals" && (
          <section className="rounded-2xl border border-white/[0.08] bg-[#10131a] p-5 md:p-6">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-5">
              <div>
                <h3 className="font-semibold">Recurring Goals</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Track weekly targets and set a daily SMS reminder time.
                </p>
              </div>
              <span className="rounded-lg bg-yellow-400/10 px-3 py-2 text-xs font-medium text-yellow-400">
                Weekly progress
              </span>
            </div>

            {goals.length === 0 ? (
              <EmptyState
                title="Start building a habit"
                description="Create a goal like studying LeetCode for five hours a week and choose when Nudge should remind you."
                buttonText="Create Your First Goal"
                onClick={openGoalModal}
              />
            ) : (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {goals.map((goal) => {
                  const minutes = getWeeklyMinutes(goal);
                  const targetMinutes = goal.weeklyHours * 60;
                  const progress = Math.min(
                    (minutes / targetMinutes) * 100,
                    100
                  );

                  return (
                    <article
                      key={goal.id}
                      className="rounded-2xl border border-white/[0.08] bg-[#0b0d12] p-5"
                    >
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-yellow-400/10 text-xl text-yellow-400">
                            ◎
                          </div>
                          <div className="min-w-0">
                            <h4 className="truncate font-semibold">
                              {goal.title}
                            </h4>
                            <p className="mt-1 text-xs text-gray-500">
                              {goal.weeklyHours} hours per week
                            </p>
                          </div>
                        </div>
                        <span className="rounded-lg bg-emerald-400/10 px-2 py-1 text-xs text-emerald-400">
                          Active
                        </span>
                      </div>

                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="text-gray-400">Weekly progress</span>
                        <span className="font-medium">
                          {(minutes / 60).toFixed(1)} / {goal.weeklyHours} hrs
                        </span>
                      </div>

                      <div
                        className="h-2 overflow-hidden rounded-full bg-white/10"
                        role="progressbar"
                        aria-valuenow={Math.round(progress)}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${goal.title} weekly progress`}
                      >
                        <div
                          className="h-full rounded-full bg-yellow-400 transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>

                      <div className="mt-4 space-y-2 border-t border-white/[0.08] pt-4">
                        <div className="flex items-center justify-between gap-3 text-sm">
                          <span className="text-gray-500">Daily reminder</span>
                          <span className="text-gray-300">
                            {formatTime(goal.reminderTime)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-3 text-sm">
                          <span className="text-gray-500">Repeat</span>
                          <span className="text-gray-300">Every day</span>
                        </div>
                        <div className="flex items-center justify-between gap-3 text-sm">
                          <span className="text-gray-500">SMS reminders</span>
                          <span className="text-yellow-400">Planned</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => logStudySession(goal.id)}
                        className="mt-5 w-full rounded-xl bg-yellow-400 px-4 py-3 text-sm font-bold text-black transition hover:bg-yellow-300"
                      >
                        + Log Progress
                      </button>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* Calendar Page */}
        {activePage === "Calendar" && (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <WeekOverview weekDays={weekDays} />
            <section className="rounded-2xl border border-white/[0.08] bg-[#10131a] p-5">
              <h3 className="mb-4 font-semibold">Tasks due this week</h3>
              {tasks.filter(
                (task) =>
                  !task.completed &&
                  weekDays.some(
                    (day) => day.date === new Date(`${task.dueDate}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  )
              ).length === 0 ? (
                <p className="py-8 text-center text-sm text-gray-500">
                  No tasks due in the next seven days.
                </p>
              ) : (
                <div className="space-y-3">
                  {tasks
                    .filter(
                      (task) =>
                        !task.completed &&
                        weekDays.some(
                          (day) =>
                            day.date ===
                            new Date(`${task.dueDate}T00:00:00`).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric" }
                            )
                        )
                    )
                    .map((task) => (
                      <TaskRow
                        key={task.id}
                        task={task}
                        onToggle={toggleTask}
                      />
                    ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* Settings Page */}
        {activePage === "Settings" && (
          <section className="max-w-2xl rounded-2xl border border-white/[0.08] bg-[#10131a] p-6">
            <h3 className="font-semibold">Reminder Settings</h3>
            <p className="mt-2 text-sm leading-6 text-gray-400">
              Your recurring goals are configured for daily reminders at the
              time you select. SMS delivery will be enabled after we connect
              Nudge to the backend and an SMS provider.
            </p>
            <div className="mt-5 rounded-xl border border-yellow-400/10 bg-yellow-400/[0.04] p-4">
              <p className="text-sm font-medium text-yellow-400">
                SMS integration not connected
              </p>
              <p className="mt-2 text-xs leading-5 text-gray-500">
                No text messages are sent by this frontend prototype yet.
              </p>
            </div>
          </section>
        )}

        <footer className="mt-8 border-t border-white/[0.06] pt-5 text-center text-xs text-gray-600">
          Nudge · One step at a time.
        </footer>
      </main>

      {/* Create Task Modal */}
      {isTaskModalOpen && (
        <Modal
          title="Create a Task"
          description="Add something you need to finish."
          onClose={closeModals}
        >
          <form onSubmit={createTask} className="space-y-5">
            <FormField label="Task Title" htmlFor="task-title">
              <input
                id="task-title"
                type="text"
                placeholder="e.g. Finish Python project"
                value={taskForm.title}
                onChange={(e) =>
                  setTaskForm({ ...taskForm, title: e.target.value })
                }
                required
                autoFocus
                className={inputClass}
              />
            </FormField>

            <FormField label="Due Date" htmlFor="task-due-date">
              <input
                id="task-due-date"
                type="date"
                min={todayString}
                value={taskForm.dueDate}
                onChange={(e) =>
                  setTaskForm({ ...taskForm, dueDate: e.target.value })
                }
                required
                className={inputClass}
              />
            </FormField>

            <FormField label="Reminder Time" htmlFor="task-reminder-time">
              <input
                id="task-reminder-time"
                type="time"
                value={taskForm.reminderTime}
                onChange={(e) =>
                  setTaskForm({
                    ...taskForm,
                    reminderTime: e.target.value,
                  })
                }
                required
                className={inputClass}
              />
            </FormField>

            <ModalActions onClose={closeModals} submitLabel="Create Task" />
          </form>
        </Modal>
      )}

      {/* Create Recurring Goal Modal */}
      {isGoalModalOpen && (
        <Modal
          title="Create a Goal"
          description="Build a routine and let Nudge help you stay consistent."
          onClose={closeModals}
        >
          <form onSubmit={createGoal} className="space-y-5">
            <FormField label="Goal Name" htmlFor="goal-title">
              <input
                id="goal-title"
                type="text"
                placeholder="e.g. Study LeetCode"
                value={goalForm.title}
                onChange={(e) =>
                  setGoalForm({ ...goalForm, title: e.target.value })
                }
                required
                autoFocus
                className={inputClass}
              />
            </FormField>

            <FormField
              label="Weekly Target (Hours)"
              htmlFor="goal-hours"
            >
              <input
                id="goal-hours"
                type="number"
                min="0.25"
                max="168"
                step="0.25"
                placeholder="5"
                value={goalForm.weeklyHours}
                onChange={(e) =>
                  setGoalForm({
                    ...goalForm,
                    weeklyHours: e.target.value,
                  })
                }
                required
                className={inputClass}
              />
              <p className="mt-2 text-xs text-gray-500">
                How much time do you want to spend on this goal each week?
              </p>
            </FormField>

            <FormField
              label="Daily Reminder Time"
              htmlFor="goal-reminder-time"
            >
              <input
                id="goal-reminder-time"
                type="time"
                value={goalForm.reminderTime}
                onChange={(e) =>
                  setGoalForm({
                    ...goalForm,
                    reminderTime: e.target.value,
                  })
                }
                required
                className={inputClass}
              />
              <p className="mt-2 text-xs text-gray-500">
                Nudge will be configured to text you every day at this time.
              </p>
            </FormField>

            <FormField label="Start Date" htmlFor="goal-start-date">
              <input
                id="goal-start-date"
                type="date"
                min={todayString}
                value={goalForm.startDate}
                onChange={(e) =>
                  setGoalForm({ ...goalForm, startDate: e.target.value })
                }
                required
                className={inputClass}
              />
            </FormField>

            <div className="rounded-xl border border-yellow-400/10 bg-yellow-400/[0.04] p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-yellow-400">
                <span>♧</span>
                Daily SMS reminders
              </div>
              <p className="mt-2 text-xs leading-5 text-gray-400">
                You'll choose a daily reminder time here. Actual text messages
                will work once SMS delivery is connected to the backend.
              </p>
            </div>

            <ModalActions onClose={closeModals} submitLabel="Create Goal" />
          </form>
        </Modal>
      )}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-white/10 bg-[#090b10] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/10";

function Modal({ title, description, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="my-auto w-full max-w-lg rounded-2xl border border-white/10 bg-[#10131a] p-6 shadow-2xl shadow-black/50 sm:p-8"
      >
        <div className="mb-7 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-gray-400">
              {description}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-white"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function FormField({ label, htmlFor, children }) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 block text-sm font-medium text-gray-300"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function ModalActions({ onClose, submitLabel }) {
  return (
    <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
      <button
        type="button"
        onClick={onClose}
        className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-gray-300 transition hover:bg-white/5 hover:text-white"
      >
        Cancel
      </button>
      <button
        type="submit"
        className="rounded-xl bg-yellow-400 px-5 py-3 text-sm font-bold text-black transition hover:bg-yellow-300"
      >
        {submitLabel}
      </button>
    </div>
  );
}

function EmptyState({ title, description, buttonText, onClick }) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center py-10 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-3xl text-gray-500">
        ◎
      </div>
      <h4 className="font-semibold">{title}</h4>
      <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
        {description}
      </p>
      <button
        type="button"
        onClick={onClick}
        className="mt-5 rounded-xl bg-yellow-400 px-5 py-3 text-sm font-bold text-black transition hover:bg-yellow-300"
      >
        + {buttonText}
      </button>
    </div>
  );
}

function TaskRow({ task, onToggle }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        aria-label={`Mark ${task.title} completed`}
        className="h-4 w-4 accent-yellow-400"
      />
      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-sm font-medium ${
            task.completed ? "text-gray-500 line-through" : "text-gray-100"
          }`}
        >
          {task.title}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Due {task.dueDate} · Reminder {task.reminderTime}
        </p>
      </div>
      <span
        className={`shrink-0 rounded-lg px-2 py-1 text-xs ${
          task.completed
            ? "bg-emerald-400/10 text-emerald-400"
            : "bg-yellow-400/10 text-yellow-400"
        }`}
      >
        {task.completed ? "Completed" : "Pending"}
      </span>
    </div>
  );
}

function WeekOverview({ weekDays }) {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#10131a] p-5">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-semibold">This Week</h3>
        <span className="text-xs text-gray-500">Next 7 days</span>
      </div>
      <div className="divide-y divide-white/[0.06]">
        {weekDays.map((day) => (
          <div
            key={`${day.name}-${day.date}`}
            className="flex items-center justify-between py-3"
          >
            <div>
              <p className="text-sm font-medium">{day.name}</p>
              <p className="mt-1 text-xs text-gray-500">{day.date}</p>
            </div>
            <span className="rounded-lg bg-white/[0.04] px-3 py-1.5 text-sm text-gray-400">
              {day.count}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Dashboard;

