import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, ChevronRight, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
        isScrolled ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-lg" : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center w-8 h-8 rounded bg-primary/10 border border-primary/30 group-hover:border-primary/60 transition-colors">
            <Activity className="w-5 h-5 text-primary" />
            <div className="absolute inset-0 bg-primary/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="font-serif font-bold text-xl tracking-wider text-foreground">
            NEXUS<span className="text-muted-foreground font-light text-lg">ECO</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#terraiq" className="text-sm font-mono text-muted-foreground hover:text-foreground transition-colors">01.TerraIQ</a>
          <a href="#agrinexus" className="text-sm font-mono text-muted-foreground hover:text-foreground transition-colors">02.AgriNexus</a>
          <a href="#fieldlot" className="text-sm font-mono text-muted-foreground hover:text-foreground transition-colors">03.FieldLot</a>
          <a href="#auditnexus" className="text-sm font-mono text-muted-foreground hover:text-foreground transition-colors">04.AuditNexus</a>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" className="font-mono text-xs tracking-widest uppercase">Sign In</Button>
          <Button className="font-mono text-xs tracking-widest uppercase bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_-5px_hsl(var(--primary))]">
            Initialize <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <button
          className="md:hidden text-foreground p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          className="md:hidden absolute top-20 left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border p-6 flex flex-col gap-4 shadow-2xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <a href="#terraiq" onClick={() => setMobileMenuOpen(false)} className="text-sm font-mono text-muted-foreground py-2 border-b border-border/50">01.TerraIQ</a>
          <a href="#agrinexus" onClick={() => setMobileMenuOpen(false)} className="text-sm font-mono text-muted-foreground py-2 border-b border-border/50">02.AgriNexus</a>
          <a href="#fieldlot" onClick={() => setMobileMenuOpen(false)} className="text-sm font-mono text-muted-foreground py-2 border-b border-border/50">03.FieldLot</a>
          <a href="#auditnexus" onClick={() => setMobileMenuOpen(false)} className="text-sm font-mono text-muted-foreground py-2 border-b border-border/50">04.AuditNexus</a>
          <Button className="mt-4 font-mono text-xs uppercase w-full bg-primary text-primary-foreground">
            Initialize System
          </Button>
        </motion.div>
      )}
    </motion.header>
  );
}
