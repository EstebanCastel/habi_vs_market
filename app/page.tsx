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
    if (month === months) return "¡Completaste el plan! Recibiste $100M en total sin gastos";
    return `Recibes la cuota ${month} de $${habiPerMonth.toFixed(1)}M`;
  };

  // Descripciones por mes para Mercado
  const getMarketDescription = (month: number) => {
    if (month <= 5) return "Buscando comprador. Pagas $0.8M en servicios públicos y administración";
    if (month === 6) return "¡Consigues comprador! Inicia estudio de títulos con el banco. Pagas $0.8M este mes";
    if (month < 9) return "Esperando aprobación bancaria. Sigues pagando $0.8M en servicios y administración";
    return `Venta completada: Recibes $${marketFinalSale}M - $${(months * marketExpensePerMonth).toFixed(1)}M gastos = $${marketTotal.toFixed(1)}M neto`;
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
          className="sticky top-8 bg-white rounded-3xl border-2 shadow-[0_10px_40px_-15px_rgba(116,0,194,0.3)] p-8 mb-8 transition-all duration-300"
          style={{ borderColor: "#8A00E6" }}>
          <div className="text-center mb-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
              Mes {progress}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Habi */}
            <div 
              ref={habiCardRef}
              className="relative overflow-hidden rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border-2"
              style={{ backgroundColor: "#F9F0FF", borderColor: "#8A00E6" }}>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-sm" style={{ backgroundColor: "#7400C2" }}>
                  H
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider font-black" style={{ color: "#7400C2" }}>
                    Habi
                  </p>
                  <p className="text-sm font-bold text-slate-800">
                    Plan 9 cuotas fijas
                  </p>
                </div>
              </div>

              <div ref={habiCounterRef} className="my-6">
                <p className="text-sm text-slate-700 mb-2 font-semibold">Acumulado recibido:</p>
                <p className="text-6xl font-black" style={{ color: "#7400C2" }}>
                  ${animatedHabiTotal.toFixed(1)}M
                </p>
                {progress < months && (
                  <div className="flex items-center gap-2 mt-3">
                    <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                    <p className="text-sm text-green-600 font-bold">
                      +${habiPerMonth.toFixed(1)}M este mes
                    </p>
                  </div>
                )}
              </div>

              <p 
                ref={habiDescRef}
                className="text-sm leading-relaxed text-slate-800 font-semibold bg-white rounded-lg p-3 border" style={{ borderColor: "#EACDFE" }}>
                {getHabiDescription(progress)}
              </p>
            </div>

            {/* Mercado */}
            <div 
              ref={marketCardRef}
              className="relative overflow-hidden bg-white border-2 border-slate-300 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              
              <div className="mb-4">
                <p className="text-xs uppercase tracking-wider text-slate-700 font-black">
                  Mercado Tradicional
                </p>
                <p className="text-sm font-bold text-slate-800 mt-1 flex items-center gap-2">
                  {progress < 6 && (
                    <>
                      <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                      Buscando comprador...
                    </>
                  )}
                  {progress === 6 && (
                    <>
                      <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#8A00E6" }}></span>
                      ¡Comprador encontrado!
                    </>
                  )}
                  {progress > 6 && progress < 9 && (
                    <>
                      <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#8A00E6" }}></span>
                      Trámites bancarios en proceso
                    </>
                  )}
                  {progress === 9 && (
                    <>
                      <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                      Venta completada
                    </>
                  )}
                </p>
              </div>

              <div ref={marketCounterRef} className="my-6">
                <p className="text-sm text-slate-700 mb-2 font-semibold">Resultado neto:</p>
                <p className={`text-6xl font-black ${marketTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${animatedMarketTotal.toFixed(1)}M
                </p>
                {progress < months && (
                  <div className="flex items-center gap-2 mt-3">
                    <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                    <p className="text-sm text-red-600 font-bold">
                      -${marketExpensePerMonth}M en gastos este mes
                    </p>
                  </div>
                )}
                {progress === months && (
                  <div className="flex items-center gap-2 mt-3">
                    <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                    <p className="text-sm text-green-600 font-bold">
                      +$110M de la venta - $7.2M gastos
                    </p>
                  </div>
                )}
              </div>

              <p 
                ref={marketDescRef}
                className="text-sm leading-relaxed text-slate-800 font-semibold bg-slate-50 rounded-lg p-3 border border-slate-200">
                {getMarketDescription(progress)}
              </p>
            </div>
          </div>

        </div>

        {/* Scroll Area */}
        <div ref={scrollContainerRef} className="h-[900vh]" />
      </div>
    </section>
  );
}
