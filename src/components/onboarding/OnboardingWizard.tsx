"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Building2,
  Target,
  DollarSign,
  UserCheck,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  QrCode,
  CreditCard,
  Copy,
} from "lucide-react";
import confetti from "canvas-confetti";

type CryptoInvoiceDetails = {
  invoiceId: string;
  depositAddress: string;
  network: string;
  cryptoAmount: string;
  qrCodeUrl: string;
  expiresInMinutes: number;
  message?: string;
  data?: { tx_ref?: string };
};

export default function OnboardingWizard() {
  const searchParams = useSearchParams();

  // Current Step (1 to 4, 5 is Success)
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [submittedBriefId, setSubmittedBriefId] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");

  // Payment state
  const [activePaymentModal, setActivePaymentModal] = useState<null | {
    gateway: "crypto";
    details: CryptoInvoiceDetails;
  }>(null);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [cryptoTxHash, setCryptoTxHash] = useState("");
  const [cryptoConfirmationError, setCryptoConfirmationError] = useState("");
  const [cryptoConfirmationSubmitting, setCryptoConfirmationSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Business Details
    businessName: "",
    industry: "E-commerce & Retail",
    websiteUrl: "",
    socialHandles: "",
    teamSize: "1-10",

    // Step 2: Goals & Audience
    targetAudience: "",
    primaryGoals: ["High-Intent Qualified Leads"],
    currentMonthlyRevenue: "$25,000 - $50,000",

    // Step 3: Budget & Services
    monthlyBudget: "$3,000 - $5,000 / mo",
    services: [
      "AI Content & Social Media Automation",
      "AI-Driven Meta & Google Ad Management",
    ],
    timeline: "Immediate (Within 7 days)",

    // Step 4: Contact & Billing
    contactName: "",
    email: "",
    phone: "",
    notes: "",
    preferredCurrency: "USD" as "USD" | "NGN",
    paymentMethod: "invoice" as "flutterwave" | "crypto" | "invoice",
    paymentStatus: "pending" as "pending" | "paid" | "scheduled",
  });

  // Read URL parameters if user navigated from ROI Calculator or Pricing
  useEffect(() => {
    const planParam = searchParams.get("plan");
    const budgetParam = searchParams.get("budget");
    const currencyParam = searchParams.get("currency");
    const serviceParam = searchParams.get("service");
    const domainParam = searchParams.get("domain");

    // The search parameters are the source of truth when a user enters from a priced plan or estimator.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData((prev) => ({
      ...prev,
      businessName: domainParam || prev.businessName,
      websiteUrl: domainParam ? `https://${domainParam}` : prev.websiteUrl,
      monthlyBudget: budgetParam || prev.monthlyBudget,
      preferredCurrency: currencyParam === "NGN" ? "NGN" : "USD",
      paymentMethod: currencyParam === "NGN" ? "flutterwave" : "invoice",
      services: serviceParam ? [serviceParam] : prev.services,
      notes: planParam ? `Interested in ${planParam} tier` : prev.notes,
    }));
  }, [searchParams]);

  // Goal Options
  const goalOptions = [
    "High-Intent Qualified Leads",
    "Direct Sales & E-commerce ROAS",
    "Brand Authority & Viral Reach",
    "Local Store Foot Traffic & Calls",
    "Automated 24/7 WhatsApp Conversions",
  ];

  // Service Options
  const serviceOptions = [
    "AI Content & Social Media Automation",
    "Local SEO & Google Business Profile Optimization",
    "AI-Driven Meta & Google Ad Management",
    "Conversational AI Lead Capture Chatbots",
  ];

  const handleGoalToggle = (goal: string) => {
    setFormData((prev) => {
      const exists = prev.primaryGoals.includes(goal);
      return {
        ...prev,
        primaryGoals: exists
          ? prev.primaryGoals.filter((g) => g !== goal)
          : [...prev.primaryGoals, goal],
      };
    });
  };

  const handleServiceToggle = (svc: string) => {
    setFormData((prev) => {
      const exists = prev.services.includes(svc);
      return {
        ...prev,
        services: exists
          ? prev.services.filter((s) => s !== svc)
          : [...prev.services, svc],
      };
    });
  };

  // Step Validation
  const validateStep = (step: number) => {
    setErrorMsg("");
    if (step === 1) {
      if (!formData.businessName.trim()) {
        setErrorMsg("Please enter your business or brand name.");
        return false;
      }
      if (!formData.industry.trim()) {
        setErrorMsg("Please select your industry.");
        return false;
      }
    } else if (step === 2) {
      if (!formData.targetAudience.trim()) {
        setErrorMsg("Please provide a brief description of your target customers.");
        return false;
      }
      if (formData.primaryGoals.length === 0) {
        setErrorMsg("Please select at least one primary marketing goal.");
        return false;
      }
    } else if (step === 3) {
      if (!formData.monthlyBudget) {
        setErrorMsg("Please select an estimated monthly budget range.");
        return false;
      }
      if (formData.services.length === 0) {
        setErrorMsg("Please select at least one AI service module.");
        return false;
      }
    } else if (step === 4) {
      if (!formData.contactName.trim()) {
        setErrorMsg("Please provide your full name.");
        return false;
      }
      if (!formData.email.trim() || !formData.email.includes("@")) {
        setErrorMsg("Please provide a valid business email address.");
        return false;
      }
      if (!formData.phone.trim()) {
        setErrorMsg("Please provide a phone / WhatsApp number for instant notifications.");
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setErrorMsg("");
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Submit Brief to API
  const handleSubmitBrief = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    setSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit brief.");
      }

      if (!data.briefId) {
        throw new Error("Your brief was saved without a reference ID. Please contact support.");
      }
      setSubmittedBriefId(data.briefId);
      setTrackingUrl(data.trackingUrl || "");
      setCurrentStep(5); // Show success celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      // Start the selected real payment flow after the brief is stored.
      if (formData.paymentMethod === "flutterwave" || formData.paymentMethod === "crypto") {
        initiatePaymentFlow(data.briefId, formData.paymentMethod);
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const initiatePaymentFlow = async (briefId: string, gateway: string) => {
    try {
      const amountVal = formData.preferredCurrency === "NGN" ? 1250000 : 990;
      const checkoutRes = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gateway,
          amount: amountVal,
          currency: formData.preferredCurrency,
          customerEmail: formData.email,
          customerName: formData.contactName,
          customerPhone: formData.phone,
          planName: `${formData.businessName} AI Growth Retainer`,
          briefId,
          cryptoCurrency: "USDT_TRC20",
        }),
      });

      const checkoutData = await checkoutRes.json();
      if (!checkoutRes.ok || !checkoutData.success) {
        throw new Error(checkoutData.error || "Unable to start the payment session.");
      }

      if (gateway === "flutterwave" && checkoutData.checkoutUrl) {
        window.location.assign(checkoutData.checkoutUrl);
        return;
      }

      if (gateway === "crypto" && checkoutData.invoice) {
        setCryptoTxHash("");
        setCryptoConfirmationError("");
        setActivePaymentModal({ gateway: "crypto", details: checkoutData.invoice });
        return;
      }

      throw new Error("The payment provider did not return a checkout session.");
    } catch (pErr: unknown) {
      setErrorMsg(pErr instanceof Error ? pErr.message : "Unable to start the payment session.");
    }
  };

  const submitCryptoConfirmation = async () => {
    if (!activePaymentModal || !cryptoTxHash.trim()) {
      setCryptoConfirmationError("Enter the transaction hash from your wallet before submitting.");
      return;
    }

    setCryptoConfirmationSubmitting(true);
    setCryptoConfirmationError("");
    try {
      const res = await fetch("/api/checkout/crypto-confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          briefId: submittedBriefId,
          invoiceId: activePaymentModal.details.invoiceId,
          txHash: cryptoTxHash,
          network: activePaymentModal.details.network,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Unable to submit the transaction for verification.");
      }
      setActivePaymentModal(null);
      setErrorMsg("Your transaction hash was submitted for on-chain verification.");
    } catch (err: unknown) {
      setCryptoConfirmationError(
        err instanceof Error ? err.message : "Unable to submit the transaction for verification."
      );
    } finally {
      setCryptoConfirmationSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Wizard Step Progress Tracker */}
      {currentStep < 5 && (
        <div className="mb-10">
          <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-4">
            {[
              { num: 1, title: "Business Profile", icon: Building2 },
              { num: 2, title: "Goals & Audience", icon: Target },
              { num: 3, title: "Budget & Stack", icon: DollarSign },
              { num: 4, title: "Contact & Billing", icon: UserCheck },
            ].map((step) => {
              const isActive = currentStep === step.num;
              const isDone = currentStep > step.num;
              return (
                <div
                  key={step.num}
                  className={`flex items-center gap-2.5 p-3 rounded-2xl border text-xs font-bold transition-all ${
                    isActive
                      ? "bg-[#fff2ef] border-[#ff5b37] text-[#ff5b37] shadow-sm"
                      : isDone
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                      : "bg-white border-slate-200 text-slate-500"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                      isActive
                        ? "bg-[#ff5b37] text-white font-bold"
                        : isDone
                        ? "bg-emerald-600 text-white font-bold"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : step.num}
                  </div>
                  <span className="hidden sm:inline truncate">{step.title}</span>
                </div>
              );
            })}
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#ff5b37] h-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
            </div>
          </div>
      )}

      {/* Error alert if any */}
      {errorMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-3">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-2xl relative overflow-hidden">
        {/* ================= STEP 1: BUSINESS PROFILE ================= */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#ff5b37] font-bold block mb-1">
                Step 01 of 04
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Tell Us About Your Business
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm">
                We calibrate your AI models and competitive research based on your exact market position.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Business / Brand Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  placeholder="e.g. Apex Health Co or Nova Apparel"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#ff5b37] text-slate-900 placeholder-slate-400 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Industry / Niche *
                </label>
                <select
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#ff5b37] text-slate-900 text-sm outline-none cursor-pointer"
                >
                  <option value="E-commerce & Retail">E-commerce & Retail</option>
                  <option value="B2B SaaS & Tech">B2B SaaS & Tech</option>
                  <option value="Local Healthcare & MedSpa">Local Healthcare & MedSpa</option>
                  <option value="Real Estate & Development">Real Estate & Development</option>
                  <option value="Financial & Professional Services">Financial & Professional Services</option>
                  <option value="Logistics & Supply Chain">Logistics & Supply Chain</option>
                  <option value="Other High-Growth Venture">Other High-Growth Venture</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Website URL
                </label>
                <input
                  type="text"
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                  placeholder="https://yourcompany.com"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#ff5b37] text-slate-900 placeholder-slate-400 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Social Media Handles
                </label>
                <input
                  type="text"
                  value={formData.socialHandles}
                  onChange={(e) => setFormData({ ...formData, socialHandles: e.target.value })}
                  placeholder="@yourbrand on IG / LinkedIn / X"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#ff5b37] text-slate-900 placeholder-slate-400 text-sm outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Team Size
                </label>
                <div className="grid grid-cols-4 gap-2.5">
                  {["Solo Founder", "2 - 10", "11 - 50", "50+"].map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setFormData({ ...formData, teamSize: sz })}
                      className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                        formData.teamSize === sz
                          ? "bg-[#fff2ef] border-[#ff5b37] text-[#ff5b37]"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={nextStep}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#ff5b37] hover:bg-[#e84a26] text-white font-bold text-sm shadow-lg shadow-orange-500/25 hover:scale-[1.02] transition-all"
              >
                <span>Continue to Goals</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: GOALS & AUDIENCE ================= */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#ff5b37] font-bold block mb-1">
                Step 02 of 04
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Audience & Growth Objectives
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm">
                Define the high-value outcomes your automated marketing engines will be held accountable for.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Describe Your Target Audience *
              </label>
              <textarea
                required
                rows={3}
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                placeholder="e.g. Corporate VP of Operations looking for logistics efficiency, or Women 25-45 looking for medical grade skincare..."
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#ff5b37] text-slate-900 placeholder-slate-400 text-sm outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                Primary Marketing Goals (Select All That Apply) *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {goalOptions.map((goal) => {
                  const isSelected = formData.primaryGoals.includes(goal);
                  return (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => handleGoalToggle(goal)}
                      className={`p-3.5 rounded-2xl text-left border text-xs font-bold flex items-center justify-between transition-all ${
                        isSelected
                          ? "bg-[#fff2ef] border-[#ff5b37] text-[#ff5b37] shadow-sm"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <span>{goal}</span>
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                          isSelected ? "bg-[#ff5b37] text-white" : "border border-slate-300"
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Current Monthly Revenue Run Rate
              </label>
              <select
                value={formData.currentMonthlyRevenue}
                onChange={(e) => setFormData({ ...formData, currentMonthlyRevenue: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#ff5b37] text-slate-900 text-sm outline-none cursor-pointer"
              >
                <option value="Pre-revenue / Launch phase">Pre-revenue / Launch phase</option>
                <option value="$5,000 - $15,000 (or ₦5M - ₦15M)">$5,000 - $15,000 (or ₦5M - ₦15M)</option>
                <option value="$15,000 - $50,000 (or ₦15M - ₦50M)">$15,000 - $50,000 (or ₦15M - ₦50M)</option>
                <option value="$50,000 - $150,000 (or ₦50M - ₦150M)">$50,000 - $150,000 (or ₦50M - ₦150M)</option>
                <option value="$150,000+ / mo (Enterprise)">$150,000+ / mo (Enterprise)</option>
              </select>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#ff5b37] hover:bg-[#e84a26] text-white font-bold text-sm shadow-lg shadow-orange-500/25 hover:scale-[1.02] transition-all"
              >
                <span>Continue to Budget</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: BUDGET & SERVICE SELECTION ================= */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#ff5b37] font-bold block mb-1">
                Step 03 of 04
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Monthly Budget & AI Modules
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm">
                Select the service components you want activated in your autonomous marketing stack.
              </p>
            </div>

            {/* Currency Selector for Budget */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500">Budget Currency:</span>
              <div className="inline-flex p-1 rounded-2xl bg-slate-100 border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, preferredCurrency: "USD" })}
                  className={`px-3 py-1 rounded-xl font-bold transition-all ${
                    formData.preferredCurrency === "USD" ? "bg-[#ff5b37] text-white shadow-sm" : "text-slate-600"
                  }`}
                >
                  USD ($)
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, preferredCurrency: "NGN" })}
                  className={`px-3 py-1 rounded-xl font-bold transition-all ${
                    formData.preferredCurrency === "NGN" ? "bg-[#ff5b37] text-white shadow-sm" : "text-slate-600"
                  }`}
                >
                  NGN (₦ / Flutterwave)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Monthly Marketing & Ad Spend Range *
              </label>
              <select
                value={formData.monthlyBudget}
                onChange={(e) => setFormData({ ...formData, monthlyBudget: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#ff5b37] text-slate-900 text-sm outline-none cursor-pointer"
              >
                {formData.preferredCurrency === "USD" ? (
                  <>
                    <option value="$1,000 - $3,000 / mo">$1,000 - $3,000 / mo (Starter Scale)</option>
                    <option value="$3,000 - $7,500 / mo">$3,000 - $7,500 / mo (Growth Acceleration)</option>
                    <option value="$7,500 - $20,000 / mo">$7,500 - $20,000 / mo (High-Volume Scale)</option>
                    <option value="$20,000+ / mo (Enterprise)">$20,000+ / mo (Enterprise Sovereign)</option>
                  </>
                ) : (
                  <>
                    <option value="₦1,250,000 - ₦3,000,000 / mo">₦1,250,000 - ₦3,000,000 / mo (Starter)</option>
                    <option value="₦3,150,000 - ₦8,000,000 / mo">₦3,150,000 - ₦8,000,000 / mo (Scale)</option>
                    <option value="₦8,000,000 - ₦25,000,000 / mo">₦8,000,000 - ₦25,000,000 / mo (High Volume)</option>
                    <option value="₦25,000,000+ / mo">₦25,000,000+ / mo (Enterprise)</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                Select Service Modules *
              </label>
              <div className="space-y-2.5">
                {serviceOptions.map((svc) => {
                  const isChecked = formData.services.includes(svc);
                  return (
                    <button
                      key={svc}
                      type="button"
                      onClick={() => handleServiceToggle(svc)}
                      className={`w-full p-4 rounded-2xl text-left border text-xs sm:text-sm font-bold flex items-center justify-between transition-all ${
                        isChecked
                          ? "bg-[#fff2ef] border-[#ff5b37] text-slate-900"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <span>{svc}</span>
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                          isChecked ? "bg-[#ff5b37] text-white" : "border border-slate-300"
                        }`}
                      >
                        {isChecked && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Preferred Launch Timeline
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  "Immediate (Within 7 days)",
                  "Next 2 - 4 Weeks",
                  "Exploring Strategy",
                ].map((tl) => (
                  <button
                    key={tl}
                    type="button"
                    onClick={() => setFormData({ ...formData, timeline: tl })}
                    className={`p-3 rounded-xl text-xs font-bold border text-center transition-all ${
                      formData.timeline === tl
                        ? "bg-[#fff2ef] border-[#ff5b37] text-[#ff5b37]"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {tl}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#ff5b37] hover:bg-[#e84a26] text-white font-bold text-sm shadow-lg shadow-orange-500/25 hover:scale-[1.02] transition-all"
              >
                <span>Continue to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: CONTACT & CHECKOUT INTEGRATION ================= */}
        {currentStep === 4 && (
          <form onSubmit={handleSubmitBrief} className="space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#ff5b37] font-bold block mb-1">
                Step 04 of 04
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Final Step: Contact & Payment Integration
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm">
                Share your contact details so we can prepare your tailored scope and payment options.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Full Name / Decision Maker *
                </label>
                <input
                  type="text"
                  required
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  placeholder="e.g. Elena Rostova"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#ff5b37] text-slate-900 placeholder-slate-400 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Work / Business Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="elena@company.com"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#ff5b37] text-slate-900 placeholder-slate-400 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Phone / WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000 or +234 803 000 0000"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#ff5b37] text-slate-900 placeholder-slate-400 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Payment / Retainer Billing Method
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      paymentMethod: e.target.value as "flutterwave" | "crypto" | "invoice",
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#ff5b37] text-slate-900 text-sm outline-none cursor-pointer"
                >
                  <option value="flutterwave">Flutterwave Gateway (NGN Naira / African Cards)</option>
                  <option value="crypto">Crypto Gateway (USDT TRC20 / ERC20, BTC, ETH)</option>
                  <option value="invoice">Review Strategy First & Send Invoice</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Special Notes or Specific Competitors to Target
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any particular competitor ads you want outranked, or specific brand guidelines..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#ff5b37] text-slate-900 placeholder-slate-400 text-sm outline-none"
                />
              </div>
            </div>

            {/* Reassurance Banner */}
            <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100 flex items-center gap-3 text-xs text-slate-700">
              <ShieldCheck className="w-5 h-5 text-[#ff5b37] shrink-0" />
              <span>
                Your details are submitted securely and shared only with the team preparing your proposal.
              </span>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-[#ff5b37] hover:bg-[#e84a26] text-white font-bold text-sm shadow-xl shadow-orange-500/25 hover:shadow-orange-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {submitting ? (
                  <span>Saving & Transmitting Brief...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Submit Brief & Initialize Account</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* ================= STEP 5: SUCCESS & CHECKOUT COMPLETION ================= */}
        {currentStep === 5 && (
          <div className="text-center py-8 space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-full bg-[#fff2ef] border-2 border-orange-200 mx-auto flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-10 h-10 text-[#ff5b37] animate-bounce" />
            </div>

            <div className="max-w-xl mx-auto">
              <span className="text-xs font-mono uppercase tracking-wider text-[#ff5b37] font-bold block mb-1">
                Brief Successfully Registered
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
                Welcome to PulseAI Digital, {formData.contactName}!
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Your growth brief has been committed to our database. A real-time dispatch was sent to our
                Strategy Lead, and your initial AI campaign profile for <strong>{formData.businessName}</strong> is
                now synthesizing.
              </p>

              {/* Brief Summary Box */}
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2.5 mb-8">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Reference ID:</span>
                  <span className="font-mono text-[#ff5b37] font-bold">{submittedBriefId}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Business & Industry:</span>
                  <span className="text-slate-900 font-bold">
                    {formData.businessName} ({formData.industry})
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Selected Services:</span>
                  <span className="text-slate-900 font-medium truncate max-w-[280px]">
                    {formData.services.join(", ")}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Monthly Budget:</span>
                  <span className="text-emerald-700 font-bold">{formData.monthlyBudget}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Preference:</span>
                  <span className="text-slate-900 uppercase font-bold">{formData.paymentMethod}</span>
                </div>
              </div>

              {/* Payment or Next Steps Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                {trackingUrl && (
                  <Link
                    href={trackingUrl}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-700 text-white text-xs font-bold"
                  >
                    Track My Brief
                  </Link>
                )}
                {formData.paymentMethod === "flutterwave" && (
                  <button
                    onClick={() => initiatePaymentFlow(submittedBriefId, "flutterwave")}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#ff5b37] hover:bg-[#e84a26] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Pay Securely via Flutterwave</span>
                  </button>
                )}

                {formData.paymentMethod === "crypto" && (
                  <button
                    onClick={() => initiatePaymentFlow(submittedBriefId, "crypto")}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#ff5b37] hover:bg-[#e84a26] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>View Crypto Invoice</span>
                  </button>
                )}

                <Link
                  href="/"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                >
                  Return to Homepage
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= PAYMENT MODAL (CRYPTO OR FLUTTERWAVE) ================= */}
      {activePaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl relative">
            <button
              onClick={() => setActivePaymentModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 text-sm p-1 rounded-lg"
            >
              ✕
            </button>

            <div>
              <div className="space-y-4 text-center">
                <div className="w-12 h-12 rounded-2xl bg-[#fff2ef] text-[#ff5b37] flex items-center justify-center mx-auto">
                  <QrCode className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Crypto Gateway Invoice</h3>
                <p className="text-xs text-slate-600">
                  Send exactly{" "}
                  <strong className="text-[#ff5b37] font-mono text-sm">
                    {activePaymentModal.details.cryptoAmount} {activePaymentModal.details.network}
                  </strong>{" "}
                  to the address below. Then submit the transaction hash for verification.
                </p>

                {/* QR Code */}
                <div className="p-3 bg-white border border-slate-200 rounded-2xl inline-block mx-auto shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activePaymentModal.details.qrCodeUrl}
                    alt="Crypto Deposit QR"
                    className="w-40 h-40 object-contain mx-auto"
                  />
                </div>

                {/* Deposit Address Box */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-left">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
                    Deposit Address ({activePaymentModal.details.network})
                  </span>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs text-slate-800 truncate">
                      {activePaymentModal.details.depositAddress}
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(activePaymentModal.details.depositAddress);
                        setCopiedAddress(true);
                        setTimeout(() => setCopiedAddress(false), 3000);
                      }}
                      className="px-2.5 py-1 rounded bg-[#ff5b37] text-white hover:bg-[#e84a26] text-xs shrink-0 flex items-center gap-1 font-bold"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedAddress ? "Copied!" : "Copy"}</span>
                    </button>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Invoice: {activePaymentModal.details.invoiceId}</span>
                  <span className="text-emerald-700 font-bold">
                    Valid for {activePaymentModal.details.expiresInMinutes} mins
                  </span>
                </div>

                <div className="space-y-2 text-left">
                  <label htmlFor="crypto-tx-hash" className="block text-xs font-bold text-slate-700">
                    Transaction hash / TxID
                  </label>
                  <input
                    id="crypto-tx-hash"
                    type="text"
                    value={cryptoTxHash}
                    onChange={(event) => setCryptoTxHash(event.target.value)}
                    placeholder="Paste the transaction hash from your wallet"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 font-mono text-xs text-slate-900 outline-none focus:border-[#ff5b37]"
                  />
                  {cryptoConfirmationError && <p className="text-xs text-rose-600">{cryptoConfirmationError}</p>}
                </div>
                <button
                  type="button"
                  disabled={cryptoConfirmationSubmitting}
                  onClick={submitCryptoConfirmation}
                  className="w-full py-3.5 rounded-xl bg-[#ff5b37] hover:bg-[#e84a26] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-orange-500/25 disabled:opacity-50"
                >
                  {cryptoConfirmationSubmitting ? "Submitting…" : "Submit Transaction for Verification"}
                </button>
              </div>
            {/* Flutterwave checkout redirects customers to the provider-hosted payment page. */}
            {/*
              <div className="space-y-4 text-center">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#ff5b37] flex items-center justify-center mx-auto">
                  <CreditCard className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Flutterwave Payment Session</h3>
                <p className="text-xs text-slate-600">
                  {activePaymentModal?.details.message ||
                    "Ready to process payment with Flutterwave for NGN bank transfer, card, or USSD."}
                </p>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Transaction Ref:</span>
                    <span className="font-mono text-[#ff5b37] font-bold">
                      {activePaymentModal?.details.data?.tx_ref || "Unavailable"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Amount:</span>
                    <span className="font-bold text-slate-900">₦1,250,000 NGN</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Mode:</span>
                    <span className="text-emerald-700 font-bold">
                      Live Gateway
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActivePaymentModal(null);
                    alert("Flutterwave Retainer Activated! Receipt dispatched to your email.");
                  }}
                  className="w-full py-3.5 rounded-xl bg-[#ff5b37] hover:bg-[#e84a26] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-orange-500/25"
                >
                  Complete Instant Payment
                </button>
              </div>
            */}
          </div>
        </div>
        </div>
      )}
    </div>
  );
}
