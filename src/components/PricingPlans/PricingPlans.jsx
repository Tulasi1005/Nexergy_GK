import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    CheckCircle2,
    ArrowRight,
    Sparkles,
    ShieldCheck,
    Zap,
    Rocket,
    Check,
    HelpCircle,
    Building2,
    ChevronDown,
    Clock,
    Users,
    Layers,
    Code2
} from "lucide-react";
import { Reveal } from "../Reveal";
import "./PricingPlans.css";

export const PRICING_DATA = [
    {
        id: "starter",
        exactLabel: "Starter",
        exactArrow: ">>",
        badge: "STARTUP & RAPID MVP",
        tagline: "For Early-Stage Startups & Fast Validation",
        description: "Launch your core digital product or web platform fast. Production-ready architecture engineered to test product-market fit.",
        price: {
            usd: { monthly: "$1,499", project: "$2,999", period: "/ month" },
            inr: { monthly: "₹99,000", project: "₹1,89,000", period: "/ నెల" },
        },
        deliveryTime: "2 – 3 Weeks MVP Sprint",
        podTeam: "1 Senior Full-Stack Engineer + QA",
        features: [
            "Production-Grade Web Application (React, Node.js, Vite)",
            "Responsive Modern UI/UX with Clean Tailwind / Vanilla CSS",
            "Core REST / GraphQL APIs & PostgreSQL Database",
            "Essential Cloud Deployment (AWS / Vercel) & CI/CD",
            "Basic AI Chatbot / Knowledge Assistant Integration",
            "100% Client Intellectual Property & Source Code Ownership",
            "30 Days Post-Launch Warranty & Bug-Fix Support",
        ],
        tags: ["Web Apps", "Custom APIs", "Fast Launch", "PostgreSQL"],
        ctaText: "Start with Starter",
        ctaTo: "/contact?plan=starter",
        isPopular: false,
    },
    {
        id: "growth",
        exactLabel: "growth",
        exactArrow: ">>",
        badge: "MOST POPULAR • SCALE-UP",
        tagline: "For Scaling Companies & Digital Modernization",
        description: "Full-stack web and mobile apps, custom AI automation workflows, and robust cloud infrastructure built to scale operations.",
        price: {
            usd: { monthly: "$3,499", project: "$6,999", period: "/ month" },
            inr: { monthly: "₹2,49,000", project: "₹4,99,000", period: "/ నెల" },
        },
        deliveryTime: "Continuous Bi-Weekly Sprints",
        podTeam: "2–3 Agile Engineers + Tech Lead + QA",
        features: [
            "Full-Stack Web + Cross-Platform Mobile Apps (iOS & Android)",
            "Custom AI Workflows, RAG Pipelines & Knowledge Retrieval",
            "PostgreSQL Database Optimization, Indexing & High Availability",
            "Third-Party ERP, CRM, & Payment Gateway Integrations",
            "Automated Testing, CI/CD Pipelines & Cloud Architecture",
            "Role-Based Access Control (RBAC), OAuth & Security Hardening",
            "Bi-Weekly Sprint Demos & Dedicated Engineering Lead",
            "60 Days Extended Hypercare & Priority SLA Support",
            "100% Client IP & Source Code Ownership",
        ],
        tags: ["Web + Mobile", "Custom AI & RAG", "Agile Pod", "High-Throughput"],
        ctaText: "Scale with Growth",
        ctaTo: "/contact?plan=growth",
        isPopular: true,
    },
    {
        id: "premium",
        exactLabel: "premium",
        exactArrow: ">>",
        badge: "ENTERPRISE • DEDICATED POD",
        tagline: "For Enterprises & Mission-Critical Architecture",
        description: "Full-scale dedicated agile engineering pod, custom AI reasoning models, legacy modernization, and 24/7 priority SLA support.",
        price: {
            usd: { monthly: "$6,999", project: "Custom Quote", period: "/ month" },
            inr: { monthly: "₹4,99,000", project: "కస్టమ్ ఎస్టిమేట్", period: "/ నెల" },
        },
        deliveryTime: "Dedicated Agile Pod Partnership",
        podTeam: "4–6 Full Pod (Lead Architect, Devs, QA, DevOps)",
        features: [
            "Full-Scale Enterprise Digital Transformation & Modernization",
            "Dedicated Agile Engineering Pod (4+ Engineers)",
            "Custom Enterprise AI Reasoning Engines & Autonomous Agents",
            "Zero-Downtime Migration & High-Concurrency Cloud Scaling",
            "Enterprise Security Audits, OWASP Hardening & Compliance",
            "Direct Slack/Teams Channel with Daily Standups & Sprint Planning",
            "99.99% Uptime Guarantee with 24/7 Priority Incident SLA",
            "Direct Executive CTO Advisory & Architecture Roadmapping",
            "100% Absolute IP Ownership & Complete Knowledge Transfer",
        ],
        tags: ["Enterprise Pod", "Autonomous AI", "24/7 SLA", "CTO Advisory"],
        ctaText: "Partner on Premium",
        ctaTo: "/contact?plan=premium",
        isPopular: false,
    },
];

