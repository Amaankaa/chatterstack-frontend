import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GithubIcon,
  Zap,
  Copy,
  Check,
  Globe,
  Shield,
  Send,
  MessageCircle, 
  FileType,
  Layout,
  Activity,
  LogIn,
  Quote,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const FEATURES = [
  {
    title: 'Redis Pub/Sub Fan-out',
    desc: 'Scales horizontally. Messages broadcast across distributed ECS tasks instantly.',
    icon: <Zap className="w-6 h-6 text-yellow-400" />,
    gradient: 'from-yellow-500/20 to-orange-500/20',
  },
  {
    title: 'Live Typing & Presence',
    desc: 'Real-time typing indicators and user status updates via WebSocket events.',
    icon: <Activity className="w-6 h-6 text-blue-400" />,
    gradient: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    title: 'Production Architecture',
    desc: 'CloudFront → ALB → ECS Fargate + RDS Postgres. Clean Architecture pattern.',
    icon: <Globe className="w-6 h-6 text-emerald-400" />,
    gradient: 'from-emerald-500/20 to-green-500/20',
  },
  {
    title: 'Secure Edge Auth',
    desc: 'Dual-strategy auth: JWT for REST, Token-over-Query for WebSockets.',
    icon: <Shield className="w-6 h-6 text-red-400" />,
    gradient: 'from-red-500/20 to-pink-500/20',
  },
  {
    title: 'Message Lifecycle',
    desc: 'Support for editing and deleting messages with real-time propagation.',
    icon: <Layout className="w-6 h-6 text-purple-400" />,
    gradient: 'from-purple-500/20 to-violet-500/20',
  },
  {
    title: 'Type-Safe Frontend',
    desc: 'React 18 + TypeScript + Tailwind. Fully typed request/response cycles.',
    icon: <FileType className="w-6 h-6 text-slate-400" />,
    gradient: 'from-slate-500/20 to-gray-500/20',
  },
];
 
const CODE_TABS = [
  {
    id: 'curl',
    label: 'Login (curl)',
    lang: 'bash',
    code: [
      "curl -s https://api.chatterstack.com/v1/auth/login \\",
      "  -H 'Content-Type: application/json' \\",
      "  -d '{\"email\":\"user@example.com\",\"password\":\"supersecret\"}'",
      '# → { "access_token": "<jwt>", "refresh_token": "<jwt>" }',
    ].join('\n'),
  },
  {
    id: 'fetch',
    label: 'Fetch (TS)',
    lang: 'typescript',
    code: [
      "const API_BASE = 'https://api.chatterstack.com/v1';",
      '',
      'async function getUserByEmail(email: string, accessToken: string) {',
      "  const res = await fetch(`${API_BASE}/users?email=${encodeURIComponent(email)}`, {",
      "    headers: {",
      "      'Content-Type': 'application/json',",
      "      'X-Auth-Token': accessToken,",
      '    },',
      '  });',
      "  if (!res.ok) throw new Error(`HTTP ${res.status}`);",
      '  return res.json();',
      '}',
    ].join('\n'),
  },
  {
    id: 'ws',
    label: 'WebSocket',
    lang: 'typescript',
    code: [
      "const WS_URL = 'wss://api.chatterstack.com/ws';",
      '',
      'function connectWS(accessToken: string, roomIds: string[]) {',
      '  const qs = new URLSearchParams();',
      "  roomIds.forEach((id) => qs.append('room_id', id));",
      "  qs.set('access_token', accessToken);",
      '',
      '  const ws = new WebSocket(`${WS_URL}?${qs.toString()}`);',
      "  ws.onopen = () => console.log('WS connected');",
      '  ws.onmessage = (event) => console.log(JSON.parse(event.data));',
      '  return ws;',
      '}',
    ].join('\n'),
  },
];

const URLS = {
  register: '/register',
  login: '/login',
  repo: 'https://github.com/AmanuelMerara/ChatterStack',
  docs: 'https://github.com/AmanuelMerara/ChatterStack/blob/main/API_documentation.md',
} as const;

const SECTION_IDS = ['hero', 'features', 'code', 'testimonials', 'stack', 'cta'] as const;
type SectionId = (typeof SECTION_IDS)[number];

