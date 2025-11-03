"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import confetti from "canvas-confetti";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [progress, setProgress] = useState(1);
  const [animatedHabiTotal, setAnimatedHabiTotal] = useState(0);
  const [animatedMarketTotal, setAnimatedMarketTotal] = useState(0);
  const confettiDisparadoRef = useRef(false);
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
  const marketTotal = progress === months ? marketFinalSale : -(progress * marketExpensePerMonth);

  // Descripciones por mes para Habi
  const getHabiDescription = (month: number) => {
    if (month === months) return "Recibes tu última cuota fija";
    return "Recibes tu cuota fija";
  };

  // Descripciones por mes para Mercado
  const getMarketDescription = (month: number) => {
    if (month === 7) return "Comienzan los trámites del banco. Pagas gastos de tener un inmueble";
    if (month === 6) return "¡Consigues comprador! Pagas gastos de tener un inmueble";
    return "Pagas gastos de tener un inmueble";
  };

  // Función para disparar confetti
  const throwConfetti = () => {
    const count = 200;
    const defaults = {
      origin: { y: 0.3 },
      colors: ["#7400C2", "#8A00E6", "#EACDFE", "#F9F0FF", "#FFD700", "#FF69B4", "#00CED1"],
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  };

  // Disparar confetti cuando llegue al mes 6 (solo una vez)
  useEffect(() => {
    if (progress === 6 && !confettiDisparadoRef.current) {
      setTimeout(() => {
        throwConfetti();
        confettiDisparadoRef.current = true;
      }, 300);
    }
    // Resetear si baja del mes 6
    if (progress < 6) {
      confettiDisparadoRef.current = false;
    }
  }, [progress]);

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
              <p className="text-9xl font-black" style={{ color: "#7400C2" }}>
                {progress}
              </p>
            </div>

            {/* Cards - Derecha */}
            <div className="flex-1 grid md:grid-cols-2 gap-6">
              
              {/* Habi */}
              <div ref={habiCardRef} className="space-y-4 flex flex-col items-center">
                <p className="text-xs uppercase tracking-widest font-black text-center" style={{ color: "#7400C2" }}>
                  Habi
                </p>
                
                {/* Logo Habi - cambia en mes 1 */}
                <div className="py-2">
                  <Image 
                    src={progress === 1 ? "/mes1.png" : "/habi.png"}
                    alt="Habi" 
                    width={80} 
                    height={80}
                    className="object-contain"
                  />
                </div>
                
                <div ref={habiCounterRef}>
                  <p className="text-5xl font-black text-center" style={{ color: "#7400C2" }}>
                    ${animatedHabiTotal.toFixed(1)}M
                  </p>
                </div>

                <p ref={habiDescRef} className="text-sm text-slate-600 font-medium text-center">
                  {getHabiDescription(progress)}
                </p>
              </div>

              {/* Mercado */}
              <div ref={marketCardRef} className="space-y-4 flex flex-col items-center">
                <p className="text-xs uppercase tracking-widest font-black text-center text-slate-700">
                  Mercado tradicional
                </p>
                
                {/* Imagen Mercado / Comprador / Banco / Mes9 - cambia según el mes */}
                <div className="py-2">
                  {progress === 6 ? (
                    <Image 
                      src="/comprador.png" 
                      alt="Comprador" 
                      width={80} 
                      height={80}
                      className="object-contain"
                    />
                  ) : progress === 9 ? (
                    <Image 
                      src="/mes9.png" 
                      alt="Venta completada" 
                      width={80} 
                      height={80}
                      className="object-contain"
                    />
                  ) : progress >= 7 ? (
                    <Image 
                      src="/banco.png" 
                      alt="Banco" 
                      width={80} 
                      height={80}
                      className="object-contain"
                    />
                  ) : (
                    <Image 
                      src="/mercado.png" 
                      alt="Mercado" 
                      width={80} 
                      height={80}
                      className="object-contain"
                    />
                  )}
                </div>
                
                <div ref={marketCounterRef}>
                  <p className={`text-5xl font-black text-center ${marketTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${animatedMarketTotal.toFixed(1)}M
                  </p>
              </div>

                <p ref={marketDescRef} className="text-sm font-medium text-center">
                  {progress === 9 ? (
                    <>
                      <span className="text-slate-600">Recibes el valor que querías por la venta de tu inmueble pero...</span>
                      <br />
                      <span className="text-metallic-red text-base">Durante 8 meses tuviste gastos de $7.2M</span>
                    </>
                  ) : progress === 6 ? (
                    <>
                      <span className="text-metallic-purple text-lg">¡Consigues comprador!</span>
                      <br />
                      <span className="text-slate-600">Pagas gastos de tener un inmueble</span>
                    </>
                  ) : progress === 7 ? (
                    <>
                      <span className="text-metallic-purple text-lg">Comienzan los trámites del banco</span>
                      <br />
                      <span className="text-slate-600">Pagas gastos de tener un inmueble</span>
                    </>
                  ) : (
                    <span className="text-slate-600">{getMarketDescription(progress)}</span>
                  )}
                </p>
              </div>

            </div>
          </div>

          {/* Gráfica de Ingresos vs Egresos */}
          <div className="mt-8 pt-8 border-t border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Evolución financiera</p>
              
              {/* Leyenda */}
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#7400C2" }}></div>
                  <span className="text-xs font-semibold text-slate-700">Habi</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-xs font-semibold text-slate-700">Mercado</span>
                </div>
              </div>
            </div>
            
            <svg viewBox="0 0 800 320" className="w-full h-auto">
                  <defs>
                {/* Gradiente para área Habi */}
                <linearGradient id="habiGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: "#7400C2", stopOpacity: 0.2 }} />
                  <stop offset="100%" style={{ stopColor: "#7400C2", stopOpacity: 0.02 }} />
                    </linearGradient>
                
                {/* Gradiente para área Mercado */}
                <linearGradient id="marketGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: "#DC2626", stopOpacity: 0.1 }} />
                  <stop offset="100%" style={{ stopColor: "#DC2626", stopOpacity: 0.02 }} />
                    </linearGradient>
                  </defs>
              
              {/* Grid horizontal */}
              <line x1="60" y1="50" x2="760" y2="50" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="60" y1="110" x2="760" y2="110" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="60" y1="170" x2="760" y2="170" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="60" y1="230" x2="760" y2="230" stroke="#F1F5F9" strokeWidth="1" />
              
              {/* Eje X (línea $0) */}
              <line x1="60" y1="280" x2="760" y2="280" stroke="#94A3B8" strokeWidth="2" />
              
              {/* Labels Eje Y */}
              <text x="45" y="55" textAnchor="end" fontSize="12" fill="#64748B" fontWeight="600">$110M</text>
              <text x="45" y="115" textAnchor="end" fontSize="12" fill="#64748B" fontWeight="600">$80M</text>
              <text x="45" y="175" textAnchor="end" fontSize="12" fill="#64748B" fontWeight="600">$50M</text>
              <text x="45" y="235" textAnchor="end" fontSize="12" fill="#64748B" fontWeight="600">$20M</text>
              <text x="45" y="285" textAnchor="end" fontSize="12" fill="#64748B" fontWeight="700">$0</text>
              
              {/* Labels Eje X (Meses) */}
              {[...Array(9)].map((_, i) => {
                const x = 60 + ((i + 1) * (700 / 9));
                      return (
                  <text key={`month-${i}`} x={x} y="305" textAnchor="middle" fontSize="13" fill="#475569" fontWeight="600">
                    M{i + 1}
                  </text>
                      );
                    })}
              
              {/* Área de relleno Habi */}
              {progress > 0 && (
                <polygon
                  points={`60,280 ${[...Array(Math.min(progress, 9))].map((_, i) => {
                    const month = i + 1;
                    const x = 60 + (month * (700 / 9));
                    const value = month * habiPerMonth;
                    const y = 280 - (value / 110) * 230;
                    return `${x},${y}`;
                  }).join(' ')} ${60 + (Math.min(progress, 9) * (700 / 9))},280`}
                  fill="url(#habiGradient)"
                />
              )}
              
              {/* Línea Habi (morado) */}
              {progress > 0 && (
                <polyline
                  points={[...Array(Math.min(progress, 9))].map((_, i) => {
                    const month = i + 1;
                    const x = 60 + (month * (700 / 9));
                    const value = month * habiPerMonth;
                    const y = 280 - (value / 110) * 230;
                    return `${x},${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#7400C2"
                  strokeWidth="4"
                          strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
              
              {/* Puntos y valores Habi */}
              {[...Array(Math.min(progress, 9))].map((_, i) => {
                const month = i + 1;
                const x = 60 + (month * (700 / 9));
                const value = month * habiPerMonth;
                const y = 280 - (value / 110) * 230;
                const isCurrentMonth = month === progress;
                
                return (
                  <g key={`habi-point-${i}`}>
                    {/* Punto */}
                    <circle cx={x} cy={y} r={isCurrentMonth ? 8 : 6} fill="white" stroke="#7400C2" strokeWidth="3" />
                    <circle cx={x} cy={y} r={isCurrentMonth ? 4 : 3} fill="#7400C2" />
                    
                    {/* Valor en el punto actual */}
                    {isCurrentMonth && (
                      <>
                        <rect x={month === 9 ? x + 5 : x - 35} y={month === 9 ? y + 25 : y + 11} width="70" height="24" rx="4" fill="#7400C2" />
                        <text x={month === 9 ? x + 40 : x} y={month === 9 ? y + 43 : y + 29} textAnchor="middle" fontSize="12" fill="white" fontWeight="700">
                          ${value.toFixed(1)}M
                    </text>
                      </>
                    )}
                  </g>
                );
              })}
              
              {/* Línea Mercado - Parte Roja (Meses 1-8 o hasta el progress actual) */}
              {progress > 0 && (
                <polyline
                  points={[...Array(Math.min(progress, 8))].map((_, i) => {
                    const month = i + 1;
                    const x = 60 + (month * (700 / 9));
                    const value = 0; // Gastos, se queda en 0
                    const y = 280 - (value / 110) * 230;
                    return `${x},${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#DC2626"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="8 4"
                />
              )}
              
              {/* Línea Mercado - Parte Verde (Solo del mes 8 al mes 9) */}
              {progress === 9 && (
                <polyline
                  points={(() => {
                    const points = [];
                    // Mes 8
                    const x8 = 60 + (8 * (700 / 9));
                    const y8 = 280;
                    points.push(`${x8},${y8}`);
                    
                    // Mes 9
                    const x9 = 60 + (9 * (700 / 9));
                    const value9 = marketFinalSale;
                    const y9 = 280 - (value9 / 110) * 230;
                    points.push(`${x9},${y9}`);
                    
                    return points.join(' ');
                  })()}
                  fill="none"
                  stroke="#16A34A"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
              
              {/* Puntos Mercado */}
              {[...Array(Math.min(progress, 9))].map((_, i) => {
                const month = i + 1;
                const x = 60 + (month * (700 / 9));
                let value;
                if (month === 9) {
                  value = marketFinalSale;
                } else {
                  value = 0;
                }
                const y = 280 - (value / 110) * 230;
                const color = month === 9 ? "#16A34A" : "#DC2626";
                const isCurrentMonth = month === progress;
                
                return (
                  <g key={`market-point-${i}`}>
                    {/* Punto */}
                    <circle cx={x} cy={y} r={isCurrentMonth ? 8 : 6} fill="white" stroke={color} strokeWidth="3" />
                    <circle cx={x} cy={y} r={isCurrentMonth ? 4 : 3} fill={color} />
                    
                    {/* Valor en el punto actual */}
                    {isCurrentMonth && (
                      <>
                        <rect x={x - 35} y={month === 9 ? y - 45 : y + 11} width="70" height="24" rx="4" fill={color} />
                        <text x={x} y={month === 9 ? y - 27 : y + 29} textAnchor="middle" fontSize="12" fill="white" fontWeight="700">
                          {month === 9 ? `$${value.toFixed(1)}M` : `-$${(month * marketExpensePerMonth).toFixed(1)}M`}
                    </text>
                      </>
                    )}
                  </g>
                );
              })}
                </svg>
          </div>

        </div>

        {/* Scroll Area */}
        <div ref={scrollContainerRef} className="h-[900vh]" />
      </div>
    </section>
  );
}
