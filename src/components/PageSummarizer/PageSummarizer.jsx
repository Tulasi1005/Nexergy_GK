import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Sparkles,
  BookOpen,
  Copy,
  Check,
  X,
  ArrowRight,
  ExternalLink,
  Clock,
  Compass,
  Lightbulb,
  CheckCircle2,
  Bot,
} from "lucide-react";
import { SOLUTIONS, COURSES } from "../../data/site";
import {
  translateText,
} from "../../utils/multilingualVoiceEngine";
import {
  getCurrentLanguage,
  SUPPORTED_LANGUAGES,
} from "../../utils/translator";
import { MULTILINGUAL_SUMMARIES } from "../../data/summarizerTranslations";

/**
 * Curated high-precision page summaries for all core routes.
 */
const ROUTE_SUMMARIES = {
  "/home": {
    title: "GK Nexergy • Enterprise Engineering Ecosystem",
    badge: "Platform Overview",
    readTime: "30 sec summary (vs 4 min read)",
    stats: "5 Core Solutions • 4 Academy Disciplines • 10-Min Discovery",
    targetAudience: "Startups, enterprises, scaling businesses & aspiring tech professionals",
    summary:
      "GK Nexergy unites enterprise software engineering, mobile app development, Generative AI workflows, and cloud architecture with hands-on talent incubation at Nexergy Academy under the philosophy: Train. Build. Transform.",
    highlights: [
      "Full-stack web & native/cross-platform mobile apps built with 100% client IP ownership.",
      "Dedicated autonomous agile pods delivering enterprise-grade code without agency overhead.",
      "Nexergy Academy bridging industry talent gaps in Cybersecurity, PostgreSQL, Python, and AI.",
      "Transparent tiered pricing (Starter $1,499/mo, Growth $3,499/mo, Premium $6,999/mo).",
    ],
    actionLabel: "Compare Pricing Plans",
    actionRoute: "/pricing",
  },
  "/about": {
    title: "About GK Nexergy • Leadership & Philosophy",
    badge: "Company Story",
    readTime: "25 sec summary (vs 3 min read)",
    stats: "Andhra Pradesh HQ • 100% IP Guarantee • Dedicated Pods",
    targetAudience: "Prospective enterprise clients, partners, and engineering candidates",
    summary:
      "GK Nexergy is an enterprise engineering and talent acceleration hub dedicated to designing and building reliable software products, custom AI systems, and cloud infrastructure for businesses worldwide.",
    highlights: [
      "Operates under the guiding principle of 'Train. Build. Transform.'",
      "Guarantees 100% intellectual property ownership to clients with zero vendor lock-in.",
      "Employs autonomous delivery pods with lead architects, full-stack devs, and QA specialists.",
      "Direct consultation access with architectural discovery response within 10 minutes.",
    ],
    actionLabel: "Start a Conversation",
    actionRoute: "/contact",
  },
  "/company": {
    title: "About GK Nexergy • Leadership & Philosophy",
    badge: "Company Story",
    readTime: "25 sec summary (vs 3 min read)",
    stats: "Andhra Pradesh HQ • 100% IP Guarantee • Dedicated Pods",
    targetAudience: "Prospective enterprise clients, partners, and engineering candidates",
    summary:
      "GK Nexergy is an enterprise engineering and talent acceleration hub dedicated to designing and building reliable software products, custom AI systems, and cloud infrastructure for businesses worldwide.",
    highlights: [
      "Operates under the guiding principle of 'Train. Build. Transform.'",
      "Guarantees 100% intellectual property ownership to clients with zero vendor lock-in.",
      "Employs autonomous delivery pods with lead architects, full-stack devs, and QA specialists.",
      "Direct consultation access with architectural discovery response within 10 minutes.",
    ],
    actionLabel: "Start a Conversation",
    actionRoute: "/contact",
  },
  "/vision": {
    title: "Strategic Vision & Roadmap • GK Nexergy",
    badge: "Strategic Blueprint",
    readTime: "25 sec summary (vs 3 min read)",
    stats: "Global Reach • Ethical AI • Sustainable Scaling",
    targetAudience: "CTOs, business executives, innovators & tech leaders",
    summary:
      "GK Nexergy's strategic vision centers on democratizing enterprise-grade software engineering, cultivating world-class technology talent locally, and empowering businesses with ethical, transparent AI workflows.",
    highlights: [
      "Uncompromising client autonomy: you own every line of code, design, and schema.",
      "Merging high-level architectural innovation with practical, cost-effective delivery.",
      "Upskilling developers for the next frontier of AI, cybersecurity, and distributed cloud.",
      "Architectures engineered to handle scale seamlessly from day one.",
    ],
    actionLabel: "Why GK Nexergy",
    actionRoute: "/why-gk-nexergy",
  },
  "/why-gk-nexergy": {
    title: "Why Choose GK Nexergy • Core Differentiators",
    badge: "Competitive Advantage",
    readTime: "30 sec summary (vs 3.5 min read)",
    stats: "100% IP Ownership • No Agency Overhead • 30-Day Warranty",
    targetAudience: "Founders, product managers, and enterprise decision-makers",
    summary:
      "Unlike conventional agencies with bloated overhead and vendor lock-in, GK Nexergy delivers autonomous agile pods, direct architect engagement, complete code ownership, and guaranteed warranty support.",
    highlights: [
      "100% IP & Data Ownership: Full transfer of GitHub repos, credentials, and schemas.",
      "Dedicated Autonomous Pods: Cross-functional units delivering sprint-by-sprint velocity.",
      "Integrated Academy Pipeline: Immediate access to trained, specialized developer talent.",
      "Free 30-minute architectural consultation and 10-minute discovery response SLA.",
    ],
    actionLabel: "View Engagement Pricing",
    actionRoute: "/pricing",
  },
  "/pricing": {
    title: "Pricing Plans & Engagement Tiers",
    badge: "Transparent Pricing",
    readTime: "35 sec summary (vs 4 min read)",
    stats: "Starter ($1,499/mo) • Growth ($3,499/mo) • Premium ($6,999/mo)",
    targetAudience: "Early-stage founders, scaling businesses, and enterprise CTOs",
    summary:
      "Predictable, transparent subscription pods and fixed-scope delivery tiers. All plans include 100% client source code ownership, zero vendor lock-in, and full architectural warranty.",
    highlights: [
      "Starter ($1,499/mo or $2,999 MVP): 2–3 week delivery, React/Node stack, AI chatbot, 30-day warranty.",
      "Growth ($3,499/mo or $6,999 Multi-Sprint): 2–3 person pod, Web & Mobile apps, RAG AI, CI/CD, 60-day warranty.",
      "Premium ($6,999/mo or Custom): 4–6+ person pod, Lead Architect, 99.99% SLA, 24/7 priority support, CTO advisory.",
      "Zero hidden fees, weekly sprint demos, and direct Slack/Teams engineer communication.",
    ],
    actionLabel: "Book Discovery Call",
    actionRoute: "/contact",
  },
  "/solutions": {
    title: "Enterprise Solutions & Engineering Capabilities",
    badge: "Solutions Catalog",
    readTime: "30 sec summary (vs 4 min read)",
    stats: "6 Specialized Disciplines • Cloud Native • AI Workflows",
    targetAudience: "Companies seeking reliable software, mobile apps, or digital transformation",
    summary:
      "GK Nexergy delivers end-to-end technology solutions across custom software development, mobile apps, digital transformation, AI & automation, data analytics, and digital growth models.",
    highlights: [
      "Software Engineering: Robust web applications, APIs, and scalable distributed architectures.",
      "Mobile Applications: High-performance iOS and Android apps with native-feel fluid UX.",
      "AI & Automation: Enterprise RAG knowledge engines, automated workflows, and predictive analytics.",
      "Digital Transformation: Legacy system migration, cloud roadmapping, and operational digitisation.",
    ],
    actionLabel: "Explore Software Development",
    actionRoute: "/solutions/software-development",
  },
  "/academy": {
    title: "Nexergy Academy • Practical Tech Acceleration",
    badge: "Talent Ecosystem",
    readTime: "30 sec summary (vs 3.5 min read)",
    stats: "4 Specializations • 100% Hands-On Labs • Placement Support",
    targetAudience: "Students, engineering graduates, career transitioners & developers",
    summary:
      "Nexergy Academy bridges the gap between collegiate education and actual industry production standards through intensive, mentor-led programs in Cybersecurity, PostgreSQL, Cloud/Python, and AI Marketing.",
    highlights: [
      "100% project-based learning focused on production tools, Git workflows, and live labs.",
      "Specialist tracks in Cyber Security & Ethical Hacking and PostgreSQL Database Mastery.",
      "Direct talent integration into live GK Nexergy enterprise engineering projects.",
      "Dedicated career coaching, resume workshops, and interview preparation.",
    ],
    actionLabel: "Browse All Courses",
    actionRoute: "/academy/courses",
  },
  "/academy/courses": {
    title: "Academy Course Catalog & Curriculums",
    badge: "Course Directory",
    readTime: "25 sec summary (vs 3 min read)",
    stats: "Cyber Security • PostgreSQL • Foundation Program • AI Marketing",
    targetAudience: "Aspiring developers, ethical hackers, and database engineers",
    summary:
      "Browse Nexergy Academy's flagship technical curriculums designed to give you industry-grade skills and a competitive edge in modern tech hiring.",
    highlights: [
      "Cyber Security & Ethical Hacking: Network defense, vulnerability analysis, and pen testing.",
      "PostgreSQL Mastery: Schema design, query optimization, indexing, and high availability.",
      "Foundation Program: Python programming, cloud fundamentals, and clean code architecture.",
      "AI & Digital Marketing: Automated growth engines, AI-assisted content, and analytics.",
    ],
    actionLabel: "Explore Cyber Security Track",
    actionRoute: "/academy/cyber-security",
  },
  "/projects": {
    title: "Delivered Client Projects & Case Studies",
    badge: "Portfolio & Impact",
    readTime: "30 sec summary (vs 3.5 min read)",
    stats: "Production Web Apps • Mobile Platforms • AI Workflows",
    targetAudience: "Enterprises assessing technical capability and delivery reliability",
    summary:
      "Detailed architectural case studies highlighting how GK Nexergy designed, built, and deployed robust solutions across healthcare, fintech, supply chain, and digital commerce.",
    highlights: [
      "Proven track record of on-time, on-budget delivery with zero vendor lock-in.",
      "Measurable business outcomes: reduced page latency, streamlined workflows, and revenue growth.",
      "Production cloud deployments across AWS, Google Cloud, and modern serverless platforms.",
      "Architecture case breakdowns detailing tech stacks, challenges, and solutions.",
    ],
    actionLabel: "Discuss Your Project Scope",
    actionRoute: "/contact",
  },
  "/careers": {
    title: "Careers at GK Nexergy • Build the Future With Us",
    badge: "Open Opportunities",
    readTime: "25 sec summary (vs 3 min read)",
    stats: "Agile Pods • Fast-Track Growth • Remote / Hybrid",
    targetAudience: "Software engineers, mobile devs, designers, and AI specialists",
    summary:
      "Join autonomous engineering pods working on challenging enterprise software, modern mobile apps, and cutting-edge AI systems in an empowering, merit-based culture.",
    highlights: [
      "Work in focused, collaborative squads where every engineer influences technical decisions.",
      "Culture emphasizing clean code, continuous learning, and architectural excellence.",
      "Clear advancement tracks with competitive compensation and skill mentorship.",
      "Opportunities across full-stack engineering, React, Node.js, Python, and cloud DevOps.",
    ],
    actionLabel: "Explore Open Roles & Apply",
    actionRoute: "/contact",
  },
  "/industries": {
    title: "Industries Served • Specialized Solutions",
    badge: "Industry Focus",
    readTime: "25 sec summary (vs 3 min read)",
    stats: "Fintech • Healthcare • Logistics • E-Commerce • EdTech",
    targetAudience: "Industry leaders requiring compliant, scalable tech architectures",
    summary:
      "Custom software engineering and digital transformation roadmaps tailored specifically to the regulatory, latency, and operational requirements of diverse industries.",
    highlights: [
      "Healthcare: HIPAA-compliant data pipelines, patient portals, and telehealth tools.",
      "Fintech: High-security payment interfaces, audit trails, and financial dashboards.",
      "Logistics: Real-time asset tracking, automated routing, and warehouse dispatch systems.",
      "Retail & Commerce: Omnichannel shopping, lightning-fast search, and automated inventory.",
    ],
    actionLabel: "Schedule Industry Consultation",
    actionRoute: "/contact",
  },
  "/contact": {
    title: "Contact GK Nexergy • Connect With Our Engineers",
    badge: "Direct Contact",
    readTime: "20 sec summary (vs 2 min read)",
    stats: "10-Min Response SLA • Phone +91 9704585960 • Andhra Pradesh, India",
    targetAudience: "Clients, prospective students, partners, and enterprise inquiries",
    summary:
      "Get in touch directly with GK Nexergy's lead architects and team for project discovery, pricing inquiries, academy admissions, or general assistance.",
    highlights: [
      "Direct phone & WhatsApp: +91 9704585960 | Email: contact@gknexergy.com.",
      "Headquarters: Andhra Pradesh, India — serving clients globally.",
      "Discovery consultation response within 10 minutes during business hours.",
      "Free initial 30-minute architectural and project feasibility advisory session.",
    ],
    actionLabel: "Chat on WhatsApp",
    actionRoute: "https://wa.me/919704585960",
    isExternal: true,
  },
};