const TECH_STACK = [
  {
    name: 'React 18',
    icon: '⚛️',
    border: 'border-sky-500/30',
    bg: 'bg-sky-500/5',
    color: 'text-sky-100',
  },
  {
    name: 'TypeScript Strict',
    icon: 'TS',
    border: 'border-blue-500/30',
    bg: 'bg-blue-500/5',
    color: 'text-blue-100',
  },
  {
    name: 'Tailwind CSS',
    icon: '〰️',
    border: 'border-cyan-500/30',
    bg: 'bg-cyan-500/5',
    color: 'text-cyan-100',
  },
  {
    name: 'Go Services',
    icon: 'Go',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/5',
    color: 'text-emerald-100',
  },
  {
    name: 'Redis Pub/Sub',
    icon: 'Ⓡ',
    border: 'border-red-500/30',
    bg: 'bg-red-500/5',
    color: 'text-red-100',
  },
  {
    name: 'Postgres + RDS',
    icon: '🗄️',
    border: 'border-purple-500/30',
    bg: 'bg-purple-500/5',
    color: 'text-purple-100',
  },
  {
    name: 'AWS Edge',
    icon: '☁️',
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/5',
    color: 'text-amber-100',
  },
] as const;

const STACK_CATEGORIES = [
  {
    title: 'Frontend Delivery',
    accent: 'from-sky-500/20 to-cyan-500/10',
    border: 'border-sky-500/30',
    items: ['React 18 + Vite', 'TypeScript strict mode', 'Tailwind + Radix UI', 'Framer Motion micro-interactions', 'Form-safe components'],
  },
  {
    title: 'Backend & Realtime',
    accent: 'from-emerald-500/20 to-green-500/10',
    border: 'border-emerald-500/30',
    items: ['Go services on ECS Fargate', 'Redis Pub/Sub fan-out', 'JWT + token-over-query WebSocket auth', 'Postgres (RDS) with SQL migrations', 'Observability hooks ready'],
  },
  {
    title: 'Edge & DevOps',
    accent: 'from-purple-500/20 to-indigo-500/10',
    border: 'border-purple-500/30',
    items: ['CloudFront CDN + WAF-ready', 'ALB → ECS blue/green friendly', 'Dockerized pipelines', 'GitHub Actions CI/CD', 'Runtime secrets via SSM/Env'],
  },
];

const TESTIMONIALS = [
  {
    name: 'Sara Quinn',
    role: 'Head of Product, Lumen',
    quote: 'We shipped a production chat in 10 days instead of 6 weeks. The playbooks and UI saved us sprint after sprint.',
    highlight: '10-day launch',
  },
  {
    name: 'Devin Cole',
    role: 'CTO, FreightFlow',
    quote: 'The Redis fan-out and WebSocket auth patterns were battle-tested. We just plugged in our domain logic.',
    highlight: 'Zero outages in go-live',
  },
  {
    name: 'Priya Natarajan',
    role: 'Engineering Manager, Nova Health',
    quote: 'Design feels premium, and the stack is boring in the best way. Our SRE team loved the clarity.',
    highlight: 'SRE-approved',
  },
];

// --- UI HELPERS ---

const Typewriter = ({ text, delay = 40 }: { text: string; delay?: number }) => {
  const [rendered, setRendered] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setRendered((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [delay, index, text]);

  return <span>{rendered}</span>;
};

const CodeBlock = ({ code, lang }: { code: string; lang: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-xl overflow-hidden bg-[#0F172A] border border-slate-800 shadow-2xl">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-slate-800 backdrop-blur">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500/30" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/30" />
          <div className="w-3 h-3 rounded-full bg-green-500/30" />
        </div>
        <span className="text-xs font-mono text-slate-500 uppercase tracking-wide">{lang}</span>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="font-mono text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
          <code>{code}</code>
        </pre>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        className="absolute top-12 right-3 p-2 rounded-lg bg-slate-800/70 text-slate-300 opacity-0 group-hover:opacity-100 transition-all hover:bg-slate-700 hover:text-white"
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
};

const TechStackStrip = () => (
  <div className="flex flex-wrap gap-3 justify-start opacity-80 pt-6">
    {TECH_STACK.map((tech) => (
      <div 
        key={tech.name} 
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium backdrop-blur-sm transition-transform hover:scale-105 select-none',
          tech.border, 
          tech.bg,
          tech.color
        )}
      >
        <span>{tech.icon}</span>
        {tech.name}
      </div>
    ))}
  </div>
);

const sectionLabels: Record<SectionId, string> = {
  hero: 'Overview',
  features: 'Features',
  code: 'Code',
  testimonials: 'Testimonials',
  stack: 'Tech Stack',
  cta: 'Get Started',
};

const SectionTabs = ({ activeId, onSelect }: { activeId: SectionId; onSelect: (id: SectionId) => void }) => {
  return (
    <div className="sticky top-16 z-40 bg-[#0B1220]/80 backdrop-blur border-b border-white/5">
      <div className="container mx-auto px-4 py-3 flex gap-2 overflow-x-auto">
        {SECTION_IDS.map((id) => (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-all border',
              activeId === id
                ? 'bg-sky-500 text-white border-sky-500 shadow-lg shadow-sky-500/30'
                : 'border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'
            )}
          >
            {sectionLabels[id]}
          </button>
        ))}
      </div>
    </div>
  );
};

