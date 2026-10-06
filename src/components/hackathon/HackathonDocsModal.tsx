import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, GitFork, GitPullRequest, GitBranch, CheckCircle2, BookOpen, Layers, Terminal } from 'lucide-react';

export const HackathonDocsModal: React.FC = () => {
  const { isDocsModalOpen, setIsDocsModalOpen } = useApp();

  if (!isDocsModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-600 flex items-center justify-center text-white">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">FOODORA · UI Template & Engineering Spec</h3>
              <p className="text-xs text-slate-400">
                UI Template Collection Hackathon & Team Collaboration Documentation
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsDocsModalOpen(false)}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Documentation Content */}
        <div className="p-6 overflow-y-auto space-y-8 text-xs sm:text-sm text-slate-700">
          {/* 1. Research Requirement */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-orange-600 font-bold uppercase tracking-wider text-xs">
              <Layers className="w-4 h-4" />
              <span>1. UI Pattern Research & Analysis</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div>
                <strong className="text-slate-900 block">1. What the UI Pattern Is:</strong>
                <p className="text-slate-600 mt-0.5">
                  High-Density Food Discovery, Dynamic Cart Checkout, and Live Order Tracking pattern tailored for instant local commerce.
                </p>
              </div>

              <div>
                <strong className="text-slate-900 block">2. Where It Is Commonly Used:</strong>
                <p className="text-slate-600 mt-0.5">
                  Modern food delivery and grocery platforms across South Asia and global markets (e.g. Zomato, Swiggy, DoorDash, Deliveroo).
                </p>
              </div>

              <div>
                <strong className="text-slate-900 block">3. Why It Is Relevant to Modern Web Interfaces:</strong>
                <p className="text-slate-600 mt-0.5">
                  Users demand frictionless location switching, instant search without page reloads, visual dish customization (spice levels, add-ons), dynamic bill calculation without hardcoded estimates, and real-time fulfillment observability.
                </p>
              </div>

              <div>
                <strong className="text-slate-900 block">4. Observed Design & Interaction Patterns:</strong>
                <p className="text-slate-600 mt-0.5">
                  Prominent city/area location switcher in header; horizontal cuisine pills with fast scrolling; floating bottom navigation on mobile; stepper checkout (Address → Delivery Speed → Payment); and live progress timelines with rider contact affordances.
                </p>
              </div>

              <div>
                <strong className="text-slate-900 block">5. What FOODORA Does Differently:</strong>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-slate-600">
                  <li><strong>Anti-AI Slop & Zero-Pill Discipline:</strong> Replaced static pill badge clutter with clean unboxed typographic separators.</li>
                  <li><strong>Warm Spice Color System:</strong> Distinctive saffron/amber (#EA580C) with slate contrasts rather than copycat red or neon branding.</li>
                  <li><strong>Live simulated status stepper:</strong> Interactive progression through order statuses with automated calculation.</li>
                  <li><strong>Full-Stack Architecture:</strong> Integrated REST API with Express and PostgreSQL-ready schemas.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 2. GitHub Team Collaboration Workflow */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase tracking-wider text-xs">
              <GitFork className="w-4 h-4" />
              <span>2. Required GitHub Collaboration Workflow</span>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200 text-xs text-indigo-950 font-mono space-y-2">
              <div className="flex items-center gap-2 font-bold text-indigo-900">
                <span>Fork</span> → <span>Clone</span> → <span>Branch</span> → <span>Develop</span> → <span>Commit</span> → <span>Push</span> → <span>Pull Request</span> → <span>Review</span> → <span>Merge</span>
              </div>
              <p className="text-indigo-800 font-sans">
                Each team member works on an isolated feature branch (e.g. <code>feature/restaurant-discovery</code>, <code>feature/order-tracking</code>, <code>feature/express-rest-api</code>), ensures TypeScript passes, and merges strictly via peer-reviewed Pull Requests.
              </p>
            </div>
          </section>

          {/* 3. Tech Stack & Execution Commands */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-600 font-bold uppercase tracking-wider text-xs">
              <Terminal className="w-4 h-4" />
              <span>3. Running Locally & Testing</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 font-mono text-xs space-y-2">
              <div className="text-slate-400"># 1. Install dependencies</div>
              <div className="text-emerald-400">npm install</div>
              <div className="text-slate-400"># 2. Start Full-Stack dev server (Express + Vite)</div>
              <div className="text-emerald-400">npm run dev</div>
              <div className="text-slate-400"># 3. Build for production</div>
              <div className="text-emerald-400">npm run build</div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={() => setIsDocsModalOpen(false)}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
