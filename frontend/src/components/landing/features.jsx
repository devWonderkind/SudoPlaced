"use client"
import {
  IconChartBar,
  IconLayoutColumns,
  IconNotes,
  IconBellRinging,
  IconBrandX,
} from '@tabler/icons-react';



export default function Features() {
  const features = [
    {
      title: "Analytics Dashboard",
      desc: "Get a bird's-eye view of your entire job search. Track response rates, interview conversions, and weekly application velocity with clean, actionable charts.",
      icon: IconChartBar,
    },
    {
      title: "Scrum Pipeline",
      desc: "Visualize your hunt like a pro. Drag and drop applications from 'Applied' to 'Offer' using a Kanban-style board built for job seekers.",
      icon: IconLayoutColumns,
    },
    {
      title: "Interview KeyNotes",
      desc: "Capture technical questions, behavioral prompts, and post-interview reflections in a rich editor. Never walk into a round unprepared again.",
      icon: IconNotes,
    },
    {
      title: "Follow-up Reminders",
      desc: "Set smart reminders that ping you when it's time to follow up. Stay top-of-mind with recruiters without the mental overhead.",
      icon: IconBellRinging,
    },
    {
      title: "Share to X",
      desc: "One-click aesthetic journey sharing. Celebrate milestones, build your personal brand, and inspire others on their search.",
      icon: IconBrandX,
    },
  ];

  return (
    <section id='features' className="bg-gray-50 dark:bg-neutral-950 py-4 sm:py-8 px-6 sm:px-12 lg:px-24">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-16 sm:mb-20">
          <span className="text-blue-500 text-sm font-light uppercase" style={{ letterSpacing: '0.15em' }}>
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-neutral-900 dark:text-white font-light" style={{ letterSpacing: '-0.03em', lineHeight: '1.2' }}>
            Everything you{' '}
            <span className="text-neutral-400 dark:text-neutral-500">
              need to win the job search
            </span>
          </h2>
          <p className="mt-5 text-base sm:text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl  font-light" style={{ lineHeight: '1.75', letterSpacing: '0.01em' }}>
            Built for modern job seekers who want to replace spreadsheets with a system that actually works.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-neutral-200/70 dark:bg-neutral-800/50 border border-neutral-200/70 dark:border-neutral-800/50 rounded-2xl overflow-hidden">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className={`bg-gray-50 dark:bg-neutral-950 p-8 sm:p-10 flex flex-col gap-4 ${i === features.length - 1 && features.length % 3 === 2
                  ? 'lg:col-span-1'
                  : ''
                  }`}
              >
                <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800/60 flex items-center justify-center">
                  <Icon size={20} className="text-neutral-500 dark:text-neutral-400" stroke={1.5} />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2" style={{ letterSpacing: '-0.02em', lineHeight: '1.3' }}>
                    {f.title}
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 font-light" style={{ lineHeight: '1.7', letterSpacing: '0.01em' }}>
                    {f.desc}
                  </p>
                </div>
              </div>
            );
          })}
          {/* Fill empty cell in 3-col grid for 5 items */}
          <div className="hidden lg:block bg-gray-50 dark:bg-neutral-950 p-8 sm:p-10" />
        </div>
      </div>
    </section>
  );
}