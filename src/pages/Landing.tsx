import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GithubIcon,
  Zap,
  Copy,
  Check,
  Globe,
  Shield,
  Send,
  LinkedinIcon,
  MessageCircle, 
  FileType,
  Layout,
  Activity,
  Loader2, // Added for loading state
  LogIn
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// --- CONFIG ---
const URLS = {
  register: "https://chatterstack.vercel.app/register",
  login: "https://chatterstack.vercel.app/login",
  repo: "https://github.com/Amaankaa/ChatterStack",
  docs: "https://github.com/Amaankaa/ChatterStack/blob/main/API_documentation.md",
  rawJourney: "https://raw.githubusercontent.com/Amaankaa/ChatterStack/main/TheJourney.md"
};

// --- ANIMATION COMPONENTS ---

const Meteors = ({ number = 20 }: { number?: number }) => {
  const [meteorStyles, setMeteorStyles] = useState<Array<React.CSSProperties>>([]);

  useEffect(() => {
    const styles = [...new Array(number)].map(() => ({
      top: -5,
      left: Math.floor(Math.random() * window.innerWidth) + 'px',
      animationDelay: Math.random() * 1 + 0.2 + 's',
      animationDuration: Math.floor(Math.random() * 8 + 2) + 's',
    }));
    setMeteorStyles(styles);
  }, [number]);

  return (
    <>
      {meteorStyles.map((style, idx) => (
        <span
          key={'meteor' + idx}
          className={cn(
            'pointer-events-none absolute left-1/2 top-1/2 h-0.5 w-0.5 rotate-[215deg] animate-meteor rounded-[9999px] bg-slate-500 shadow-[0_0_0_1px_#ffffff10]',
          )}
          style={style}
        >
          <div className="pointer-events-none absolute top-1/2 -z-10 h-[1px] w-[50px] -translate-y-1/2 bg-gradient-to-r from-slate-500 to-transparent" />
        </span>
      ))}
    </>
  );
};

const BackgroundEffects = () => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
    <div className="absolute inset-0 bg-[#0B1220]" />
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-sky-500/10 rounded-full blur-[120px] opacity-50" />
    <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-emerald-500/5 rounded-full blur-[100px] opacity-30" />
    <Meteors number={25} />
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
  </div>
);

// --- DATA CONSTANTS ---

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

const TECH_STACK = [
  { name: 'TypeScript', icon: 'TS', color: 'text-blue-400', border: 'border-blue-500/20', bg: 'bg-blue-500/10' },
  { name: 'React', icon: '⚛️', color: 'text-cyan-400', border: 'border-cyan-500/20', bg: 'bg-cyan-500/10' },
  { name: 'Tailwind', icon: '🎨', color: 'text-sky-300', border: 'border-sky-500/20', bg: 'bg-sky-500/10' },
  { name: 'Go', icon: '🐹', color: 'text-cyan-200', border: 'border-cyan-400/20', bg: 'bg-cyan-400/10' },
  { name: 'Redis', icon: '🔴', color: 'text-red-400', border: 'border-red-500/20', bg: 'bg-red-500/10' },
  { name: 'Postgres', icon: '🐘', color: 'text-blue-300', border: 'border-blue-400/20', bg: 'bg-blue-400/10' },
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
          "flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium backdrop-blur-sm transition-transform hover:scale-105 select-none",
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

// --- VIEWS ---

const LandingView = ({ onReadJourney }: { onReadJourney: () => void }) => {
  const [activeTab, setActiveTab] = useState('curl');
  const activeCode = CODE_TABS.find((tab) => tab.id === activeTab) ?? CODE_TABS[0];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative z-10">
      {/* HERO */}
      <section className="relative pt-32 pb-20">
        <div className="container relative z-10 mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className="mb-6 inline-flex items-center rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-sm font-medium text-sky-400">
                <span className="mr-2 flex h-2 w-2">
                  <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-sky-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500" />
                </span>
                v1.0 Production Ready
              </div>
              <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-white md:text-7xl">
                Real-time chat,
                <br />
                <span className="bg-gradient-to-r from-sky-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                  React + Go + AWS.
                </span>
              </h1>
              <p className="mb-8 text-lg text-slate-400 max-w-lg">
                The missing production manual. We combined <strong>TypeScript</strong> and <strong>Tailwind</strong> on the front with 
                <strong> Go</strong>, <strong>Redis</strong>, and <strong>Postgres</strong> on the back. Scalable, clean, and ready to deploy.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <Button asChild size="lg" className="bg-sky-500 hover:bg-sky-600 text-white font-semibold shadow-lg shadow-sky-500/25">
                  <a
                    href={URLS.register}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center"
                  >
                    <Zap className="mr-2 h-5 w-5" /> Get Started
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
                  Read the Journey
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
      <section className="py-24">
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
      <section className="py-24 border-y border-slate-800/30 bg-slate-900/20 backdrop-blur-sm">
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

const JourneyView = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(URLS.rawJourney)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load journey');
        return res.text();
      })
      .then((text) => {
        setContent(text);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch journey", err);
        setContent("# Error Loading Content\nCould not fetch the logs from GitHub. Please check the repo directly.");
        setLoading(false);
      });
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }}
      className="relative z-10 pt-32 pb-20 container mx-auto px-4 max-w-4xl"
    >
      <div className="mb-12 text-center">
        <div className="inline-block mb-4 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs uppercase tracking-wider">
          Engineering Logs
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">The Journey</h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          The pitfalls we hit so you don't have to. Reading live from the repository.
        </p>
      </div>

      <div className="p-8 md:p-12 rounded-3xl border border-slate-800 bg-slate-900/40 backdrop-blur-md min-h-[400px] shadow-2xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-sky-500" />
            <p className="animate-pulse">Fetching logs from GitHub...</p>
          </div>
        ) : (
          <article className="prose prose-invert prose-lg max-w-none prose-headings:text-sky-100 prose-a:text-sky-400 prose-code:text-emerald-300 prose-code:bg-slate-900/50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-[#0B1220] prose-pre:border prose-pre:border-slate-800">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          </article>
        )}
      </div>
    </motion.div>
  );
};