// --- VIEWS ---

const LandingView = ({ onReadJourney, setSectionRef }: { onReadJourney: () => void; setSectionRef: (id: SectionId) => (el: HTMLElement | null) => void }) => {
  const [activeTab, setActiveTab] = useState('curl');
  const activeCode = CODE_TABS.find((tab) => tab.id === activeTab) ?? CODE_TABS[0];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative z-10">
      {/* HERO */}
      <section id="hero" ref={setSectionRef('hero')} className="relative pt-32 pb-20">
        <div className="container relative z-10 mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className="mb-6 inline-flex items-center rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-sm font-medium text-sky-400">
                <span className="mr-2 flex h-2 w-2">
                  <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-sky-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500" />
                </span>
                Launch production chat in days
              </div>
              <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-white md:text-7xl">
                Ship premium chat,
                <br />
                <span className="bg-gradient-to-r from-sky-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                  React front, Go back, AWS edge.
                </span>
              </h1>
              <p className="mb-8 text-lg text-slate-300 max-w-xl">
                A production-grade template with real-time presence, bulletproof auth, and cloud architecture already wired. Trade sprints for hours.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <Button asChild size="lg" className="bg-sky-500 hover:bg-sky-600 text-white font-semibold shadow-lg shadow-sky-500/25">
                  <a
                    href={URLS.register}
                    className="inline-flex items-center"
                  >
                    <Zap className="mr-2 h-5 w-5" /> Launch the demo
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-slate-700 bg-slate-900/50 text-slate-300 hover:bg-slate-800 hover:text-white backdrop-blur-sm"
                >
                   <a
                    href={URLS.repo}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center"
                  >
                    <GithubIcon className="mr-2 h-4 w-4" /> GitHub
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  className="border border-transparent text-slate-300 hover:text-white hover:border-slate-700"
                  onClick={onReadJourney}
                >
                  Read the build log
                </Button>
              </div>

              {/* TECH STACK STRIP */}
              <div className="border-t border-slate-800/50 pt-6">
                <p className="text-xs uppercase tracking-widest text-slate-500 mb-3">Powering the stack</p>
                <TechStackStrip />
              </div>

            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-sky-500 to-emerald-500 opacity-20 blur-xl animate-pulse" />
              <div className="relative rounded-2xl border border-slate-800 bg-[#0B1220]/90 backdrop-blur-xl shadow-2xl overflow-hidden">
                <div className="flex items-center gap-2 border-b border-slate-800 px-4 py-3 bg-slate-900/50">
                   <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
                    <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
                   </div>
                  <span className="ml-3 text-xs text-slate-500 font-mono">ws-client.ts</span>
                </div>
                <div className="p-6 font-mono text-sm text-slate-200 space-y-3">
                  <div><span className="text-purple-400">const</span> socket = new WebSocket(<span className="text-emerald-400">'wss://api.chatterstack.com'</span>);</div>
                  <div className="pl-4 text-slate-500">// TypeScript & Tailwind Ready</div>
                  <div>socket.onopen = () =&gt; {'{'} </div>
                  <div className="pl-4">console.log(<span className="text-yellow-300">'Gateway Connected ⚡'</span>);</div>
                  <div className="pl-4">socket.send(JSON.stringify({'{'}</div>
                  <div className="pl-8">event: <span className="text-emerald-400">'typing_start'</span>,</div>
                  <div className="pl-8">
                     content: '<Typewriter text="User is typing..." />'
                  </div>
                  <div className="pl-4">{'}'}));</div>
                  <div>{'}'};</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" ref={setSectionRef('features')} className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="group relative rounded-2xl border border-slate-800 bg-slate-900/20 p-6 hover:bg-slate-800/40 hover:border-slate-700 transition-all backdrop-blur-sm"
              >
                <div
                  className={cn(
                    'absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity',
                    feature.gradient ? `bg-gradient-to-br ${feature.gradient}` : ''
                  )}
                />
                <div className="relative z-10">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-slate-700/50 bg-slate-900/60 shadow-inner">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CODE SHOWCASE */}
      <section id="code" ref={setSectionRef('code')} className="py-24 border-y border-slate-800/30 bg-slate-900/20 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4 space-y-6">
              <h2 className="text-3xl font-bold text-white">
                Code you can
                <br />
                <span className="text-sky-400">copy & ship.</span>
              </h2>
              <p className="text-slate-400">
                Auth headers, CloudFront behavior, WebSocket auth — everything spelled out with copy-ready snippets.
              </p>
              <div className="space-y-2">
                {CODE_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'w-full rounded-xl border px-4 py-4 text-left transition-all',
                      activeTab === tab.id
                        ? 'border-sky-500/50 bg-sky-500/10 text-white shadow-[0_0_20px_-5px_rgba(14,165,233,0.3)]'
                        : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:bg-slate-800/50'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{tab.label}</span>
                      <span className="text-xs font-mono text-slate-500">{tab.lang}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCode.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <CodeBlock code={activeCode.code} lang={activeCode.lang} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

const TestimonialsSection = ({ setSectionRef }: { setSectionRef: (id: SectionId) => (el: HTMLElement | null) => void }) => (
  <section
    id="testimonials"
    ref={setSectionRef('testimonials')}
    className="relative z-10 py-24 border-y border-slate-800/40 bg-slate-900/30 backdrop-blur"
  >
    <div className="container mx-auto px-4">
      <div className="max-w-3xl mb-12">
        <p className="text-xs uppercase tracking-[0.3em] text-sky-400 mb-3">Proof, not promises</p>
        <h2 className="text-4xl font-bold text-white">Teams already shipping with this stack.</h2>
        <p className="text-slate-400 mt-3">Real founders and leads who cared about reliability more than marketing fluff.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((item) => (
          <div key={item.name} className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#0C1424]/80 p-6 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/0 via-slate-900/40 to-slate-900/0" />
            <div className="relative z-10 flex items-start justify-between mb-4">
              <div>
                <p className="text-white font-semibold">{item.name}</p>
                <p className="text-sm text-slate-400">{item.role}</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-200">
                <Star className="w-3 h-3 text-amber-400" /> {item.highlight}
              </span>
            </div>
            <Quote className="w-6 h-6 text-sky-400/70 mb-3" />
            <p className="relative z-10 text-slate-200 leading-relaxed">“{item.quote}”</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const TechStackSection = ({ setSectionRef }: { setSectionRef: (id: SectionId) => (el: HTMLElement | null) => void }) => (
  <section
    id="stack"
    ref={setSectionRef('stack')}
    className="relative z-10 py-24"
  >
    <div className="container mx-auto px-4">
      <div className="max-w-3xl mb-12">
        <p className="text-xs uppercase tracking-[0.3em] text-emerald-400 mb-3">Boring, scalable choices</p>
        <h2 className="text-4xl font-bold text-white">An intentional stack, front to edge.</h2>
        <p className="text-slate-400 mt-3">Everything here is production-friendly, observable, and replaceable. No mystery glue.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {STACK_CATEGORIES.map((group) => (
          <div
            key={group.title}
            className={cn(
              'relative overflow-hidden rounded-2xl border bg-slate-900/60 p-6 shadow-xl',
              group.border,
              `bg-gradient-to-br ${group.accent}`
            )}
          >
            <h3 className="text-xl font-semibold text-white mb-4">{group.title}</h3>
            <ul className="space-y-2 text-slate-200">
              {group.items.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <span className="mt-1 h-2 w-2 rounded-full bg-sky-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const BackgroundEffects = () => (
  <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
    <div className="absolute top-[-10%] left-[-10%] h-[40vh] w-[40vw] bg-sky-500/30 blur-[120px] opacity-60" />
    <div className="absolute top-1/3 right-0 h-[50vh] w-[35vw] bg-emerald-500/20 blur-[140px] opacity-50" />
    <div className="absolute bottom-[-20%] left-1/4 h-[45vh] w-[45vw] bg-purple-500/20 blur-[160px] opacity-40" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.6),transparent_50%)]" />
  </div>
);

// --- MAIN LAYOUT ---

export default function Landing() {
  const year = new Date().getFullYear();
  const [activeSection, setActiveSection] = useState<SectionId>('hero');
  const sectionRefs = useRef<Record<SectionId, HTMLElement | null>>({
    hero: null,
    features: null,
    code: null,
    testimonials: null,
    stack: null,
    cta: null,
  });

  const setSectionRef = (id: SectionId) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
  };

  const scrollToSection = (id: SectionId) => {
    setActiveSection(id);
    const el = sectionRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          const id = visible[0].target.id as SectionId;
          setActiveSection(id);
        }
      },
      { rootMargin: '-20% 0px -40% 0px', threshold: [0.25, 0.5, 0.75] }
    );

    SECTION_IDS.forEach((id) => {
      const node = sectionRefs.current[id];
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#0B1220] text-slate-200 selection:bg-sky-500/30 font-sans">
      <BackgroundEffects />
      
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0B1220]/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('hero')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white fill-current" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">ChatterStack</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => scrollToSection('hero')}
              className={cn("text-sm font-medium transition-colors hover:text-sky-400", activeSection === 'hero' ? 'text-white' : 'text-slate-400')}
            >
              Product
            </button>
            <a href={URLS.docs} target="_blank" rel="noreferrer" className="text-sm font-medium text-slate-400 hover:text-sky-400 transition-colors">
              Docs
            </a>
          </div>

          {/* Auth Actions */}
          <div className="flex items-center gap-3">
             <Button asChild size="sm" variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800 hidden sm:flex">
               <a href={URLS.login}>
                 <LogIn className="w-4 h-4 mr-2" />
                 Sign In
               </a>
             </Button>
             <Button asChild size="sm" className="bg-sky-500 hover:bg-sky-600 text-white font-semibold shadow-lg shadow-sky-500/20">
               <a href={URLS.register}>
                 Get Started
               </a>
             </Button>
          </div>
        </div>
      </nav>

      <SectionTabs activeId={activeSection} onSelect={scrollToSection} />

      <main className="relative">
        <TestimonialsSection setSectionRef={setSectionRef} />
        <TechStackSection setSectionRef={setSectionRef} />

        {/* CTA SECTION */}
        <section id="cta" ref={setSectionRef('cta')} className="relative py-24 z-10">
          <div className="container mx-auto px-4">
            <div className="relative overflow-hidden rounded-3xl border border-slate-700 bg-gradient-to-br from-sky-600/10 via-slate-900 to-emerald-500/10 px-8 py-12 shadow-2xl">
              <div className="absolute -top-32 -right-20 w-72 h-72 bg-sky-500/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl" />
              
              <div className="relative z-10 grid gap-12 lg:grid-cols-2 lg:items-center">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-4">Ready to plug this into your product?</h3>
                  <p className="text-slate-200 mb-6">
                    Spin up the live demo, skim the API docs, or drop me a note. I respond within a day with a path to production.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button asChild size="lg" className="bg-white text-black hover:bg-slate-200">
                      <a href={URLS.register} className="flex items-center justify-center w-full">
                        <Zap className="w-4 h-4 mr-2" /> Launch the demo
                      </a>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="border-slate-700 bg-slate-900/50 text-white hover:bg-slate-800">
                      <a href={URLS.repo} target="_blank" rel="noreferrer" className="flex items-center gap-2">
                        <GithubIcon className="w-4 h-4" /> View the code
                      </a>
                    </Button>
                  </div>
                </div>
                
                <div className="rounded-xl bg-black/40 p-6 border border-white/10">
                  <p className="text-sm text-slate-300 mb-4">Prefer a human intro? Reach out directly.</p>
                  <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <a 
                      href="https://t.me/Amunishan" 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex-1 flex items-center justify-center px-4 py-3 rounded-lg bg-[#229ED9]/15 border border-[#229ED9]/40 text-[#229ED9] hover:bg-[#229ED9]/25 transition-colors"
                    >
                      <Send className="w-4 h-4 mr-2" /> Telegram
                    </a>
                    <a 
                      href="https://wa.me/251939163487" 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex-1 flex items-center justify-center px-4 py-3 rounded-lg bg-[#25D366]/15 border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/25 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp
                    </a>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center justify-between">
                     <span>Response time: &lt; 24h</span>
                     <a href="mailto:contact@amanuel.dev" className="text-sky-400 hover:underline">Email</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-slate-800/60 py-10 bg-[#0B1220]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-6 items-center justify-between md:flex-row">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center">
                <span className="text-[10px] font-bold text-white">C</span>
              </div>
              <p className="text-slate-500 text-sm">ChatterStack • Amanuel Merara • {year}</p>
            </div>
            
            <div className="flex gap-6 text-sm text-slate-500">
               <a href={URLS.repo} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub</a>
               <a href={URLS.docs} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Docs</a>
               <a href="mailto:contact@amanuel.dev" className="hover:text-white transition-colors">Email</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}