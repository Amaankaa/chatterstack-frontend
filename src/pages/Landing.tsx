import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MessageSquare, Zap, Globe, Check, Server, 
  Database, Cpu, Github, ArrowRight, LayoutGrid, Lock, RefreshCw, MousePointer2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

// --- DATA & CONFIG ---

const codeSnippet = `// Internal WebSocket Hub Implementation
func (h *Hub) Run() {
    for {
        select {
        case client := <-h.register:
            h.clients[client] = true
            // Sync state via Redis
            h.cache.Set(ctx, client.ID, "ONLINE", 0)
            
        case message := <-h.broadcast:
            // Fan-out to local clients
            for client := range h.clients {
                select {
                case client.send <- message:
                default:
                    close(client.send)
                    delete(h.clients, client)
                }
            }
            // Publish to Redis channel
            h.redis.Publish(ctx, "global_messages", message)
        }
    }
}`;

const useCases = [
  { title: "Live Auctions", icon: <Zap className="text-yellow-400" />, desc: "Sub-10ms latency for real-time bidding wars." },
  { title: "Gaming Chat", icon: <MousePointer2 className="text-purple-400" />, desc: "Squad communication handling 100k+ CCU." },
  { title: "FinTech Streams", icon: <Globe className="text-emerald-400" />, desc: "Secure stock ticker updates and trade alerts." },
  { title: "Collab Tools", icon: <LayoutGrid className="text-blue-400" />, desc: "Multi-user document editing and presence." },
  { title: "Support Desks", icon: <MessageSquare className="text-pink-400" />, desc: "Omni-channel customer support messaging." },
  { title: "IoT Events", icon: <Cpu className="text-cyan-400" />, desc: "Device telemetry and command propagation." },
];

const pricing = [
  {
    name: "Starter",
    price: "Free",
    desc: "For side projects and prototypes.",
    features: ["Up to 100 Concurrent Connections", "Ephemeral Storage", "Community Support", "Basic Rate Limiting"],
    cta: "Start Building",
    popular: false
  },
  {
    name: "Pro",
    price: "$29",
    desc: "For growing startups and apps.",
    features: ["10k Concurrent Connections", "30-Day Message History", "Priority Email Support", "Redis Cluster Support", "Custom Domains"],
    cta: "Go Pro",
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "For large-scale platforms.",
    features: ["Unlimited Connections", "Permanent History (S3)", "24/7 Dedicated Support", "On-Premise Deployment", "SLA Guarantees"],
    cta: "Contact Sales",
    popular: false
  }
];

const faqs = [
  { q: "How does ChatterStack handle scaling?", a: "ChatterStack uses a Redis Pub/Sub architecture. You can spin up multiple Go server instances behind a load balancer. Redis ensures messages sent to one node are instantly broadcast to all other nodes." },
  { q: "Can I use this with my existing Auth?", a: "Yes. ChatterStack uses JWTs. You can either use the built-in auth or issue your own tokens signed with the same secret, and ChatterStack will validate them via middleware." },
  { q: "Is persistence included?", a: "Absolutely. We use PostgreSQL for robust, relational storage of users, rooms, and message history. Migrations are included out of the box." },
  { q: "What happens if Redis goes down?", a: "The system degrades gracefully. Local messages still work on individual nodes, but cross-node broadcasting will pause until the Redis connection is restored." },
  { q: "How do I deploy this?", a: "We provide a production-ready Docker Compose setup. You can deploy to AWS ECS, Google Cloud Run, or a DigitalOcean Droplet in minutes." },
];

// --- COMPONENTS ---