// --- MAIN LAYOUT ---

export default function Landing() {
  const [view, setView] = useState<'home' | 'journey'>('home');
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-[#0B1220] text-slate-200 selection:bg-sky-500/30 font-sans">
      <BackgroundEffects />
      
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0B1220]/70 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white fill-current" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">ChatterStack</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => setView('home')}
              className={cn("text-sm font-medium transition-colors hover:text-sky-400", view === 'home' ? 'text-white' : 'text-slate-400')}
            >
              Product
            </button>
            <button 
              onClick={() => setView('journey')}
              className={cn("text-sm font-medium transition-colors hover:text-sky-400", view === 'journey' ? 'text-white' : 'text-slate-400')}
            >
              The Journey
            </button>
            <a href={URLS.docs} target="_blank" rel="noreferrer" className="text-sm font-medium text-slate-400 hover:text-sky-400 transition-colors">
              Docs
            </a>
          </div>

          {/* Auth Actions */}
          <div className="flex items-center gap-3">
             <Button asChild size="sm" variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800 hidden sm:flex">
               <a href={URLS.login} target="_blank" rel="noreferrer">
                 <LogIn className="w-4 h-4 mr-2" />
                 Sign In
               </a>
             </Button>
             <Button asChild size="sm" className="bg-sky-500 hover:bg-sky-600 text-white font-semibold shadow-lg shadow-sky-500/20">
               <a href={URLS.register} target="_blank" rel="noreferrer">
                 Get Started
               </a>
             </Button>
          </div>
        </div>
      </nav>

      <main className="relative">
        <AnimatePresence mode="wait">
          {view === 'home' ? (
            <LandingView key="home" onReadJourney={() => setView('journey')} />
          ) : (
            <JourneyView key="journey" />
          )}
        </AnimatePresence>
      </main>

      {/* CTA SECTION */}
      <section className="relative py-24 z-10">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl border border-slate-700 bg-gradient-to-b from-slate-800 to-slate-900 px-8 py-12 shadow-2xl">
            {/* Glow effect */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-sky-500/20 rounded-full blur-3xl" />
            
            <div className="relative z-10 grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <h3 className="text-3xl font-bold text-white mb-4">Let's Build Something Amazing.</h3>
                <p className="text-slate-300 mb-6">
                  Ready to see it in action? Create an account to test the real-time websocket capabilities, 
                  or hire me to implement this stack for your business.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href="https://t.me/Amunishan" 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center justify-center px-6 py-3 rounded-lg bg-[#229ED9]/20 border border-[#229ED9]/50 text-[#229ED9] hover:bg-[#229ED9]/30 transition-colors"
                  >
                    <Send className="w-5 h-5 mr-2" /> Telegram
                  </a>
                  <a 
                    href="https://wa.me/251939163487" 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center justify-center px-6 py-3 rounded-lg bg-[#25D366]/20 border border-[#25D366]/50 text-[#25D366] hover:bg-[#25D366]/30 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" /> WhatsApp
                  </a>
                  <a 
                    href="https://www.linkedin.com/in/amanuel-merara-3bb71a36a" 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center justify-center px-6 py-3 rounded-lg bg-[#0077b5]/20 border border-[#0077b5]/50 text-[#0077b5] hover:bg-[#0077b5]/30 transition-colors"
                  >
                    <LinkedinIcon className="w-5 h-5 mr-2" /> LinkedIn
                  </a>
                </div>
              </div>
              
              <div className="rounded-xl bg-black/30 p-6 border border-white/10 text-center">
                <p className="text-sm text-slate-400 mb-2">Try the live demo</p>
                <div className="flex gap-4 mb-4">
                  <Button className="w-full bg-white text-black hover:bg-slate-200">
                    <a href={URLS.register} target="_blank" rel="noreferrer" className="flex items-center justify-center w-full">
                      <Zap className="w-4 h-4 mr-2" /> Create Account
                    </a>
                  </Button>
                </div>
                <div className="text-xs text-slate-500 flex items-center justify-center gap-2">
                   <span>or</span>
                   <a href={URLS.login} target="_blank" rel="noreferrer" className="text-sky-400 hover:underline">Log In</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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