import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Github,
  ArrowRight,
  Server,
  Database,
  Shield,
  Zap,
  BookOpen,
  Copy,
  Check,
  Globe,
  Layers,
  Terminal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const FEATURES = [
  {
    title: 'WebSockets that Scale',
    desc: 'Hub + rooms, fan-out via Redis pub/sub, instant delivery.',
    icon: <Zap className="w-6 h-6 text-yellow-400" />,
    gradient: 'from-yellow-500/20 to-orange-500/20',
  },
  {
    title: 'Clean Architecture',
    desc: 'Delivery, usecase, domain, repo layers — readable Go.',
    icon: <Layers className="w-6 h-6 text-blue-400" />,
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
    title: 'Developer Friendly',
    desc: 'Simple envs, blazing-fast Go toolchain, batteries included.',
    icon: <Terminal className="w-6 h-6 text-slate-400" />,
    gradient: 'from-slate-500/20 to-gray-500/20',
  },
];

const CODE_TABS = [
  {
    id: 'curl',
    label: 'Login (curl)',
    lang: 'bash',
    code: [
      "curl -s https://d1176qoi9kdya5.cloudfront.net/v1/auth/login \\",
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
      "const CF_BASE = 'https://d1176qoi9kdya5.cloudfront.net/v1';",
      '',
      'async function getUserByEmail(email: string, accessToken: string) {',
      "  const res = await fetch(`${CF_BASE}/users?email=${encodeURIComponent(email)}`, {",
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
      "const CF_WS = 'wss://d1176qoi9kdya5.cloudfront.net/ws';",
      '',
      'function connectWS(accessToken: string, roomIds: string[]) {',
      '  const qs = new URLSearchParams();',
      "  roomIds.forEach((id) => qs.append('room_id', id));",
      "  qs.set('access_token', accessToken);",
      '',
      '  const ws = new WebSocket(`${CF_WS}?${qs.toString()}`);',
      "  ws.onopen = () => console.log('WS connected');",
      '  ws.onmessage = (event) => console.log(JSON.parse(event.data));',
      '  return ws;',
      '}',
    ].join('\n'),
  },
  {
    id: 'openapi',
    label: 'OpenAPI',
    lang: 'yaml',
    code: [
      'openapi: 3.0.3',
      'servers:',
      '  - url: https://d1176qoi9kdya5.cloudfront.net/v1',
      'components:',
      '  securitySchemes:',
      '    XAuthToken:',
      '      type: apiKey',
      '      in: header',
      '      name: X-Auth-Token',
      'paths:',
      '  /users:',
      '    get:',
      '      security:',
      '        - XAuthToken: []',
    ].join('\n'),
  },
];

const TAB_META: Record<string, string> = {
  curl: 'Edge-friendly headers',
  fetch: 'Type-safe and copy-ready',
  ws: 'Query params keep tokens alive',
  openapi: 'Schema-first docs',
};

const JOURNEY_HIGHLIGHTS = [
  {
    quote:
      'CloudFront will not forward Authorization headers. We ship X-Auth-Token and document the edge nuance.',
    tag: 'Edge Auth',
  },
  {
    quote:
      'WebSockets keep auth too — access_token rides the query string so CloudFront and ALB keep it intact.',
    tag: 'WS Security',
  },
  {
    quote: 'Redis pub/sub is the glue that lets ECS tasks fan-out messages horizontally without sticky sessions.',
    tag: 'Scalability',
  },
];

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
    <div className="relative group rounded-xl overflow-hidden bg-[#0F172A] border border-slate-800">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/50 border-b border-slate-800">
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
        className="absolute top-3 right-3 p-2 rounded-lg bg-slate-800/70 text-slate-300 opacity-0 group-hover:opacity-100 transition-all hover:bg-slate-700 hover:text-white"
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
};