export const PageSummarizer = ({
  theme = "light",
  isOpen: controlledIsOpen,
  onClose,
  onOpen,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const setIsOpen = useCallback(
    (val) => {
      const nextVal = typeof val === "function" ? val(isOpen) : val;
      if (isControlled) {
        if (nextVal) {
          onOpen?.();
        } else {
          onClose?.();
        }
      } else {
        setInternalIsOpen(nextVal);
      }
    },
    [isControlled, isOpen, onOpen, onClose]
  );

  const [copied, setCopied] = useState(false);
  const isDark = theme === "dark";

  // Real-time language synchronization
  const [currentLang, setCurrentLang] = useState(() => getCurrentLanguage());
  const [translatedData, setTranslatedData] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    const handleLangChange = (e) => {
      const code = e?.detail || getCurrentLanguage();
      setCurrentLang(code);
    };
    window.addEventListener("gk-language-changed", handleLangChange);
    window.addEventListener("storage", handleLangChange);
    return () => {
      window.removeEventListener("gk-language-changed", handleLangChange);
      window.removeEventListener("storage", handleLangChange);
    };
  }, []);

  // Update language whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentLang(getCurrentLanguage());
    }
  }, [isOpen]);

  // Derive dynamic summary based on route, solutions slug, or courses slug
  const pageData = useMemo(() => {
    const path = location.pathname.toLowerCase().replace(/\/$/, "") || "/";

    // 1. Check exact route match
    if (ROUTE_SUMMARIES[path]) {
      return ROUTE_SUMMARIES[path];
    }

    // 2. Check Solution Detail: /solutions/:slug
    if (path.startsWith("/solutions/")) {
      const slug = path.replace("/solutions/", "");
      const solution = SOLUTIONS.find((s) => s.slug === slug);
      if (solution) {
        return {
          title: `${solution.title} • GK Nexergy Enterprise Solution`,
          badge: "Enterprise Practice",
          readTime: "30 sec summary",
          stats: `Workflow: ${solution.flow?.join(" → ") || "Discover → Deliver"}`,
          targetAudience: "Enterprises seeking scalable, custom digital capabilities",
          summary: solution.description || solution.tagline,
          highlights: solution.features || [
            "Custom-engineered architecture built around your business workflow.",
            "100% intellectual property and source code ownership.",
            "Autonomous agile pod delivery with sprint-based milestones.",
            "Enterprise-grade reliability and security standards.",
          ],
          actionLabel: solution.cta || "Inquire About This Solution",
          actionRoute: "/contact",
        };
      }
    }

    // 3. Check Course Detail: /academy/:slug
    if (path.startsWith("/academy/")) {
      const slug = path.replace("/academy/", "");
      const course = COURSES.find((c) => c.slug === slug);
      if (course) {
        return {
          title: `${course.title} • ${course.subtitle || "Nexergy Academy"}`,
          badge: "Specialized Academy Track",
          readTime: "30 sec summary",
          stats: `Category: ${course.category || "Technology"} • 100% Practical Labs`,
          targetAudience: "Aspiring developers, career shifters & professionals",
          summary: course.description || course.tagline,
          highlights: course.topics?.slice(0, 5) || [
            "Intensive hands-on labs with real-world attack and defense surfaces.",
            "Direct mentorship from senior engineering practitioners.",
            "Production tools and portfolio-grade project building.",
            "Career placement guidance and interview readiness.",
          ],
          actionLabel: "Inquire / Enroll in Course",
          actionRoute: "/contact",
        };
      }
    }

    // 4. Fallback DOM extraction
    const heading = document.querySelector("h1")?.innerText || "GK Nexergy";
    const subtext = document.querySelector("p")?.innerText || "";
    return {
      title: `${heading} • GK Nexergy`,
      badge: "Page Overview",
      readTime: "20 sec summary",
      stats: "Enterprise Engineering & Talent Acceleration",
      targetAudience: "Businesses, innovators & tech professionals",
      summary: subtext || "Explore GK Nexergy's digital solutions, architectural capabilities, and academy courses.",
      highlights: [
        "100% Client Intellectual Property & code ownership.",
        "Autonomous agile delivery pods with direct architect access.",
        "Industry-aligned technology stack built for scale.",
        "Fast 10-minute discovery response SLA.",
      ],
      actionLabel: "Connect With Our Team",
      actionRoute: "/contact",
    };
  }, [location.pathname]);

  // Compute translated data whenever language, route, or pageData changes
  useEffect(() => {
    if (!pageData) return;
    const path = location.pathname.toLowerCase().replace(/\/$/, "") || "/";
    const cleanLang = (currentLang || "en").split("-")[0];

    if (cleanLang === "en") {
      setTranslatedData(null);
      return;
    }

    // 1. Check curated high-fidelity multilingual summaries
    if (MULTILINGUAL_SUMMARIES[cleanLang]?.[path]) {
      setTranslatedData({
        ...pageData,
        ...MULTILINGUAL_SUMMARIES[cleanLang][path],
        lang: cleanLang,
      });
      return;
    }

    // 2. Dynamic translation via translateText
    let isCancelled = false;
    setIsTranslating(true);

    Promise.all([
      translateText(pageData.title, cleanLang, "en"),
      translateText(pageData.summary, cleanLang, "en"),
      Promise.all(
        (pageData.highlights || []).map((h) => translateText(h, cleanLang, "en"))
      ),
      translateText(pageData.badge || "Overview", cleanLang, "en"),
    ])
      .then(([tTitle, tSummary, tHighlights, tBadge]) => {
        if (!isCancelled) {
          setTranslatedData({
            ...pageData,
            title: tTitle.translatedText || pageData.title,
            summary: tSummary.translatedText || pageData.summary,
            highlights: tHighlights.map((th, i) => th.translatedText || pageData.highlights[i]),
            badge: tBadge.translatedText || pageData.badge,
            lang: cleanLang,
          });
          setIsTranslating(false);
        }
      })
      .catch((err) => {
        console.warn("Summarizer auto-translation error:", err);
        if (!isCancelled) setIsTranslating(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [location.pathname, pageData, currentLang]);

  const displayData = (currentLang !== "en" && translatedData) ? translatedData : pageData;

  const currentLangObj = useMemo(() => {
    const clean = (currentLang || "en").split("-")[0];
    return SUPPORTED_LANGUAGES.find((l) => l.code === currentLang || l.code === clean) || SUPPORTED_LANGUAGES[0];
  }, [currentLang]);

  // Listen for global custom trigger event (e.g. from Navbar)
  useEffect(() => {
    const handleTrigger = () => {
      setIsOpen(true);
    };
    window.addEventListener("open-page-summarizer", handleTrigger);
    return () => window.removeEventListener("open-page-summarizer", handleTrigger);
  }, []);

  // Keyboard shortcut: Alt + S to toggle Page Summarizer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && (e.key === "s" || e.key === "S")) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Copy summary to clipboard
  const handleCopySummary = useCallback(() => {
    if (!displayData) return;
    const textToCopy = `📌 ${displayData.title}
Badge: ${displayData.badge}
Stats: ${displayData.stats}

⚡ Executive Summary:
${displayData.summary}

🔑 Key Takeaways:
${displayData.highlights?.map((h) => `• ${h}`).join("\n")}

🌐 Read more at GK Nexergy: ${window.location.href}`;

    navigator.clipboard?.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }, [displayData]);

  // Ask AI Assistant about this page
  const handleAskAI = useCallback(() => {
    setIsOpen(false);
    // Dispatch global event to open AI Chatbot
    window.dispatchEvent(new CustomEvent("open-gk-chatbot"));
  }, []);

  const fontStack = "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

  return (
    <div style={{ fontFamily: fontStack }}>
      {/* ========================================================= */}
      {/* AI PAGE SUMMARIZER MODAL (Triggered via Navbar / Alt+S)   */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Ambient Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: isDark ? "rgba(3, 7, 18, 0.7)" : "rgba(15, 23, 42, 0.4)",
                backdropFilter: "blur(5px)",
                zIndex: 99999988,
              }}
            />

            {/* Summarizer Center Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, x: "-50%", y: "-47%" }}
              animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
              exit={{ opacity: 0, scale: 0.94, x: "-50%", y: "-47%" }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              data-testid="page-summarizer-modal"
              role="dialog"
              aria-label="GK Nexergy AI Page Summary"
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                zIndex: 99999989,
                width: "min(520px, calc(100vw - 32px))",
                maxHeight: "min(720px, calc(100vh - 60px))",
                borderRadius: "20px",
                backgroundColor: isDark ? "#090e18" : "#ffffff",
                border: isDark ? "1px solid rgba(255, 255, 255, 0.12)" : "1px solid #e2e8f0",
                boxShadow: isDark
                  ? "0 25px 70px -10px rgba(0, 0, 0, 0.9), 0 0 1px 1px rgba(255, 255, 255, 0.08)"
                  : "0 25px 60px -12px rgba(15, 23, 42, 0.25), 0 0 1px 1px rgba(0, 0, 0, 0.05)",
                color: isDark ? "#f8fafc" : "#0f172a",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                fontFamily: fontStack,
              }}
            >
              {/* --- HEADER --- */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 18px",
                  borderBottom: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #f1f5f9",
                  backgroundColor: isDark ? "#0c1322" : "#f8fafc",
                }}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "10px",
                      backgroundColor: isDark ? "#1e293b" : "#e0f2fe",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <BookOpen
                      style={{
                        width: "16px",
                        height: "16px",
                        color: isDark ? "#38bdf8" : "#0284c7",
                      }}
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        style={{
                          fontSize: "13.5px",
                          fontWeight: 700,
                          letterSpacing: "-0.01em",
                        }}
                      >
                        AI Page Summary
                      </span>
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 700,
                          padding: "2px 6px",
                          borderRadius: "6px",
                          backgroundColor: isDark ? "rgba(56, 189, 248, 0.15)" : "#e0f2fe",
                          color: isDark ? "#38bdf8" : "#0284c7",
                        }}
                      >
                        {displayData.badge}
                      </span>
                      {currentLang !== "en" && (
                        <span
                          style={{
                            fontSize: "10px",
                            fontWeight: 700,
                            padding: "2px 6px",
                            borderRadius: "6px",
                            backgroundColor: isDark ? "rgba(37, 99, 235, 0.25)" : "#dbeafe",
                            color: isDark ? "#60a5fa" : "#2563eb",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "3px",
                          }}
                        >
                          {currentLangObj?.flag} {currentLangObj?.native}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] opacity-60">
                      <Clock style={{ width: "11px", height: "11px" }} />
                      <span>{displayData.readTime}</span>
                    </div>
                  </div>
                </div>

                {/* Header Action Icons */}
                <div className="flex items-center gap-1 shrink-0">
                  {/* Copy Button */}
                  <button
                    data-testid="summarizer-copy-btn"
                    onClick={handleCopySummary}
                    title={copied ? "Summary Copied!" : "Copy Summary Text"}
                    aria-label="Copy Summary"
                    className="p-1.5 rounded-lg transition-colors cursor-pointer"
                    style={{
                      color: copied ? "#10b981" : isDark ? "#94a3b8" : "#64748b",
                    }}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>

                  {/* Close Button */}
                  <button
                    data-testid="summarizer-close-btn"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close Summary Modal"
                    className="p-1.5 rounded-lg transition-colors cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800"
                    style={{
                      color: isDark ? "#94a3b8" : "#64748b",
                    }}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* --- SCROLLABLE BODY --- */}
              <div
                style={{
                  padding: "16px 18px",
                  overflowY: "auto",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                {/* Stats Bar */}
                {displayData.stats && (
                  <div
                    style={{
                      padding: "8px 12px",
                      borderRadius: "10px",
                      backgroundColor: isDark ? "rgba(15, 23, 42, 0.7)" : "#f1f5f9",
                      border: isDark ? "1px solid rgba(255, 255, 255, 0.06)" : "1px solid #e2e8f0",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: isDark ? "#93c5fd" : "#0369a1",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <Compass style={{ width: "13px", height: "13px", flexShrink: 0 }} />
                    <span className="truncate">{displayData.stats}</span>
                  </div>
                )}

                {/* Page Title */}
                <div>
                  <h3
                    style={{
                      fontSize: "15px",
                      fontWeight: 800,
                      letterSpacing: "-0.01em",
                      lineHeight: "1.3",
                    }}
                  >
                    {displayData.title}
                  </h3>
                </div>

                {/* Executive Summary Block */}
                <div
                  style={{
                    padding: "12px 14px",
                    borderRadius: "12px",
                    backgroundColor: isDark ? "rgba(56, 189, 248, 0.08)" : "#f0f9ff",
                    border: isDark ? "1px solid rgba(56, 189, 248, 0.2)" : "1px solid #bae6fd",
                  }}
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Lightbulb style={{ width: "13px", height: "13px", color: isDark ? "#38bdf8" : "#0284c7" }} />
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        color: isDark ? "#38bdf8" : "#0284c7",
                      }}
                    >
                      Executive Summary
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: "12.5px",
                      lineHeight: "1.5",
                      color: isDark ? "#e2e8f0" : "#334155",
                    }}
                  >
                    {displayData.summary}
                  </p>
                </div>

                {/* Key Takeaways & Highlights */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <CheckCircle2 style={{ width: "13px", height: "13px", color: "#10b981" }} />
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        color: isDark ? "#94a3b8" : "#64748b",
                      }}
                    >
                      Key Takeaways
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {displayData.highlights?.map((point, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2"
                        style={{
                          fontSize: "12px",
                          lineHeight: "1.45",
                          color: isDark ? "#cbd5e1" : "#475569",
                        }}
                      >
                        <span
                          style={{
                            width: "5px",
                            height: "5px",
                            borderRadius: "50%",
                            backgroundColor: isDark ? "#38bdf8" : "#0284c7",
                            marginTop: "6px",
                            flexShrink: 0,
                          }}
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Target Audience Note */}
                {displayData.targetAudience && (
                  <div
                    style={{
                      fontSize: "11.5px",
                      color: isDark ? "#94a3b8" : "#64748b",
                      borderTop: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #f1f5f9",
                      paddingTop: "10px",
                    }}
                  >
                    <strong style={{ color: isDark ? "#f8fafc" : "#0f172a" }}>Who this is for: </strong>
                    {displayData.targetAudience}
                  </div>
                )}
              </div>

              {/* --- FOOTER ACTION BAR --- */}
              <div
                style={{
                  padding: "12px 18px",
                  borderTop: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #f1f5f9",
                  backgroundColor: isDark ? "#0c1322" : "#f8fafc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "10px",
                }}
              >
                {/* Ask AI Assistant Button */}
                <button
                  data-testid="summarizer-ask-ai-btn"
                  onClick={handleAskAI}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer hover:scale-105 active:scale-95"
                  style={{
                    backgroundColor: isDark ? "rgba(56, 189, 248, 0.12)" : "#e0f2fe",
                    color: isDark ? "#38bdf8" : "#0284c7",
                    border: isDark ? "1px solid rgba(56, 189, 248, 0.25)" : "1px solid #bae6fd",
                  }}
                >
                  <Bot className="h-3.5 w-3.5" />
                  <span>Ask AI More</span>
                </button>

                {/* Primary Page Action Button */}
                {displayData.actionRoute && (
                  displayData.isExternal ? (
                    <a
                      href={displayData.actionRoute}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white transition-all cursor-pointer hover:scale-105 active:scale-95"
                      style={{
                        background: "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)",
                        boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
                      }}
                    >
                      <span>{displayData.actionLabel}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        navigate(displayData.actionRoute);
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white transition-all cursor-pointer hover:scale-105 active:scale-95"
                      style={{
                        background: "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)",
                        boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
                      }}
                    >
                      <span>{displayData.actionLabel}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  )
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PageSummarizer;