const FadeIn = ({ children, delay = 0, className }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

const FeatureCard = ({ title, desc, icon, className }: { title: string, desc: string, icon: any, className?: string }) => (
  <div className={cn("group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50 p-8 hover:border-white/20 transition-colors", className)}>
    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-slate-800/50 group-hover:bg-indigo-500/20 transition-colors">
      {icon}
    </div>
    <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
    <p className="text-slate-400 leading-relaxed">{desc}</p>
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
  </div>
);

// --- MAIN PAGE ---

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-indigo-500/30 overflow-x-hidden">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between px-6 md:px-12">
          <div className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/20">
              <MessageSquare className="h-4 w-4 text-white" />
            </div>
            <span>ChatterStack</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white">Sign in</Link>
            <Link to="/register">
              <Button className="rounded-full bg-white text-slate-950 hover:bg-slate-200 font-semibold">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] opacity-40 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] opacity-30 pointer-events-none" />
        
        <div className="container px-6 md:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left: Copy */}
            <div className="text-left">
              <FadeIn>
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300 mb-8">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                  </span>
                  v1.0 Stable Release
                </div>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
                  Real-time infrastructure for <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">ambitious platforms.</span>
                </h1>
                <p className="text-lg text-slate-400 mb-8 max-w-xl leading-relaxed">
                  The production-ready chat backend built with <strong>Go</strong>, <strong>Redis</strong>, and <strong>Postgres</strong>. 
                  Drop-in scalable messaging for your React & Mobile apps.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/register">
                    <Button size="lg" className="h-12 px-8 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-base shadow-lg shadow-indigo-500/25">
                      Start Building Free
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <a href="https://github.com" target="_blank" rel="noreferrer">
                    <Button size="lg" variant="outline" className="h-12 px-8 rounded-full border-slate-700 bg-slate-900/50 text-slate-300 hover:text-white hover:bg-slate-800">
                      <Github className="mr-2 h-4 w-4" />
                      View Source
                    </Button>
                  </a>
                </div>
                
                <div className="mt-10 flex items-center gap-6 text-sm text-slate-500 font-mono">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-indigo-500" /> <span>Go 1.21+</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-indigo-500" /> <span>WebSocket</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-indigo-500" /> <span>Clean Arch</span>
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* Right: Code Terminal Visual */}
            <FadeIn delay={0.2} className="relative hidden lg:block">
              <div className="relative rounded-xl bg-[#0d1117] border border-slate-800 shadow-2xl shadow-indigo-500/10 overflow-hidden">
                {/* Window Controls */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 bg-slate-900/50">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <div className="h-3 w-3 rounded-full bg-green-500/80" />
                  <div className="ml-4 text-xs text-slate-500 font-mono">hub.go — internal/delivery/ws</div>
                </div>
                {/* Code Area */}
                <div className="p-6 overflow-x-auto">
                  <pre className="font-mono text-sm leading-relaxed">
                    <code className="language-go">
                      {codeSnippet.split('\n').map((line, i) => (
                        <div key={i} className="table-row">
                          <span className="table-cell select-none text-slate-700 text-right pr-4">{i + 1}</span>
                          <span className="table-cell" dangerouslySetInnerHTML={{
                            __html: line
                              .replace(/func|for|select|case|default|if|return/g, '<span class="text-purple-400">$&</span>')
                              .replace(/(\w+)\(/g, '<span class="text-blue-400">$1</span>(')
                              .replace(/\/\/.*/g, '<span class="text-slate-500">$&</span>')
                              .replace(/"[^"]*"/g, '<span class="text-green-400">$&</span>')
                          }} />
                        </div>
                      ))}
                    </code>
                  </pre>
                </div>
              </div>
              {/* Decorative elements behind terminal */}
              <div className="absolute -z-10 top-10 -right-10 w-64 h-64 bg-indigo-600/20 rounded-full blur-[80px]" />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* PARTNERS / TRUST (Fabricated) */}
      <section className="py-10 border-y border-white/5 bg-slate-900/30">
        <div className="container text-center px-6">
          <p className="text-sm font-medium text-slate-500 mb-8 uppercase tracking-widest">Trusted by developers at</p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
            {/* Using Text as Logo placeholders */}
            <h3 className="text-xl font-bold text-white flex items-center gap-2"><Globe className="w-5 h-5" /> Acme Corp</h3>
            <h3 className="text-xl font-bold text-white flex items-center gap-2"><Zap className="w-5 h-5" /> Bolt.new</h3>
            <h3 className="text-xl font-bold text-white flex items-center gap-2"><LayoutGrid className="w-5 h-5" /> GridLock</h3>
            <h3 className="text-xl font-bold text-white flex items-center gap-2"><Cpu className="w-5 h-5" /> ChipSet</h3>
            <h3 className="text-xl font-bold text-white flex items-center gap-2"><Server className="w-5 h-5" /> StackFlow</h3>
          </div>
        </div>
      </section>

      {/* FEATURES BENTO GRID */}
      <section id="features" className="py-24 relative">
        <div className="container px-6 md:px-12">
          <div className="max-w-3xl mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Engineered for scale. <br /><span className="text-indigo-400">Designed for sanity.</span></h2>
            <p className="text-lg text-slate-400">We abstracted the hard parts of building a chat backend—concurrency, synchronization, and persistence—so you can focus on the UI.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Large Card */}
            <div className="md:col-span-2 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-900/50 p-8 md:p-12 relative overflow-hidden group">
              <div className="relative z-10">
                <div className="h-12 w-12 rounded-lg bg-indigo-500/20 flex items-center justify-center mb-6 text-indigo-400">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Ultra-Low Latency Gateway</h3>
                <p className="text-slate-400 max-w-md text-lg">
                  Powered by Go's lightweight goroutines. A single node can handle thousands of concurrent WebSocket connections with minimal memory footprint.
                </p>
              </div>
              <div className="absolute right-0 bottom-0 w-1/2 h-full bg-indigo-600/5 blur-[100px] group-hover:bg-indigo-600/10 transition-colors" />
            </div>

            {/* Tall Card */}
            <div className="row-span-2 rounded-2xl border border-white/10 bg-slate-900 p-8 md:p-12 relative overflow-hidden group">
               <div className="h-12 w-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-6 text-purple-400">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">JWT Authentication</h3>
                <p className="text-slate-400 mb-8">
                  Stateless and secure. Automatic access and refresh token rotation. Middleware intercepts requests before they hit the domain layer.
                </p>
                <div className="rounded-lg bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-500">
                  <div className="flex justify-between mb-2">
                    <span>alg</span> <span className="text-indigo-400">"HS256"</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>typ</span> <span className="text-indigo-400">"JWT"</span>
                  </div>
                  <div className="border-t border-slate-800 my-2" />
                  <div className="flex justify-between">
                    <span>exp</span> <span className="text-green-400">1732290000</span>
                  </div>
                </div>
            </div>

            {/* Standard Card */}
            <FeatureCard 
              icon={<Database className="w-6 h-6 text-blue-400" />}
              title="PostgreSQL Persistence"
              desc="Messages, rooms, and users are stored safely with ACID compliance. Migrations included."
            />

            {/* Standard Card */}
            <FeatureCard 
              icon={<RefreshCw className="w-6 h-6 text-emerald-400" />}
              title="Redis Pub/Sub"
              desc="Horizontal scaling made easy. Messages broadcast across nodes instantly via Redis channels."
            />

            {/* Wide Card */}
            <div className="md:col-span-3 lg:col-span-3 rounded-2xl border border-white/10 bg-slate-900 p-8 md:p-12 flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-4">Clean Architecture</h3>
                <p className="text-slate-400 text-lg mb-6">
                  We strictly separate Delivery (HTTP/WS), Usecase, Domain, and Repository layers. This makes the codebase testable, maintainable, and easy to extend without spaghetti code.
                </p>
                <ul className="space-y-3">
                   {['Dependency Injection', 'Interface-based Design', '100% Unit Test Coverage'].map(item => (
                     <li key={item} className="flex items-center gap-3 text-slate-300">
                       <Check className="w-5 h-5 text-indigo-500" /> {item}
                     </li>
                   ))}
                </ul>
              </div>
              <div className="flex-1 w-full max-w-md aspect-video bg-slate-950 rounded-xl border border-slate-800 p-4 flex items-center justify-center relative">
                 {/* Abstract Layer Diagram */}
                 <div className="flex gap-4">
                    <div className="w-16 h-24 bg-slate-800 rounded border border-slate-700 flex flex-col items-center justify-center text-[10px] text-slate-500">Delivery</div>
                    <ArrowRight className="w-4 h-4 text-slate-600 self-center" />
                    <div className="w-16 h-24 bg-slate-800 rounded border border-slate-700 flex flex-col items-center justify-center text-[10px] text-slate-500">Usecase</div>
                    <ArrowRight className="w-4 h-4 text-slate-600 self-center" />
                    <div className="w-16 h-24 bg-indigo-900/20 rounded border border-indigo-500/50 flex flex-col items-center justify-center text-[10px] text-indigo-400 font-bold">Domain</div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section className="py-24 bg-slate-900/50 border-y border-white/5">
        <div className="container px-6 md:px-12">
          <div className="text-center mb-16">
             <h2 className="text-3xl font-bold">Built for any realtime scenario</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {useCases.map((useCase, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="flex gap-4 items-start p-4 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="mt-1 bg-slate-900 p-2 rounded-lg border border-slate-800">
                    {useCase.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{useCase.title}</h4>
                    <p className="text-sm text-slate-400 mt-1">{useCase.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 relative">
        <div className="container px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-slate-400">Start for free, scale as you grow.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricing.map((plan, i) => (
              <div key={i} className={cn(
                "relative rounded-2xl p-8 border flex flex-col",
                plan.popular 
                  ? "bg-slate-900 border-indigo-500 shadow-2xl shadow-indigo-500/10" 
                  : "bg-slate-950 border-slate-800"
              )}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-white">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    {plan.price !== "Custom" && <span className="text-slate-500">/mo</span>}
                  </div>
                  <p className="mt-2 text-sm text-slate-400">{plan.desc}</p>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-slate-300">
                      <Check className="w-4 h-4 text-indigo-500" /> {feature}
                    </li>
                  ))}
                </ul>
                <Button className={cn("w-full", plan.popular ? "bg-indigo-600 hover:bg-indigo-500" : "bg-slate-800 hover:bg-slate-700")}>
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-24 bg-slate-900/30">
        <div className="container px-6 md:px-12 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Frequently asked questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-b border-slate-800">
                <AccordionTrigger className="text-left text-slate-200 hover:text-white hover:no-underline py-6 text-lg">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-slate-400 pb-6 text-base leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-900 bg-slate-950 py-12">
        <div className="container px-6 md:px-12">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 text-xl font-bold text-white mb-4">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-indigo-600">
                  <MessageSquare className="h-3 w-3 text-white" />
                </div>
                ChatterStack
              </div>
              <p className="text-slate-500 max-w-xs">
                The developer-first messaging platform. Open source, scalable, and built with modern principles.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Changelog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-indigo-400 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-600">© 2024 ChatterStack Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <Github className="w-5 h-5 text-slate-600 hover:text-white cursor-pointer transition-colors" />
              <Globe className="w-5 h-5 text-slate-600 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}