const COMPARISON_ROWS = [
    { feature: "Web Platform Engineering", starter: "Standard Web App", growth: "Advanced Full-Stack", premium: "Multi-Platform Enterprise" },
    { feature: "Mobile Applications", starter: "Responsive Web/PWA", growth: "iOS + Android Native", premium: "Multi-Platform + Offline Sync" },
    { feature: "AI & Automation", starter: "Basic Chatbot", growth: "Custom RAG & Pipelines", premium: "Enterprise Reasoning Engines" },
    { feature: "Database & Architecture", starter: "PostgreSQL Essentials", growth: "Optimized HA Database", premium: "Distributed Cloud Database" },
    { feature: "Dedicated Team Pod", starter: "1 Engineer", growth: "2–3 Engineers + QA", premium: "4–6+ Full Agile Pod" },
    { feature: "Delivery Model", starter: "2–3 Week MVP Sprint", growth: "Continuous Pod Model", premium: "Full-Time Dedicated Pod" },
    { feature: "Source Code Ownership", starter: "100% Client IP", growth: "100% Client IP", premium: "100% Client IP" },
    { feature: "Technical Support SLA", starter: "30 Days Warranty", growth: "60 Days Priority", premium: "24/7 Enterprise SLA (99.99%)" },
];

const FAQS = [
    {
        q: "What makes the GK Nexergy Pod Model unique?",
        a: "Unlike typical outsourcing with shared resources and shifting contractors, our Agile Engineering Pods provide dedicated, practicing software engineers working in sprint cycles directly on your product with full transparency.",
    },
    {
        q: "Do we retain 100% intellectual property and source code ownership?",
        a: "Yes, absolutely. Across all plans (Starter, Growth, and Premium), you retain 100% IP, copyright, and source code ownership from day one. Repositories and cloud assets are deployed directly under your accounts.",
    },
    {
        q: "Can we start with the Starter plan and upgrade to Growth later?",
        a: "Yes. Many of our clients start with the Starter Plan to build and launch an MVP, and seamlessly transition into the Growth or Premium Pod as product usage and feature requirements expand.",
    },
    {
        q: "How quickly can our project or pod begin?",
        a: "Starter sprints typically kick off within 3 business days following our initial architectural discovery session. Growth and Premium pods are assigned and onboarded within 5 business days.",
    },
];

