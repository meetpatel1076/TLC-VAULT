import React, { useEffect, useState } from "react";
import {
  X,
  MessageSquare,
  Bug,
  ArrowLeft,
  CheckCircle2,
  Send,
} from "lucide-react";

import api from "../services/api";

const initialForm = {
  category: "",
  message: "",
  steps: "",
};

const feedbackOptions = [
  {
    id: "feedback",
    title: "Share Feedback",
    description: "Suggest an idea or tell us what you think.",
    icon: MessageSquare,
  },
  {
    id: "issue",
    title: "Report an Issue",
    description: "Something isn't working as expected.",
    icon: Bug,
  },
];

const categories = {
  feedback: [
    "Feature Request",
    "User Experience",
    "General Feedback",
    "Other",
  ],
  issue: [
    "Bug",
    "Performance",
    "UI / Design",
    "Other",
  ],
};

const FeedbackModal = ({ isOpen, onClose, user }) => {
  const [type, setType] = useState("");
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setType("");
      setForm(initialForm);
      setSubmitted(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const updateField = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !type ||
      !form.category ||
      form.message.trim().length < 10 ||
      submitting
    ) {
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError("");

      await api.post("/feedback", {
        type,
        category: form.category,
        message: form.message.trim(),
        steps: type === "issue" ? form.steps.trim() : "",
      });

      setSubmitted(true);
    } catch (error) {
      console.error("Feedback submission error:", error);

      setSubmitError(
        error.response?.data?.message ||
        "We couldn't submit your message. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    setType("");
    setForm(initialForm);
  };

  const handleClose = () => {
    onClose();
  };

  const isIssue = type === "issue";

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center
        overflow-y-auto bg-black/65 px-4 py-6 backdrop-blur-[3px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) handleClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-title"
        className="relative my-auto w-full max-w-[520px]
          overflow-hidden rounded-2xl border border-[#30343d]
          bg-[#111318] shadow-2xl shadow-black/30"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#252830] px-5 py-5 sm:px-6">
          <div className="min-w-0">
            <h2
              id="feedback-title"
              className="text-lg font-semibold tracking-tight text-[#f6f1e8]"
            >
              {submitted
                ? "Submission received"
                : type
                  ? isIssue
                    ? "Report an issue"
                    : "Share your feedback"
                  : "Send feedback"}
            </h2>

            <p className="mt-1 text-sm leading-relaxed text-[#858b98]">
              {submitted
                ? "Thank you for helping us improve TLC Vault."
                : type
                  ? isIssue
                    ? "Tell us what went wrong so we can investigate."
                    : "Your suggestions help us make TLC Vault better."
                  : "We value your input. Tell us what's on your mind."}
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close feedback dialog"
            className="shrink-0 rounded-lg p-2 text-[#858b98]
              transition hover:bg-[#20232b] hover:text-white
              focus-visible:outline-none focus-visible:ring-1
              focus-visible:ring-[#666b75]"
          >
            <X size={19} />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          {/* Confirmation */}
          {submitted ? (
            <div className="py-5 text-center">
              <div
                className="mx-auto flex h-12 w-12 items-center justify-center
                  rounded-full border border-emerald-500/20 bg-emerald-500/10"
              >
                <CheckCircle2
                  size={25}
                  className="text-emerald-400"
                  strokeWidth={1.7}
                />
              </div>

              <h3 className="mt-4 text-base font-medium text-[#f6f1e8]">
                Thank you for your {isIssue ? "report" : "feedback"}.
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#9ca3af]">
                {isIssue
                  ? "We've received your report. We'll review the details as we work to improve TLC Vault."
                  : "Your input helps us improve TLC Vault. We appreciate you taking the time to share it."}
              </p>

              <button
                type="button"
                onClick={handleClose}
                className="mt-6 w-full rounded-lg bg-[#f36631] px-4 py-2.5
                  text-sm font-medium text-white transition
                  hover:bg-[#df5928] focus-visible:outline-none
                  focus-visible:ring-2 focus-visible:ring-[#f36631]
                  focus-visible:ring-offset-2 focus-visible:ring-offset-[#111318]"
              >
                Done
              </button>
            </div>
          ) : !type ? (
            /* Choose submission type */
            <>
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[#717784]">
                What would you like to do?
              </p>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {feedbackOptions.map((option) => {
                  const Icon = option.icon;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setType(option.id)}
                      className="group flex min-h-[135px] flex-col items-start
                        rounded-xl border border-[#30343d] bg-[#17191f]
                        p-4 text-left transition duration-200
                        hover:border-[#454b57] hover:bg-[#1b1e25]
                        focus-visible:outline-none focus-visible:ring-1
                        focus-visible:ring-[#666b75]"
                    >
                      <Icon
                        size={20}
                        strokeWidth={1.7}
                        className="text-[#9ca3af] transition-colors
                          group-hover:text-[#f6f1e8]"
                      />

                      <span className="mt-4 text-sm font-medium text-[#f6f1e8]">
                        {option.title}
                      </span>

                      <span className="mt-1 text-xs leading-5 text-[#858b98]">
                        {option.description}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-lg px-3 py-2 text-sm text-[#858b98]
                    transition hover:bg-[#20232b] hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            /* Feedback / issue form */
            <form onSubmit={handleSubmit} className="space-y-5">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-2 text-xs
                  text-[#858b98] transition hover:text-[#f6f1e8]"
              >
                <ArrowLeft size={14} />
                Change submission type
              </button>

              {/* Category */}
              <div>
                <label
                  htmlFor="feedback-category"
                  className="mb-2 block text-sm font-medium text-[#d1d5db]"
                >
                  {isIssue ? "Issue category" : "Feedback category"}
                  <span className="ml-1 text-[#f36631]">*</span>
                </label>

                <select
                  id="feedback-category"
                  name="category"
                  value={form.category}
                  onChange={updateField}
                  required
                  className="w-full rounded-lg border border-[#30343d]
                    bg-[#17191f] px-3 py-2.5 text-sm text-[#f6f1e8]
                    outline-none transition
                    focus:border-[#666b75] focus:ring-1 focus:ring-[#454b57]
                    [&>option]:bg-[#17191f]"
                >
                  <option value="" disabled>
                    Select a category
                  </option>

                  {categories[type].map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="feedback-message"
                  className="mb-2 block text-sm font-medium text-[#d1d5db]"
                >
                  {isIssue ? "Describe the issue" : "Your feedback"}
                  <span className="ml-1 text-[#f36631]">*</span>
                </label>

                <textarea
                  id="feedback-message"
                  name="message"
                  value={form.message}
                  onChange={updateField}
                  required
                  minLength={10}
                  maxLength={3000}
                  rows={4}
                  placeholder={
                    isIssue
                      ? "What happened? What did you expect to happen?"
                      : "Share your suggestion, experience, or idea..."
                  }
                  className="w-full resize-y rounded-lg border border-[#30343d]
                    bg-[#17191f] px-3 py-3 text-sm leading-6 text-[#f6f1e8]
                    outline-none transition placeholder:text-[#626875]
                    focus:border-[#666b75] focus:ring-1 focus:ring-[#454b57]"
                />

                <div className="mt-1 flex justify-between gap-3 text-xs text-[#626875]">
                  <span>Minimum 10 characters</span>
                  <span>{form.message.length}/3000</span>
                </div>
              </div>

              {/* Reproduction steps — issues only */}
              {isIssue && (
                <div>
                  <label
                    htmlFor="feedback-steps"
                    className="mb-2 block text-sm font-medium text-[#d1d5db]"
                  >
                    Steps to reproduce
                    <span className="ml-2 font-normal text-[#626875]">
                      Optional
                    </span>
                  </label>

                  <textarea
                    id="feedback-steps"
                    name="steps"
                    value={form.steps}
                    onChange={updateField}
                    maxLength={2000}
                    rows={3}
                    placeholder={"1. Open...\n2. Click...\n3. The issue occurs..."}
                    className="w-full resize-y rounded-lg border border-[#30343d]
                      bg-[#17191f] px-3 py-3 text-sm leading-6 text-[#f6f1e8]
                      outline-none transition placeholder:text-[#626875]
                      focus:border-[#666b75] focus:ring-1 focus:ring-[#454b57]"
                  />

                  <p className="mt-1 text-right text-xs text-[#626875]">
                    {form.steps.length}/2000
                  </p>
                </div>
              )}

              {/* Account context */}
              {user?.email && (
                <div className="rounded-lg border border-[#252830] bg-[#17191f]/70 px-3 py-2.5">
                  <p className="text-xs text-[#717784]">
                    Submitting as
                  </p>
                  <p className="mt-1 truncate text-sm text-[#d1d5db]">
                    {user.email}
                  </p>
                </div>
              )}

              {submitError && (
                <p
                  role="alert"
                  className="rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-sm text-red-400"
                >
                  {submitError}
                </p>
              )}

              {/* Actions */}
              <div className="flex flex-col-reverse gap-2 border-t border-[#252830] pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-lg px-4 py-2.5 text-sm text-[#9ca3af]
                    transition hover:bg-[#20232b] hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    !form.category ||
                    form.message.trim().length < 10 ||
                    submitting
                  }
                  className="inline-flex items-center justify-center gap-2
                    rounded-lg bg-[#f36631] px-4 py-2.5
                    text-sm font-medium text-white transition
                    hover:bg-[#df5928] disabled:cursor-not-allowed
                    disabled:opacity-40"
                >
                  <Send size={15} />
                  {submitting
                    ? "Submitting..."
                    : `Submit ${isIssue ? "Report" : "Feedback"}`}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

export default FeedbackModal;