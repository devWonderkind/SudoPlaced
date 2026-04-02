"use client";

import React, { useState } from 'react';
import { IconPlus, IconMinus } from '@tabler/icons-react';

const faqData = [
  {
    question: "What is SudoPlaced?",
    answer: "SudoPlaced is an all-in-one job search management platform that helps you track applications, prepare for interviews, set follow-up reminders, and share your journey — replacing messy spreadsheets with a system that actually works.",
  },
  {
    question: "Is SudoPlaced free to use?",
    answer: "Yes! SudoPlaced offers a generous free tier that includes core features like the Scrum Pipeline, Interview KeyNotes, and analytics. Premium features like advanced reminders and sharing are available on the Pro plan.",
  },
  {
    question: "How is this different from a spreadsheet?",
    answer: "Spreadsheets are static and require manual maintenance. SudoPlaced gives you a visual Kanban board, automated reminders, structured interview notes, and real-time analytics — all designed specifically for job seekers.",
  },
  {
    question: "Can I import my existing job applications?",
    answer: "Absolutely. You can manually add applications or quickly import from platforms like LinkedIn, Indeed, and other job boards. We're constantly adding more import integrations.",
  },
  {
    question: "What are Interview KeyNotes?",
    answer: "KeyNotes is a built-in rich text editor tailored for interview prep. Capture technical questions, behavioral prompts, and post-interview reflections — all linked to the specific application in your pipeline.",
  },
  {
    question: "How do Follow-up Reminders work?",
    answer: "Set custom reminders for any application in your pipeline. SudoPlaced will notify you when it's time to send a follow-up email, keeping you top-of-mind with recruiters without the mental overhead.",
  },
];

const FAQItem = ({ question, answer, isOpen, onToggle }) => {
  return (
    <div className="border-b border-neutral-200/70 dark:border-neutral-800/50">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-6 text-left cursor-pointer group"
      >
        <span className="text-base sm:text-lg text-neutral-900 dark:text-white font-light pr-8" style={{ letterSpacing: '-0.01em', lineHeight: '1.5' }}>
          {question}
        </span>
        <span className="flex-shrink-0 w-8 h-8 rounded-full border border-neutral-200 dark:border-neutral-800 flex items-center justify-center transition-colors group-hover:border-neutral-400 dark:group-hover:border-neutral-600">
          {isOpen ? (
            <IconMinus size={16} className="text-neutral-500 dark:text-neutral-400" stroke={1.5} />
          ) : (
            <IconPlus size={16} className="text-neutral-500 dark:text-neutral-400" stroke={1.5} />
          )}
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-out ${
          isOpen ? 'max-h-[300px] opacity-100 pb-6' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 font-light max-w-2xl" style={{ lineHeight: '1.75', letterSpacing: '0.01em' }}>
          {answer}
        </p>
      </div>
    </div>
  );
};

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="bg-gray-50 dark:bg-neutral-950 py-20 sm:py-28 px-6 sm:px-12 lg:px-24">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-12 sm:mb-16 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-neutral-900 dark:text-white font-light" style={{ letterSpacing: '-0.03em', lineHeight: '1.2' }}>
            Frequently asked questions
          </h2>
          <p className="mt-5 text-base sm:text-lg text-neutral-500 dark:text-neutral-400 font-light" style={{ lineHeight: '1.75', letterSpacing: '0.01em' }}>
            Get answers to the most common questions about SudoPlaced.
          </p>
        </div>

        {/* FAQ List */}
        <div className="border-t border-neutral-200/70 dark:border-neutral-800/50">
          {faqData.map((item, i) => (
            <FAQItem
              key={i}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