export const PricingPlans = ({
    showHeader = true,
    showComparison = true,
    showFaqs = true,
    initialPlan = null
}) => {
    const [activePlan, setActivePlan] = useState(initialPlan);
    const [currency, setCurrency] = useState("usd"); // 'usd' or 'inr'
    const [billingCycle, setBillingCycle] = useState("monthly"); // 'monthly' or 'project'
    const [expandedFaq, setExpandedFaq] = useState(null);

    React.useEffect(() => {
        if (initialPlan) {
            setActivePlan(initialPlan);
        }
    }, [initialPlan]);

    const selectedPlan = PRICING_DATA.find((p) => p.id === activePlan) || null;

    const handleSelectSegment = (planId) => {
        setActivePlan((prev) => (prev === planId ? null : planId));
    };

    return (
        <section className="pricing-section py-16 sm:py-24" id="pricing-plans" data-testid="pricing-section">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* SECTION HEADER */}
                {showHeader && (
                    <Reveal>
                        <div className="text-center max-w-3xl mx-auto">
                            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-ink dark:text-white">
                                Flexible Plans Built for <span className="text-brand dark:text-blue-400">Measurable Growth</span>
                            </h2>
                            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                                Select the ideal tier for your business requirements. Dedicated engineering pods, complete IP ownership, and zero hidden costs.
                            </p>
                        </div>
                    </Reveal>
                )}

                {/* ========================================================================= */}
                {/* EXACT 3-SEGMENT BOX FROM THE USER'S IMAGE: [ Starter >> | growth >> | premium >> ] */}
                {/* ========================================================================= */}
                <Reveal delay={0.15}>
                    <div className="pricing-image-selector-wrap" data-testid="pricing-exact-selector">
                        <div className="pricing-segmented-bar" role="tablist" aria-label="Pricing Plan Options">
                            {PRICING_DATA.map((plan) => {
                                const isActive = activePlan === plan.id;
                                return (
                                    <button
                                        key={plan.id}
                                        role="tab"
                                        aria-selected={isActive}
                                        onClick={() => handleSelectSegment(plan.id)}
                                        data-testid={`pricing-tab-${plan.id}`}
                                        className={`pricing-segment-tab ${isActive ? "active" : ""}`}
                                    >
                                        <span className="tab-name">{plan.exactLabel}</span>
                                        <span className="tab-arrow">{plan.exactArrow}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </Reveal>

                {/* CONTROLS BAR: Currency & Billing Toggles (visible when a plan is active) */}
                {selectedPlan && (
                    <Reveal delay={0.1}>
                        <div className="pricing-controls-bar">
                            {/* Billing Switch */}
                            <div className="pricing-toggle-group">
                                <button
                                    className={`pricing-toggle-btn ${billingCycle === "monthly" ? "active" : ""}`}
                                    onClick={() => setBillingCycle("monthly")}
                                    data-testid="toggle-billing-monthly"
                                >
                                    Monthly Agile Pod
                                </button>
                                <button
                                    className={`pricing-toggle-btn ${billingCycle === "project" ? "active" : ""}`}
                                    onClick={() => setBillingCycle("project")}
                                    data-testid="toggle-billing-project"
                                >
                                    Project / Fixed Scope
                                </button>
                            </div>

                            {/* Currency Switch */}
                            <div className="pricing-toggle-group">
                                <button
                                    className={`pricing-toggle-btn ${currency === "usd" ? "active" : ""}`}
                                    onClick={() => setCurrency("usd")}
                                    data-testid="toggle-currency-usd"
                                >
                                    USD ($)
                                </button>
                                <button
                                    className={`pricing-toggle-btn ${currency === "inr" ? "active" : ""}`}
                                    onClick={() => setCurrency("inr")}
                                    data-testid="toggle-currency-inr"
                                >
                                    INR (₹)
                                </button>
                            </div>
                        </div>
                    </Reveal>
                )}

                {/* ========================================================================= */}
                {/* ACTIVE PLAN CONTENT (ONLY APPEARS FOR CLICKED TAB)                       */}
                {/* ========================================================================= */}
                <div className="w-full mt-2" data-testid="pricing-active-plan-container">
                    <AnimatePresence mode="wait">
                        {selectedPlan ? (
                            <motion.div
                                key={selectedPlan.id}
                                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -16, scale: 0.98 }}
                                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                                className="pricing-single-card-wrap"
                            >
                            <div
                                data-testid={`pricing-card-${selectedPlan.id}`}
                                className={`pricing-single-card ${selectedPlan.isPopular ? "is-featured" : ""}`}
                            >
                                {/* Popular Badge */}
                                {selectedPlan.isPopular && (
                                    <div className="pricing-badge-popular">
                                        <Sparkles className="h-3 w-3" />
                                        <span>Most Popular</span>
                                    </div>
                                )}

                                {/* Card Header */}
                                <div>
                                    <div className="flex items-center justify-between">
                                        <span className="plan-code-title">
                                            {selectedPlan.exactLabel}
                                            <span className="plan-code-arrow">{selectedPlan.exactArrow}</span>
                                        </span>
                                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                                            {selectedPlan.badge}
                                        </span>
                                    </div>

                                    <h3 className="mt-3 font-display text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                                        {selectedPlan.tagline}
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                                        {selectedPlan.description}
                                    </p>

                                    {/* Price Section */}
                                    <div className="plan-price-wrap my-5">
                                        <span className="plan-price-val">
                                            {billingCycle === "monthly" ? selectedPlan.price[currency].monthly : selectedPlan.price[currency].project}
                                        </span>
                                        <span className="plan-price-period text-sm sm:text-base">
                                            {billingCycle === "monthly" ? selectedPlan.price[currency].period : "/ project"}
                                        </span>
                                    </div>

                                    {/* Timeline & Pod Specs */}
                                    <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-200/60 dark:border-slate-700/60">
                                        <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                                            <Clock className="h-4 w-4 text-brand dark:text-blue-400 shrink-0" />
                                            <span>{selectedPlan.deliveryTime}</span>
                                        </div>
                                        <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                                            <Users className="h-4 w-4 text-brand dark:text-blue-400 shrink-0" />
                                            <span>{selectedPlan.podTeam}</span>
                                        </div>
                                    </div>

                                    {/* Features List (2 columns on tablet/desktop) */}
                                    <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">
                                            What's Included in {selectedPlan.exactLabel} Plan:
                                        </p>
                                        <div className="pricing-features-grid-2col">
                                            {selectedPlan.features.map((feat, fIdx) => (
                                                <div key={fIdx} className="plan-feature-row">
                                                    <CheckCircle2 className="plan-feature-icon h-4 w-4" />
                                                    <span>{feat}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Card Footer / CTA */}
                                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                                    <Link
                                        to={selectedPlan.ctaTo}
                                        data-testid={`pricing-cta-${selectedPlan.id}`}
                                        className="plan-cta-btn plan-cta-btn-primary !mt-0 !py-4 text-base"
                                    >
                                        <span>{selectedPlan.ctaText}</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>

                                    <p className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
                                        100% Client IP Ownership • Zero Vendor Lock-in • Dedicated Pod Access
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="pricing-prompt"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.25 }}
                            className="pricing-empty-state-wrap"
                            data-testid="pricing-empty-state"
                        >
                            <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-brand dark:text-blue-400 mb-3 border border-blue-100 dark:border-blue-900/40">
                                <Sparkles className="w-5 h-5 animate-pulse" />
                            </div>
                            <h4 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white">
                                Select a tier above to view details
                            </h4>
                            <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                                Click on <span className="font-bold text-brand dark:text-blue-400 font-mono">Starter</span>, <span className="font-bold text-brand dark:text-blue-400 font-mono">growth</span>, or <span className="font-bold text-brand dark:text-blue-400 font-mono">premium</span> above to view dedicated pod deliverables, team structure, and transparent pricing.
                            </p>
                        </motion.div>
                    )}
                    </AnimatePresence>
                </div>

                {/* ========================================================================= */}
                {/* PLAN COMPARISON TABLE                                                    */}
                {/* ========================================================================= */}
                {showComparison && (
                    <Reveal delay={0.25}>
                        <div className="mt-20 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-card p-6 sm:p-10 shadow-lg">
                            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h3 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">
                                        Feature Comparison Matrix
                                    </h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                        Side-by-side technical breakdown across all 3 engagement tiers.
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-brand dark:text-blue-400">
                                        Dedicated Delivery Pods
                                    </span>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm" data-testid="pricing-comparison-table">
                                    <thead>
                                        <tr className="border-b border-slate-200 dark:border-slate-800 text-xs uppercase font-extrabold text-slate-500 dark:text-slate-400">
                                            <th className="py-4 pr-4">Capability</th>
                                            <th
                                                onClick={() => handleSelectSegment("starter")}
                                                className={`py-4 px-4 font-mono transition-colors cursor-pointer ${activePlan === "starter" ? "text-brand dark:text-electric font-black bg-blue-50/50 dark:bg-blue-950/30" : "text-slate-600 dark:text-slate-400 hover:text-brand dark:hover:text-blue-400"}`}
                                            >
                                                Starter &gt;&gt;
                                            </th>
                                            <th
                                                onClick={() => handleSelectSegment("growth")}
                                                className={`py-4 px-4 font-mono transition-colors cursor-pointer ${activePlan === "growth" ? "text-brand dark:text-electric font-black bg-blue-50/50 dark:bg-blue-950/30" : "text-slate-600 dark:text-slate-400 hover:text-brand dark:hover:text-blue-400"}`}
                                            >
                                                growth &gt;&gt;
                                            </th>
                                            <th
                                                onClick={() => handleSelectSegment("premium")}
                                                className={`py-4 pl-4 font-mono transition-colors cursor-pointer ${activePlan === "premium" ? "text-brand dark:text-electric font-black bg-blue-50/50 dark:bg-blue-950/30" : "text-slate-600 dark:text-slate-400 hover:text-brand dark:hover:text-blue-400"}`}
                                            >
                                                premium &gt;&gt;
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                                        {COMPARISON_ROWS.map((row, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                                                <td className="py-3.5 pr-4 font-semibold text-slate-900 dark:text-white">
                                                    {row.feature}
                                                </td>
                                                <td className={`py-3.5 px-4 text-xs sm:text-sm ${activePlan === "starter" ? "font-bold text-brand dark:text-blue-300 bg-blue-50/30 dark:bg-blue-950/20" : ""}`}>{row.starter}</td>
                                                <td className={`py-3.5 px-4 text-xs sm:text-sm ${activePlan === "growth" ? "font-bold text-brand dark:text-blue-300 bg-blue-50/30 dark:bg-blue-950/20" : ""}`}>{row.growth}</td>
                                                <td className={`py-3.5 pl-4 text-xs sm:text-sm ${activePlan === "premium" ? "font-bold text-brand dark:text-blue-300 bg-blue-50/30 dark:bg-blue-950/20" : ""}`}>{row.premium}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </Reveal>
                )}

                {/* ========================================================================= */}
                {/* PRICING FAQ ACCORDION                                                     */}
                {/* ========================================================================= */}
                {showFaqs && (
                    <Reveal delay={0.3}>
                        <div className="mt-16 max-w-4xl mx-auto">
                            <div className="text-center mb-8">
                                <h3 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">
                                    Frequently Asked Questions
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                    Everything you need to know about our pricing and pod delivery contracts.
                                </p>
                            </div>

                            <div className="space-y-3">
                                {FAQS.map((faq, fIdx) => {
                                    const isOpen = expandedFaq === fIdx;
                                    return (
                                        <div
                                            key={fIdx}
                                            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-card overflow-hidden transition-all"
                                        >
                                            <button
                                                onClick={() => setExpandedFaq(isOpen ? null : fIdx)}
                                                className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-display text-sm sm:text-base font-bold text-slate-900 dark:text-white hover:text-brand dark:hover:text-blue-400 transition-colors cursor-pointer"
                                            >
                                                <span>{faq.q}</span>
                                                <ChevronDown
                                                    className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-brand dark:text-blue-400" : ""}`}
                                                />
                                            </button>
                                            <AnimatePresence>
                                                {isOpen && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="px-4 pb-5 sm:px-5 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 pt-3"
                                                    >
                                                        {faq.a}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </Reveal>
                )}
            </div>
        </section>
    );
};

export default PricingPlans;
