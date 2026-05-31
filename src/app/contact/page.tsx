"use client";

import { PageTransition } from "@/components/animation/page-transition";
import { Toast } from "@/components/ui/toast";
import { useState } from "react";


export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    isVisible: boolean;
    message: string;
    type: "success" | "error";
  }>({
    isVisible: false,
    message: "",
    type: "success",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("https://formspree.io/f/mwpqeaqw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setToast({
          isVisible: true,
          message: "Message sent successfully! I'll get back to you soon.",
          type: "success",
        });
        setFormData({ name: "", email: "", message: "" });
      } else {
        setToast({
          isVisible: true,
          message: "Something went wrong. Please try again or email me directly.",
          type: "error",
        });
      }
    } catch (error) {
      setToast({
        isVisible: true,
        message: "Something went wrong. Please try again or email me directly.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <PageTransition>
      {/* Header */}
      <section className="w-full flex flex-col justify-start p-[0.4rem] mb-4">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-xl sm:text-2xl font-medium">Contact ~</h2>
          <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 px-2 py-1 rounded-full">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce"></div>
            <span className="text-xs text-green-400 font-medium ml-auto">let's collaborate</span>
          </div>
        </div>
        <p className="text-sm sm:text-base text-zinc-300">
          Got a project, a question, or just wanna vibe? I'm always down to chat.
          Hit me up through the form or connect on any platform below.
        </p>
      </section>

      {/* Form */}
      <section className="w-full flex flex-col justify-start p-[0.4rem] mb-12">
        <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-6">
          <div className="flex flex-col">
            <label htmlFor="name" className="text-sm text-zinc-400 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Jane Doe"
              className="bg-stone-900/40 border border-stone-800 rounded-lg px-4 py-2 text-white placeholder-zinc-500 outline-none focus:ring-2 focus:ring-stone-700"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="email" className="text-sm text-zinc-400 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="you@example.com"
              className="bg-stone-900/40 border border-stone-800 rounded-lg px-4 py-2 text-white placeholder-zinc-500 outline-none focus:ring-2 focus:ring-stone-700"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="message" className="text-sm text-zinc-400 mb-1">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={5}
              required
              placeholder="What's on your mind?"
              className="bg-stone-900/40 border border-stone-800 rounded-lg px-4 py-2 text-white placeholder-zinc-500 outline-none focus:ring-2 focus:ring-stone-700 resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-stone-800 hover:bg-stone-700 disabled:bg-stone-900 disabled:cursor-not-allowed transition-colors rounded-lg px-4 py-2 text-white font-medium"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </section>

      {/* Toast */}
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />

      {/* Socials */}
      <section className="w-full flex flex-col justify-start p-[0.4rem]">
        <h3 className="text-lg sm:text-xl font-medium mb-6">Find me here ~</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full gap-y-6 gap-x-12">
          <div>
            <p className="mb-2 text-zinc-400 font-medium text-sm">Email</p>
            <a
              href="mailto:bedanta.074@gmail.com"
              className="text-white hover:opacity-80 transition-opacity underline"
              target="_blank"
            >
              bedanta.074@gmail.com
            </a>
          </div>
          <div>
            <p className="mb-2 text-zinc-400 font-medium text-sm">GitHub</p>
            <a
              href="https://github.com/r4inr3aper"
              className="text-white hover:opacity-80 transition-opacity underline"
              target="_blank"
            >
              @r4inr3aper
            </a>
          </div>
          <div>
            <p className="mb-2 text-zinc-400 font-medium text-sm">Leetcode</p>
            <a
              href="https://leetcode.com/u/xbedanta/"
              className="text-white hover:opacity-80 transition-opacity underline"
              target="_blank"
            >
              @xbedanta
            </a>
          </div>
          <div>
            <p className="mb-2 text-zinc-400 font-medium text-sm">LinkedIn</p>
            <a
              href="https://www.linkedin.com/in/bedanta-kataki-0b5205257/"
              className="text-white hover:opacity-80 transition-opacity underline"
              target="_blank"
            >
              @bedanta
            </a>
          </div>
          <div>
            <p className="mb-2 text-zinc-400 font-medium text-sm">X (formerly Twitter)</p>
            <a
              href="https://x.com/bedantaxdev"
              className="text-white hover:opacity-80 transition-opacity underline"
              target="_blank"
            >
              @bedantaxdev
            </a>
          </div>
          {/* <div>
            <p className="mb-2 text-zinc-400 font-medium text-sm">CV</p>
            <a
              href="https://read.cv/bedanta"
              className="text-white hover:opacity-80 transition-opacity underline"
              target="_blank"
            >
              read.cv/bedanta
            </a>
          </div> */}
        </div>
      </section>
    </PageTransition>
  );
}