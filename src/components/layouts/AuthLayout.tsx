import { ReactNode, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionTemplate, useMotionValue } from 'framer-motion';
import { MessageSquare, ArrowLeft, Star, Quote, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// --- Configuration ---
const TESTIMONIAL_INTERVAL = 5000; // 5 Seconds per slide

const testimonials = [
  {
    text: "The latency on this thing is insane. It's like the messages arrive before I even send them. Truly a clean architecture masterpiece.",
    author: "Sofia Davis",
    role: "Senior Systems Architect",
    company: "TechFlow",
    stars: 5
  },
  {
    text: "We switched from a heavy Node.js monolith to ChatterStack's Go backend. Our infrastructure costs dropped by 60% overnight.",
    author: "Marcus Chen",
    role: "CTO",
    company: "ScaleUp Inc",
    stars: 5
  },
  {
    text: "Finally, a chat solution that respects type safety. The end-to-end TypeScript integration saved us hundreds of hours of debugging.",
    author: "Emily R.",
    role: "Lead Frontend Dev",
    company: "DevCorp",
    stars: 5
  },
  {
    text: "Robust, secure, and blazingly fast. The Redis Pub/Sub implementation handles our 50k concurrent users without breaking a sweat.",
    author: "David Kim",
    role: "VP of Engineering",
    company: "ChatterBox",
    stars: 5
  }
];

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  // --- State for Testimonials ---
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, TESTIMONIAL_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  // --- Mouse Follow Logic ---
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = ({ clientX, clientY, currentTarget }: React.MouseEvent) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  return (
    <div className="container relative h-screen flex-col items-center justify-center md:grid md:max-w-none md:grid-cols-2 lg:px-0 overflow-hidden bg-slate-50">
      
      {/* --- Mobile Back Button --- */}
      <div className="absolute left-4 top-4 md:hidden z-50">
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        </Link>
      </div>

      {/* --- LEFT SIDE: IMMERSIVE BRANDING --- */}
      <div 
        ref={ref}
        onMouseMove={handleMouseMove}
        className="relative hidden h-full flex-col bg-slate-950 p-10 text-white dark:border-r md:flex overflow-hidden group"
      >
        
        {/* 1. Animated Background Orbs (Lava Lamp Effect) */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-slate-950 z-0" />
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light z-10" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] z-10" />

          {/* Moving Blobs */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-[20%] -left-[10%] w-[800px] h-[800px] rounded-full bg-indigo-600/20 blur-[120px] z-0" 
          />
          <motion.div 
            animate={{ scale: [1, 1.5, 1], x: [0, 100, 0], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[20%] -right-[20%] w-[600px] h-[600px] rounded-full bg-purple-600/20 blur-[120px] z-0" 
          />
           <motion.div 
            animate={{ scale: [1, 1.1, 1], y: [0, -50, 0], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-blue-500/20 blur-[100px] z-0" 
          />
        </div>

        {/* 2. Mouse Spotlight (Subtle interaction) */}
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100 z-10"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                650px circle at ${mouseX}px ${mouseY}px,
                rgba(99, 102, 241, 0.15),
                transparent 80%
              )
            `,
          }}
        />

        {/* --- Header Content --- */}
        <div className="relative z-20 flex items-center justify-between">
          <Link to="/" className="flex items-center text-lg font-bold tracking-tight group/logo">
            <div className="bg-indigo-600 p-2 rounded-xl mr-3 shadow-lg shadow-indigo-500/20 group-hover/logo:scale-110 transition-transform">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl">ChatterStack</span>
          </Link>
        </div>

        {/* --- Middle: Floating Abstract Badges --- */}
        <div className="relative z-20 flex-1 flex flex-col items-center justify-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
               <div className="absolute inset-0 bg-indigo-500 blur-[50px] opacity-20 rounded-full" />
               {/* Only visual candy - maybe a 3D illustration or just spacing */}
            </motion.div>
        </div>

        {/* --- Bottom: Testimonial Carousel --- */}
        <div className="relative z-20 mt-auto max-w-lg">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="relative rounded-2xl bg-slate-900/40 border border-white/10 p-8 backdrop-blur-xl shadow-2xl"
              >
                 {/* Decorative Icons */}
                 <Quote className="absolute top-6 left-6 w-8 h-8 text-indigo-500/50 rotate-180" />
                 
                 <div className="relative z-10 pl-6">
                   <p className="text-lg font-medium leading-relaxed text-slate-200 mb-6">
                     &ldquo;{testimonials[index].text}&rdquo;
                   </p>
                   
                   <div className="flex items-center justify-between border-t border-white/10 pt-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-sm font-bold">
                           {testimonials[index].author.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{testimonials[index].author}</div>
                          <div className="text-xs text-slate-400">{testimonials[index].role}, {testimonials[index].company}</div>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(testimonials[index].stars)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        ))}
                      </div>
                   </div>
                 </div>
              </motion.div>
            </AnimatePresence>

            {/* Slider Indicators */}
            <div className="flex gap-2 mt-6 justify-center">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    index === i ? "w-8 bg-indigo-500" : "w-1.5 bg-slate-700 hover:bg-slate-600"
                  )}
                />
              ))}
            </div>
        </div>
      </div>

      {/* --- RIGHT SIDE: FORM --- */}
      <div className="lg:p-8 h-full flex items-center justify-center relative overflow-hidden">
        
        {/* Background Decoration (Right) */}
        <div className="absolute inset-0 z-0 pointer-events-none">
           <div className="absolute -top-[10%] -right-[10%] w-[500px] h-[500px] bg-slate-200/50 rounded-full blur-[80px] opacity-50" />
           <div className="absolute -bottom-[10%] -left-[10%] w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-[80px] opacity-50" />
           <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px] relative z-10"
        >
          {/* Form Container Card */}
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/50 ring-1 ring-slate-900/5">
            <div className="flex flex-col space-y-2 text-center mb-8">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mx-auto mb-2 text-indigo-600">
                {title.includes("Welcome") ? <ShieldCheck className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            </div>
            
            {children}
          </div>

          {/* Footer Links */}
          <div className="text-center space-x-4 text-xs text-slate-400">
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}