export default function Landing() {
  const [activeTab, setActiveTab] = useState('curl');
  const activeCode = CODE_TABS.find((tab) => tab.id === activeTab) ?? CODE_TABS[0];
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-[#0B1220] text-slate-200 selection:bg-sky-500/30">
      {/* HERO */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-900/20 via-[#0B1220] to-[#0B1220]" />
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
              <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-white md:text-6xl">
                Real-time chat,
                <br />
                <span className="bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">
                  production-grade backend.
                </span>
              </h1>
              <p className="mb-8 text-lg text-slate-400">
                Go + WebSockets, Redis pub/sub, Postgres, and AWS (CloudFront/ALB/ECS). Clean architecture with tests and docs — ready to learn from and build on.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-sky-500 hover:bg-sky-600 text-white font-semibold">
                  <a
                    href="https://github.com/Amaankaa/chatterstack-frontend"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center"
                  >
                    <Github className="mr-2 h-5 w-5" /> View on GitHub
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  <a
                    href="https://github.com/Amaankaa/chatterstack-frontend/blob/main/TheJourney.md"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center"
                  >
                    Read the Journey
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="relative"
            >
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-sky-500 to-emerald-500 opacity-30 blur" />
              <div className="relative rounded-2xl border border-slate-800 bg-[#0F172A] shadow-2xl overflow-hidden">
                <div className="flex items-center gap-2 border-b border-slate-800 px-4 py-3">
                  <div className="h-3 w-3 rounded-full bg-red-500/40" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/40" />
                  <div className="h-3 w-3 rounded-full bg-green-500/40" />
                  <span className="ml-2 text-xs text-slate-500">ws-client.ts</span>
                </div>
                <div className="p-6 font-mono text-sm text-slate-200 space-y-2">
                  <div>
                    <span className="text-purple-400">const</span> socket = new WebSocket('wss://api.chatterstack.com/ws');
                  </div>
                  <div>socket.onopen = () =&gt; {'{'} console.log('Connected');</div>
                  <div>  socket.send(JSON.stringify({'{'} event: 'send_message', data: {'{'}))</div>
                  <div>
                    {'    '}content: '<Typewriter text="Hello, world! This is real-time." />'
                  </div>
                  <div>  {'}'})</div>
                  <div>{'}'};</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 bg-[#0B1220]">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="group relative rounded-2xl border border-slate-800 bg-[#0F172A] p-6 hover:border-slate-600 transition-colors"
              >
                <div
                  className={cn(
                    'absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity',
                    feature.gradient ? `bg-gradient-to-br ${feature.gradient}` : ''
                  )}
                />
                <div className="relative z-10">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/60">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-1">{feature.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ARCHITECTURE */}
      <section className="py-24 bg-slate-900/30 border-y border-slate-800/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Production Architecture</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Client → CloudFront → ALB → ECS (API + Hub) → RDS + Redis. Every component pulls its weight so you can focus on product.
            </p>
          </div>
          <div className="relative max-w-4xl mx-auto rounded-3xl border border-slate-800 bg-[#0B1220] p-8 shadow-2xl">
            <div className="absolute inset-0 rounded-3xl bg-sky-500/5 blur-3xl" />
            <div className="relative z-10 flex flex-col items-center space-y-8 font-mono text-sm">
              <div className="px-6 py-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-200">Browser / SPA</div>
              <ArrowRight className="rotate-90 text-slate-600" />
              <div className="w-full max-w-md px-6 py-4 rounded-xl bg-purple-900/20 border border-purple-500/40 text-center text-purple-200">
                CloudFront (REST + WSS)
                <div className="text-xs text-purple-300/70">Edge cache, header shaping, TLS</div>
              </div>
              <ArrowRight className="rotate-90 text-slate-600" />
              <div className="w-full max-w-md px-6 py-4 rounded-xl bg-orange-900/20 border border-orange-500/40 text-center text-orange-200">
                Application Load Balancer
                <div className="text-xs text-orange-300/70">HTTP :8080 · WS :8081</div>
              </div>
              <div className="grid w-full gap-6 md:grid-cols-2">
                <div className="rounded-xl border border-sky-500/30 bg-sky-900/20 p-6 text-sky-100">
                  <div className="flex items-center font-semibold mb-2">
                    <Server className="w-4 h-4 mr-2" /> API Service
                  </div>
                  <ul className="space-y-1 text-xs text-sky-200/80">
                    <li>• Gin + JWT middleware</li>
                    <li>• Rate limiting + tracing</li>
                    <li>• OpenAPI + Postman</li>
                  </ul>
                </div>
                <div className="rounded-xl border border-sky-500/30 bg-sky-900/20 p-6 text-sky-100">
                  <div className="flex items-center font-semibold mb-2">
                    <Zap className="w-4 h-4 mr-2" /> WebSocket Hub
                  </div>
                  <ul className="space-y-1 text-xs text-sky-200/80">
                    <li>• Room directory + presence</li>
                    <li>• Redis pub/sub relay</li>
                    <li>• Graceful shutdown hooks</li>
                  </ul>
                </div>
              </div>
              <div className="grid w-full gap-6 pt-4 md:grid-cols-2 border-t border-dashed border-slate-800">
                <div className="flex items-center justify-center rounded-xl border border-blue-500/30 bg-blue-900/10 p-4 text-blue-100">
                  <Database className="w-5 h-5 mr-3" /> RDS PostgreSQL (pgx)
                </div>
                <div className="flex items-center justify-center rounded-xl border border-red-500/30 bg-red-900/10 p-4 text-red-100">
                  <Layers className="w-5 h-5 mr-3" /> Redis 7 (cache + pub/sub)
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CODE SHOWCASE */}
      <section className="py-24 bg-[#0B1220]" id="code">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4 space-y-6">
              <h2 className="text-3xl font-bold text-white">
                Code you can
                <br />
                <span className="text-sky-400">actually use.</span>
              </h2>
              <p className="text-slate-400">
                Auth headers, CloudFront behavior, WebSocket auth — everything spelled out with copy-ready snippets.
              </p>
              <div className="space-y-2">
                {CODE_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'w-full rounded-2xl border px-4 py-3 text-left transition-all',
                      activeTab === tab.id
                        ? 'border-sky-500/70 bg-sky-500/10 text-white shadow-lg shadow-sky-900/30'
                        : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{tab.label}</span>
                      <span className="text-xs uppercase tracking-wider text-slate-500">{tab.lang}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{TAB_META[tab.id]}</p>
                  </button>
                ))}
              </div>
              <p className="text-sm text-slate-500 border-l-2 border-slate-700 pl-4">
                Each snippet mirrors the real repo and Postman collection so you can copy, paste, and ship without guesswork.
              </p>
            </div>
            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCode.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  <CodeBlock code={activeCode.code} lang={activeCode.lang} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* JOURNEY */}
      <section className="py-24 bg-gradient-to-b from-[#0B1220] via-[#0d1424] to-[#080c16]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-4">Edge Cases, Documented</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Notes pulled straight from The Journey doc — the pitfalls we hit so you do not have to.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {JOURNEY_HIGHLIGHTS.map((item, idx) => (
              <motion.div
                key={item.tag}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur"
              >
                <span className="text-xs uppercase tracking-wider text-slate-500">{item.tag}</span>
                <p className="mt-4 text-lg text-slate-200 leading-relaxed">{item.quote}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-sky-600/20 via-cyan-500/10 to-emerald-500/20 px-8 py-12">
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.35),_transparent_60%)]" />
            <div className="relative z-10 grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-300">Launch Ready</p>
                <h3 className="mt-4 text-3xl font-semibold text-white">Spin up chat ops in minutes.</h3>
                <p className="mt-4 text-slate-200">
                  Clone, seed, and you are speaking WebSocket in under ten minutes. Ship ideas, not infra tickets.
                  <span className="ml-2 inline-flex items-center text-xs text-slate-400">
                    <code className="bg-slate-900/70 px-2 py-1 rounded border border-slate-700">make compose</code>
                  </span>
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
                <Button asChild size="lg" className="bg-white text-slate-900 hover:bg-slate-100 font-semibold">
                  <a href="https://github.com/Amaankaa/chatterstack-frontend" target="_blank" rel="noreferrer">
                    Get the Repo
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-slate-700 text-white hover:bg-slate-900"
                >
                  <a
                    href="https://github.com/Amaankaa/chatterstack-frontend/blob/main/API_documentation.md"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center"
                  >
                    API Deep Dive
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800/60 py-10">
        <div className="container mx-auto px-4 flex flex-col gap-6 text-slate-500 text-sm md:flex-row md:items-center md:justify-between">
          <p>ChatterStack • Crafted in public • {year}</p>
          <div className="flex gap-6">
            <a
              href="https://github.com/Amaankaa/chatterstack-frontend/blob/main/API_documentation.md"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-300"
            >
              Docs
            </a>
            <a
              href="https://github.com/Amaankaa/chatterstack-frontend/blob/main/README.md"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-300"
            >
              README
            </a>
            <a
              href="https://github.com/Amaankaa/chatterstack-frontend/blob/main/TheJourney.md"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-300"
            >
              Journey
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
