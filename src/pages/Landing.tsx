import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GithubIcon,
  ArrowRight,
  Zap,
  BookOpen,
  Copy,
  Check,
  Globe,
  Layers,
  Shield,
  Send,
  LinkedinIcon,
  MessageCircle, // WhatsApp style
  Palette,
  FileType
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
    title: 'WebSockets that Scale',
    desc: 'Hub + rooms, fan-out via Redis pub/sub, instant delivery.',
    icon: <Zap className="w-6 h-6 text-yellow-400" />,
    gradient: 'from-yellow-500/20 to-orange-500/20',
  },
  {
    title: 'Type-Safe Frontend',
    desc: 'Built with React 18, TypeScript, and Tailwind CSS. Fully typed.',
    icon: <FileType className="w-6 h-6 text-blue-400" />,
    gradient: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    title: 'Production Infra',
    desc: 'CloudFront → ALB → ECS Fargate, RDS Postgres, Secrets Manager.',
    icon: <Globe className="w-6 h-6 text-emerald-400" />,
    gradient: 'from-emerald-500/20 to-green-500/20',
  },
  {
    title: 'Secure by Default',
    desc: 'JWT auth, rate limiting, disciplined CORS + header strategy.',
    icon: <Shield className="w-6 h-6 text-red-400" />,
    gradient: 'from-red-500/20 to-pink-500/20',
  },
  {
    title: 'Docs & Tests',
    desc: 'OpenAPI + Postman with unit and integration coverage.',
    icon: <BookOpen className="w-6 h-6 text-purple-400" />,
    gradient: 'from-purple-500/20 to-violet-500/20',
  },
  {
    title: 'Beautiful UI',
    desc: 'Styled with Tailwind CSS and animated with Framer Motion.',
    icon: <Palette className="w-6 h-6 text-pink-400" />,
    gradient: 'from-pink-500/20 to-rose-500/20',
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
  { name: 'AWS', icon: '☁️', color: 'text-orange-400', border: 'border-orange-500/20', bg: 'bg-orange-500/10' },
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
                <strong> Go</strong> and <strong>Redis</strong> on the back. Documented so you can skip the infra headaches.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <Button asChild size="lg" className="bg-sky-500 hover:bg-sky-600 text-white font-semibold shadow-lg shadow-sky-500/25">
                  <a
                    href="https://github.com/Amaankaa/chatterstack-frontend"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center"
                  >
                    <GithubIcon className="mr-2 h-5 w-5" /> View on GitHub
                  </a>
                </Button>
                <Button
                  onClick={onReadJourney}
                  variant="outline"
                  size="lg"
                  className="border-slate-700 bg-slate-900/50 text-slate-300 hover:bg-slate-800 hover:text-white backdrop-blur-sm"
                >
                  Read the Journey
                  <ArrowRight className="ml-2 h-4 w-4" />
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
                  <div className="pl-8">event: <span className="text-emerald-400">'message'</span>,</div>
                  <div className="pl-8">
                     content: '<Typewriter text="Full stack simplicity." />'
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
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Building The Beast</h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          The journey from a "simple chat app" to a distributed system handling thousands of connections. 
          Here are the pitfalls we hit so you don't have to.
        </p>
      </div>

      <div className="space-y-12">
        {/* CHAPTER 1 */}
        <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/40 backdrop-blur-md">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-10 w-10 rounded-lg bg-red-500/20 flex items-center justify-center border border-red-500/30">
              <Shield className="w-5 h-5 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">The CloudFront Header Incident</h2>
          </div>
          <div className="prose prose-invert prose-slate max-w-none text-slate-300 leading-relaxed">
            <p className="mb-4">
              We deployed the first version with standard Authorization headers. It worked locally. It worked on bare EC2. 
              But the moment we put it behind CloudFront, all WebSockets failed.
            </p>
            <p className="mb-4 border-l-2 border-red-500/50 pl-4 bg-red-900/10 py-2 pr-2 rounded-r">
              <strong>The Gotcha:</strong> By default, CloudFront strips the <code>Authorization</code> header and doesn't forward cookies 
              to the origin to improve caching hit rates.
            </p>
            <p>
              <strong>The Fix:</strong> We implemented a dual-strategy. REST APIs use a custom <code>X-Auth-Token</code> header 
              (which we explicitly allowlisted in CloudFront behaviors), and WebSockets use a query parameter 
              <code>?access_token=...</code> because browsers don't allow custom headers in the WebSocket handshake constructor.
            </p>
          </div>
        </div>

        {/* CHAPTER 2 */}
        <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/40 backdrop-blur-md">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
              <Layers className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Redis Pub/Sub: The Glue</h2>
          </div>
          <div className="prose prose-invert prose-slate max-w-none text-slate-300 leading-relaxed">
            <p className="mb-4">
              Scaling ECS tasks horizontally created a problem: If Alice is connected to <em>Server A</em> and Bob is connected to <em>Server B</em>, 
              how does Server A send a message to Bob?
            </p>
            <p>
              We used Redis Pub/Sub as a message bus. Every Go instance subscribes to a specific Redis channel based on active rooms. 
              When a message comes in, it's published to Redis, fan-out occurs, and the relevant Go instance pushes it down the WebSocket.
              This allows us to scale ECS tasks from 1 to 100 without sticky sessions.
            </p>
          </div>
        </div>

        {/* CHAPTER 3 */}
        <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/40 backdrop-blur-md">
           <div className="flex items-center gap-4 mb-6">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
              <Check className="w-5 h-5 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Go Concurrency Patterns</h2>
          </div>
          <div className="prose prose-invert prose-slate max-w-none text-slate-300 leading-relaxed">
            <p className="mb-4">
              Managing thousands of connections requires discipline. We used Go's select statements and channels to ensure 
              we never block the main thread.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-400">
              <li><strong>ReadPump:</strong> Dedicated goroutine for reading messages from the socket.</li>
              <li><strong>WritePump:</strong> Dedicated goroutine for pushing messages to the socket.</li>
              <li><strong>Hub:</strong> A central structure managing the register/unregister events.</li>
            </ul>
          </div>
        </div>
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
            <a href="https://github.com/Amaankaa/chatterstack-frontend/blob/main/API_documentation.md" target="_blank" rel="noreferrer" className="text-sm font-medium text-slate-400 hover:text-sky-400 transition-colors">
              Docs
            </a>
          </div>

          <div className="flex items-center gap-3">
             <Button size="sm" className="bg-white text-slate-900 hover:bg-slate-200 hidden sm:flex">
               <a href="https://github.com/Amaankaa/chatterstack-frontend" target="_blank" rel="noreferrer">
                 Get Repo
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
                  Have a question about the stack? Need a freelancer to implement this for your business? 
                  I am available for contract work and consulting.
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
                <p className="text-sm text-slate-400 mb-2">Clone the template</p>
                <code className="block bg-black/50 p-4 rounded-lg text-sky-400 font-mono text-sm mb-4 border border-slate-800">
                  git clone https://github.com/Amaankaa/chatterstack-frontend.git
                </code>
                <Button className="w-full bg-white text-black hover:bg-slate-200">
                  <a href="https://github.com/Amaankaa/chatterstack-frontend" target="_blank" rel="noreferrer" className="flex items-center justify-center w-full">
                    <GithubIcon className="w-4 h-4 mr-2" /> Star the Repo
                  </a>
                </Button>
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
               <a href="https://github.com/Amaankaa" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub</a>
               <a href="https://www.linkedin.com/in/amanuel-merara-3bb71a36a" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
               <a href="mailto:contact@amanuel.dev" className="hover:text-white transition-colors">Email</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}