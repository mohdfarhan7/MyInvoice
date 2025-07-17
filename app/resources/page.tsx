"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const resources = [
  {
    title: "Help Center",
    description: "Find answers to common questions, guides, and troubleshooting tips.",
    link: "/help",
    cta: "Visit Help Center",
  },
  {
    title: "Blog",
    description: "Read articles, tips, and updates on business management and GST.",
    link: "/blog",
    cta: "Read Blog",
  },
  {
    title: "Webinars",
    description: "Join live and recorded webinars to learn best practices and new features.",
    link: "/webinars",
    cta: "View Webinars",
  },
  {
    title: "Templates",
    description: "Download invoice, quotation, and business document templates.",
    link: "/templates",
    cta: "Browse Templates",
  },
];

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Resources & Support</h1>
        <p className="text-lg text-gray-600">Everything you need to get the most out of your business software.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {resources.map((res) => (
          <div key={res.title} className="rounded-2xl shadow-lg bg-white p-8 flex flex-col items-start border border-gray-100">
            <h2 className="text-2xl font-bold mb-2 text-gray-900">{res.title}</h2>
            <p className="text-gray-600 mb-4">{res.description}</p>
            <Link href={res.link} className="mt-auto">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">{res.cta}</Button>
            </Link>
          </div>
        ))}
      </div>
      <div className="max-w-2xl mx-auto mt-16 text-center text-gray-500 text-sm">
        <p>Need more help? <Link href="/contact" className="text-blue-600 hover:underline">Contact our support team</Link> or explore our <Link href="/templates" className="text-blue-600 hover:underline">template library</Link>.</p>
      </div>
    </div>
  );
} 