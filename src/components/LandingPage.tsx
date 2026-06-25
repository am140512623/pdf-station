import {
  Layers, Zap, Plus, SplitSquareHorizontal, LayoutGrid, PenTool,
  Wand2, FileSignature, ArrowRight, ShieldCheck, Gift, MousePointerClick,
} from 'lucide-react';
import type { Tab } from '../App';

interface LandingPageProps {
  onLaunch: (tab: Tab) => void;
}

interface ToolCard {
  id: Tab;
  title: string;
  description: string;
  Icon: typeof Zap;
  iconWrap: string; // full literal Tailwind classes so they're not purged
  comingSoon?: boolean;
}

const TOOLS: ToolCard[] = [
  { id: 'convert', title: 'Convert & Merge', description: 'Turn Word, Excel, and text files into PDF and combine them into one.', Icon: Zap, iconWrap: 'bg-indigo-100 text-indigo-600' },
  { id: 'merge', title: 'Merge PDFs', description: 'Combine multiple PDF files into a single document, in any order.', Icon: Plus, iconWrap: 'bg-blue-100 text-blue-600' },
  { id: 'split', title: 'Split / Extract', description: 'Pull out the exact pages you need into a brand-new PDF.', Icon: SplitSquareHorizontal, iconWrap: 'bg-orange-100 text-orange-600' },
  { id: 'edit', title: 'Organize Pages', description: 'Reorder, rotate, and delete pages with a simple visual grid.', Icon: LayoutGrid, iconWrap: 'bg-purple-100 text-purple-600' },
  { id: 'annotate', title: 'Text & Watermarks', description: 'Stamp custom text or watermarks onto any page you choose.', Icon: PenTool, iconWrap: 'bg-emerald-100 text-emerald-600' },
  { id: 'smart-edit', title: 'Smart Edit', description: 'Detect existing text and rewrite it in place.', Icon: Wand2, iconWrap: 'bg-rose-100 text-rose-600', comingSoon: true },
  { id: 'sign', title: 'Sign PDF', description: 'Draw or type a signature and drop it anywhere on the page.', Icon: FileSignature, iconWrap: 'bg-indigo-100 text-indigo-600' },
  { id: 'compress', title: 'Compress PDF', description: 'Shrink file size for email and uploads while keeping it readable.', Icon: Zap, iconWrap: 'bg-cyan-100 text-cyan-600' },
];

const PERKS = [
  { Icon: ShieldCheck, title: 'Private by design', text: 'Most tools run entirely in your browser — your files never get uploaded to a server.' },
  { Icon: Gift, title: 'Completely free', text: 'Every tool, no paywalls, no watermarks, no sign-up. Just open it and go.' },
  { Icon: MousePointerClick, title: 'Nothing to install', text: 'Works in any modern browser on any device. No apps, no extensions, no accounts.' },
];

export function LandingPage({ onLaunch }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col">
      {/* Header */}
      <header className="w-full px-6 md:px-12 py-5 flex items-center justify-between max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <Layers className="w-6 h-6 text-blue-600" />
          <span className="text-xl font-bold tracking-tight">PDF Station</span>
        </div>
        <button
          onClick={() => onLaunch('convert')}
          className="text-sm font-semibold px-4 py-2 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors"
        >
          Open the tools
        </button>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-neutral-50 to-neutral-50 pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-6 md:px-12 pt-12 md:pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-neutral-200 text-xs font-medium text-neutral-600 shadow-sm mb-6">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Your files stay on your device
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-neutral-900 max-w-3xl mx-auto leading-[1.1]">
            Every PDF tool you need, <span className="text-blue-600">free</span> and in your browser.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-neutral-500 max-w-2xl mx-auto">
            Merge, split, compress, sign, and edit PDFs in seconds. No sign-up, no installs,
            and most tools never upload your files anywhere.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onLaunch('convert')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold bg-blue-600 text-white shadow-sm shadow-blue-200 hover:bg-blue-700 hover:shadow-md transition-all active:scale-95"
            >
              Open the tools
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => onLaunch('merge')}
              className="px-6 py-3.5 rounded-xl font-semibold bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50 transition-colors"
            >
              Merge PDFs now
            </button>
          </div>
          <p className="mt-4 text-sm text-neutral-400">100% free · No account required</p>
        </div>
      </section>

      {/* Tool grid */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 pb-16 w-full">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Pick a tool to get started</h2>
          <p className="text-neutral-500 mt-2">Eight tools, one place. Click any card to jump straight in.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TOOLS.map(({ id, title, description, Icon, iconWrap, comingSoon }) => (
            <button
              key={id}
              onClick={() => onLaunch(id)}
              className="group text-left bg-white border border-neutral-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-md transition-all active:scale-[0.98]"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconWrap} mb-4`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-neutral-900 flex items-center gap-1">
                {title}
                {comingSoon ? (
                  <span className="ml-1 text-[10px] font-bold uppercase tracking-wide text-rose-600 bg-rose-100 px-1.5 py-0.5 rounded">Soon</span>
                ) : (
                  <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                )}
              </h3>
              <p className="text-sm text-neutral-500 mt-1.5 leading-relaxed">{description}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Perks */}
      <section className="bg-white border-y border-neutral-200">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {PERKS.map(({ Icon, title, text }) => (
            <div key={title} className="flex flex-col items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg text-neutral-900">{title}</h3>
              <p className="text-neutral-500 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA strip */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-16 w-full text-center">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Ready to fix that PDF?</h2>
        <p className="text-neutral-500 mt-2 mb-6">No upload, no wait. It just works.</p>
        <button
          onClick={() => onLaunch('convert')}
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold bg-blue-600 text-white shadow-sm shadow-blue-200 hover:bg-blue-700 hover:shadow-md transition-all active:scale-95"
        >
          Open the tools
          <ArrowRight className="w-5 h-5" />
        </button>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-neutral-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-neutral-500">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-neutral-700">PDF Station</span>
          </div>
          <p>© {new Date().getFullYear()} PDF Station · Free PDF tools in your browser</p>
        </div>
      </footer>
    </div>
  );
}
