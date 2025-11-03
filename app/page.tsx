"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [progress, setProgress] = useState(1);
  const [animatedHabiTotal, setAnimatedHabiTotal] = useState(0);
  const [animatedMarketTotal, setAnimatedMarketTotal] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const habiCounterRef = useRef<HTMLDivElement>(null);
  const marketCounterRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const habiCardRef = useRef<HTMLDivElement>(null);
  const marketCardRef = useRef<HTMLDivElement>(null);
  const habiDescRef = useRef<HTMLParagraphElement>(null);
  const marketDescRef = useRef<HTMLParagraphElement>(null);

  const months = 9;
  const habiPerMonth = 100 / months; // 11.11M por mes
  const marketExpensePerMonth = 0.8; // 800 mil pesos mensuales
  const marketFinalSale = 110;

  const habiTotal = progress * habiPerMonth;
  const marketTotal = progress === months ? marketFinalSale - (months * marketExpensePerMonth) : -(progress * marketExpensePerMonth);

  // Descripciones por mes para Habi
  const getHabiDescription = (month: number) => {
    if (month === months) return "Recibes tu última cuota fija";
    return "Recibes tu cuota fija";
  };

  // Descripciones por mes para Mercado
  const getMarketDescription = (month: number) => {
    if (month === 9) return "Recibes la venta menos los gastos acumulados";
    return "Pagas gastos de tener un inmueble";
  };

  // Animar contadores cuando cambia el progress
  useEffect(() => {
    const tl = gsap.timeline();

    // Fade out suave de las cards
    tl.to([habiCardRef.current, marketCardRef.current], {
      opacity: 0.6,
      duration: 0.3,
      ease: "power2.inOut"
    });

    // Animar contadores con efecto suave
    tl.to({ value: animatedHabiTotal }, {
      value: habiTotal,
      duration: 0.8,
      ease: "power2.inOut",
      onUpdate: function() {
        setAnimatedHabiTotal(this.targets()[0].value);
      }
    }, "-=0.15");

    tl.to({ value: animatedMarketTotal }, {
      value: marketTotal,
      duration: 0.8,
      ease: "power2.inOut",
      onUpdate: function() {
        setAnimatedMarketTotal(this.targets()[0].value);
      }
    }, "<");

    // Fade in suave de las cards
    tl.to([habiCardRef.current, marketCardRef.current], {
      opacity: 1,
      duration: 0.3,
      ease: "power2.inOut"
    }, "-=0.4");

    // Animar descripciones con fade simple
    if (habiDescRef.current) {
      tl.fromTo(habiDescRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: "power2.out" },
        "-=0.2"
      );
    }

    if (marketDescRef.current) {
      tl.fromTo(marketDescRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: "power2.out" },
        "<"
      );
    }
  }, [progress]);

  useEffect(() => {
    if (!scrollContainerRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: scrollContainerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          // Va de mes 1 a mes 9
          const newProgress = Math.ceil(self.progress * months);
          setProgress(Math.max(1, newProgress));
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="min-h-screen bg-gradient-to-b from-white via-[#F9F0FF] to-[#EACDFE]/30">
      <div className="container mx-auto px-6 py-12 max-w-5xl">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-white mb-6" style={{ backgroundColor: "#8A00E6" }}>
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            Nuevo producto Habi
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tight" style={{ color: "#7400C2" }}>
            Vende con cuotas fijas vs mercado tradicional
          </h1>
          <p className="text-xl text-slate-700 max-w-2xl mx-auto font-medium">
            Compara cómo evolucionan tus ingresos mes a mes con scroll interactivo
          </p>
        </header>

        {/* Comparación Card - Sticky */}
        <div 
          ref={cardRef}
          className="sticky top-8 bg-white rounded-2xl border shadow-sm p-8 mb-8 transition-all duration-300"
          style={{ borderColor: "#E5E7EB" }}>
          
          {/* Layout: Mes a la izquierda, Cards a la derecha */}
          <div className="flex gap-8 items-start">
            
            {/* Mes - Izquierda */}
            <div className="flex-shrink-0">
              <p className="text-sm uppercase tracking-widest text-slate-400 mb-2 font-semibold">Mes</p>
              <p className="text-8xl font-black" style={{ color: "#7400C2" }}>
                {progress}
              </p>
            </div>

            {/* Cards - Derecha */}
            <div className="flex-1 grid md:grid-cols-2 gap-6">
              
              {/* Habi */}
              <div ref={habiCardRef} className="space-y-4">
                <p className="text-xs uppercase tracking-widest font-black" style={{ color: "#7400C2" }}>
                  Habi
                </p>
                
                <div ref={habiCounterRef}>
                  <p className="text-5xl font-black" style={{ color: "#7400C2" }}>
                    ${animatedHabiTotal.toFixed(1)}M
                  </p>
                </div>

                <p ref={habiDescRef} className="text-sm text-slate-600 font-medium">
                  Recibes tu cuota fija
                </p>
              </div>

              {/* Mercado */}
              <div ref={marketCardRef} className="space-y-4">
                <p className="text-xs uppercase tracking-widest font-black text-slate-700">
                  Mercado tradicional
                </p>
                
                <div ref={marketCounterRef}>
                  <p className={`text-5xl font-black ${marketTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${animatedMarketTotal.toFixed(1)}M
                  </p>
                </div>

                <p ref={marketDescRef} className="text-sm text-slate-600 font-medium">
                  Pagas gastos de tener un inmueble
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* Scroll Area */}
        <div ref={scrollContainerRef} className="h-[900vh]" />
      </div>
    </section>
  );
}
