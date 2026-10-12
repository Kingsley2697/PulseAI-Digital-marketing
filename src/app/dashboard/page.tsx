"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  FileText,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Search,
  Filter,
  User,
  Mail,
  Phone,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [briefs, setBriefs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterService, setFilterService] = useState("all");

  const fetchBriefs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/brief");
      const data = await res.json();
      if (data.success && data.data) {
        setBriefs(data.data);
      }
    } catch (err) {
      console.error("Failed to load briefs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBriefs();
  }, []);

  const filteredBriefs = briefs.filter((b) => {
    const matchesSearch =
      (b.businessName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.contactName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.industry || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesService =
      filterService === "all" ||
      (b.services && b.services.some((s: string) => s.toLowerCase().includes(filterService.toLowerCase())));

    return matchesSearch && matchesService;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf8] text-slate-900">
      <Navbar />

      <main className="flex-1 py-12 relative overflow-hidden bg-radial-glow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Top Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fff2ef] border border-[#fed7cc] text-xs font-bold text-[#ff5b37] mb-2">
                <FileText className="w-3.5 h-3.5" />
                <span>Live Client Pipeline</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Brief Submissions & <span className="text-[#ff5b37] italic font-serif">Growth Pipeline</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Monitor incoming marketing briefs, customer goals, and settlement status from one place.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchBriefs}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-2 shadow-sm transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#ff5b37]" : ""}`} />
                <span>Refresh Data</span>
              </button>
              <Link
                href="/get-started"
                className="px-5 py-2.5 rounded-xl bg-[#ff5b37] hover:bg-[#e84a26] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-orange-500/25 flex items-center gap-2 transition-all"
              >
                <span>New Brief Test</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 font-semibold block mb-1">Total Submissions</span>
              <span className="text-2xl font-black text-slate-900 font-mono">{briefs.length}</span>
            </div>
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 font-semibold block mb-1">Avg Budget Velocity</span>
              <span className="text-2xl font-black text-emerald-600 font-mono">$4,850/mo</span>
            </div>
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 font-semibold block mb-1">Alert Dispatch</span>
              <span className="text-2xl font-black text-[#ff5b37] font-mono">100% Active</span>
            </div>
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 font-semibold block mb-1">Payment Matrix</span>
              <span className="text-2xl font-black text-slate-800 font-mono">Flutterwave / Crypto</span>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search business, founder, email..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#ff5b37] text-xs text-slate-900 placeholder-slate-400 outline-none"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-xs text-slate-500 font-bold flex items-center gap-1.5 shrink-0">
                <Filter className="w-3.5 h-3.5" />
                <span>Filter Module:</span>
              </span>
              <select
                value={filterService}
                onChange={(e) => setFilterService(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none cursor-pointer font-medium"
              >
                <option value="all">All Modules</option>
                <option value="Ad Management">Ads Management</option>
                <option value="Content">Content Automation</option>
                <option value="SEO">Local SEO</option>
                <option value="Chatbot">Conversational Bot</option>
              </select>
            </div>
          </div>

          {/* Submissions List */}
          {loading ? (
            <div className="p-16 text-center text-slate-500 bg-white rounded-3xl border border-slate-200 shadow-sm">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#ff5b37] mb-3" />
              <p className="text-xs font-semibold">Fetching Real-time Client Briefs...</p>
            </div>
          ) : filteredBriefs.length === 0 ? (
            <div className="p-16 text-center text-slate-500 bg-white rounded-3xl border border-slate-200 shadow-sm">
              <AlertCircle className="w-8 h-8 mx-auto text-slate-400 mb-3" />
              <p className="text-sm font-bold text-slate-900">No briefs found matching your filter</p>
              <p className="text-xs text-slate-500 mt-1">
                Try submitting a new brief via the{" "}
                <Link href="/get-started" className="text-[#ff5b37] font-bold hover:underline">
                  Onboarding Wizard
                </Link>
                .
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBriefs.map((brief, idx) => (
                <div
                  key={brief._id || idx}
                  className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-orange-300 transition-all shadow-md hover:shadow-lg"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold text-slate-900">{brief.businessName}</h3>
                        <span className="text-[10px] font-mono uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200 font-bold">
                          {brief.industry}
                        </span>
                        <span
                          className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full ${
                            brief.paymentStatus === "paid"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-orange-50 text-[#ff5b37] border border-orange-200"
                          }`}
                        >
                          {brief.paymentStatus === "paid" ? "Retainer Active" : "Reviewing"}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <strong className="text-slate-800">{brief.contactName}</strong>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <a href={`mailto:${brief.email}`} className="text-slate-700 hover:text-[#ff5b37]">
                            {brief.email}
                          </a>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{brief.phone}</span>
                        </span>
                        {brief.websiteUrl && (
                          <span className="flex items-center gap-1.5">
                            <ExternalLink className="w-3.5 h-3.5 text-[#ff5b37]" />
                            <a
                              href={brief.websiteUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#ff5b37] hover:underline font-bold"
                            >
                              {brief.websiteUrl.replace("https://", "")}
                            </a>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right flex lg:flex-col items-center lg:items-end justify-between gap-1">
                      <span className="text-xs text-slate-400 font-medium">Monthly Budget:</span>
                      <span className="text-base font-black text-[#ff5b37] font-mono">
                        {brief.monthlyBudget}
                      </span>
                    </div>
                  </div>

                  {/* Details Body */}
                  <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-slate-500 font-bold block mb-1">Target Audience:</span>
                      <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        {brief.targetAudience}
                      </p>
                    </div>

                    <div>
                      <span className="text-slate-500 font-bold block mb-1">Activated Modules:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {brief.services &&
                          brief.services.map((svc: string, sIdx: number) => (
                            <span
                              key={sIdx}
                              className="px-2.5 py-1 rounded-xl bg-orange-50 text-[#ff5b37] text-[11px] font-bold border border-orange-100"
                            >
                              {svc}
                            </span>
                          ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-500 font-bold block mb-1">Primary Objectives:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {brief.primaryGoals &&
                          brief.primaryGoals.map((g: string, gIdx: number) => (
                            <span
                              key={gIdx}
                              className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-800 text-[11px] font-bold border border-slate-200"
                            >
                              {g}
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>
                      Payment Method:{" "}
                      <strong className="text-slate-900 uppercase">
                        {brief.paymentMethod || "invoice"} ({brief.preferredCurrency || "USD"})
                      </strong>
                    </span>
                    <span>
                      Submitted: {brief.createdAt ? new Date(brief.createdAt).toLocaleString() : "Recently"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
