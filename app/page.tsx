"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const phases = [
  {
    month: "Inicio",
    habiHeadline: "Recibes la oferta de Habi",
    habiDescription:
      "Aceptas vender con cuotas fijas desde el primer día, sin trámites ni incertidumbre.",
    marketHeadline: "Mercado tradicional",
    marketDescription:
      "Inicias la publicación, pagas anuncios, y esperas a que llegue el primer interesado.",
  },
  {
    month: "Mes 1",
    habiHeadline: "Primera cuota garantizada",
    habiDescription:
      "El dinero empieza a entrar desde el mes uno y puedes planear con certeza.",
    marketHeadline: "Mostrando tu casa",
    marketDescription:
      "Coordinas visitas, ajustas el precio y sigues pagando administración y servicios.",
  },
  {
    month: "Mes 2",
    habiHeadline: "Segunda cuota a tiempo",
    habiDescription:
      "Habi deposita la segunda cuota sin retrasos ni costos adicionales.",
    marketHeadline: "Buscando comprador",
    marketDescription:
      "Aún sin una oferta formal, continúas cubriendo costos fijos del inmueble.",
  },
  {
    month: "Mes 3",
    habiHeadline: "Tercera cuota fija",
    habiDescription:
      "Tu flujo se mantiene estable mientras Habi gestiona todo el proceso legal.",
    marketHeadline: "Oferta en negociación",
    marketDescription:
      "Llegan propuestas por debajo del precio deseado, negocias y pierdes tiempo.",
  },
  {
    month: "Mes 4",
    habiHeadline: "Cuarta cuota",
    habiDescription:
      "Recibes el mismo valor acordado. Sin sorpresas, sin trámites bancarios.",
    marketHeadline: "Documentación y bancos",
    marketDescription:
      "El potencial comprador tramita su crédito; tú sigues pagando gastos mensuales.",
  },
  {
    month: "Mes 5",
    habiHeadline: "Quinta cuota",
    habiDescription:
      "Habi se encarga de las escrituras y avalúos, tú sigues recibiendo dinero.",
    marketHeadline: "Esperando aprobación",
    marketDescription:
      "El banco solicita documentos adicionales y el proceso se extiende.",
  },
  {
    month: "Mes 6",
    habiHeadline: "Sexta cuota",
    habiDescription:
      "Tu flujo suma más que una venta inmediata y mantienes tranquilidad financiera.",
    marketHeadline: "Gastos inesperados",
    marketDescription:
      "Surgen reparaciones y ajustes para mantener atractivo el inmueble.",
  },
  {
    month: "Mes 7",
    habiHeadline: "Séptima cuota",
    habiDescription:
      "Continúas recibiendo pagos fijos mientras el proceso está 100% controlado.",
    marketHeadline: "Aprobación en curso",
    marketDescription:
      "El comprador espera desembolso. Sigues sin recibir dinero y pagando servicios.",
  },
  {
    month: "Mes 8",
    habiHeadline: "Octava cuota",
    habiDescription:
      "Falta poco para completar el plan de cuotas con el valor superior pactado.",
    marketHeadline: "Revisión final",
    marketDescription:
      "La notaría programa firmas y se suman más gastos de certificaciones.",
  },
  {
    month: "Mes 9",
    habiHeadline: "Última cuota y cierre",
    habiDescription:
      "Terminas de recibir 105 millones asegurados, sin haber pagado costos adicionales.",
    marketHeadline: "Venta concreta",
    marketDescription:
      "Finalmente recibes 110 millones, pero durante 9 meses asumiste todos los egresos.",
  },
] as const;

// Habi: 100M dividido en 9 cuotas = 11.11M por mes
const habiMonthlyPayment = 100 / 9;
const habiPayments = Array(9).fill(habiMonthlyPayment);

// Mercado: gastos mensuales de 1.5M durante 9 meses, luego recibe 110M
const monthlyExpenses = 1.5;
const marketCosts = [
  ...Array(9).fill(-monthlyExpenses),
  110 // Venta final
];

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [habiAccumulated, setHabiAccumulated] = useState(0);
  const [marketAccumulated, setMarketAccumulated] = useState(0);
  const stepRefs = useRef<HTMLDivElement[]>([]);
  const stickyCardRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const habiCounterRef = useRef<HTMLDivElement>(null);
  const marketCounterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animación de entrada del header
      gsap.from("header > *", {
        opacity: 0,
        y: 30,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
      });

      // Animación del sticky card al inicio
      if (stickyCardRef.current) {
        gsap.from(stickyCardRef.current, {
          opacity: 0,
          scale: 0.95,
          duration: 1,
          delay: 0.5,
          ease: "power3.out",
        });
      }

      // ScrollTrigger para cada fase
      stepRefs.current.forEach((element, index) => {
        if (!element) return;

        ScrollTrigger.create({
          trigger: element,
          start: "top center",
          end: "bottom center",
          onEnter: () => {
            setActiveIndex(index);
            // Animación suave del contenido
            gsap.to(stickyCardRef.current, {
              scale: 1.02,
              duration: 0.3,
              ease: "power2.out",
              yoyo: true,
              repeat: 1,
            });
          },
          onEnterBack: () => setActiveIndex(index),
        });
      });
    });

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const cumulativeHabi = useMemo(() => {
    return habiPayments.reduce<number[]>((acc, value) => {
      const previous = acc.length > 0 ? acc[acc.length - 1] : 0;
      acc.push(previous + value);
      return acc;
    }, []);
  }, []);

  const cumulativeMarket = useMemo(() => {
    return marketCosts.reduce<number[]>((acc, value) => {
      const previous = acc.length > 0 ? acc[acc.length - 1] : 0;
      acc.push(previous + value);
      return acc;
    }, []);
  }, []);

  const showChart = activeIndex >= phases.length - 2;

  // Animar contadores cuando cambia el activeIndex
  useEffect(() => {
    const newHabiAccumulated = habiPayments.slice(0, activeIndex + 1).reduce((acc, val) => acc + val, 0);
    const newMarketAccumulated = marketCosts.slice(0, activeIndex + 1).reduce((acc, val) => acc + val, 0);

    // Animar contador de Habi
    gsap.to({ value: habiAccumulated }, {
      value: newHabiAccumulated,
      duration: 0.8,
      ease: "power2.out",
      onUpdate: function() {
        setHabiAccumulated(this.targets()[0].value);
      }
    });

    // Animar contador de Mercado
    gsap.to({ value: marketAccumulated }, {
      value: newMarketAccumulated,
      duration: 0.8,
      ease: "power2.out",
      onUpdate: function() {
        setMarketAccumulated(this.targets()[0].value);
      }
    });

    // Efecto de pulso en los contadores
    if (habiCounterRef.current) {
      gsap.fromTo(habiCounterRef.current, 
        { scale: 1 },
        { scale: 1.1, duration: 0.3, yoyo: true, repeat: 1, ease: "power2.inOut" }
      );
    }
    if (marketCounterRef.current) {
      gsap.fromTo(marketCounterRef.current,
        { scale: 1 },
        { scale: 1.1, duration: 0.3, yoyo: true, repeat: 1, ease: "power2.inOut" }
      );
    }
  }, [activeIndex]);

  useEffect(() => {
    if (showChart && chartRef.current) {
      gsap.fromTo(
        chartRef.current,
        {
          opacity: 0,
          y: 40,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
        }
      );

      // Animar líneas de la gráfica
      const lines = chartRef.current.querySelectorAll("line[stroke='#5a2dfa'], line[stroke='#ef4444']");
      gsap.fromTo(
        lines,
        { strokeDashoffset: 1000, strokeDasharray: 1000 },
        {
          strokeDashoffset: 0,
          duration: 1.5,
          ease: "power2.out",
          stagger: 0.05,
        }
      );
    }
  }, [showChart]);

  return (
    <section className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-white via-[#f6f2ff] to-[#d9dcff] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-20 md:px-12 lg:px-20">
        <header className="mx-auto max-w-3xl text-center md:max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#5a2dfa]/10 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-[#5a2dfa]">
            Nuevo producto Habi
          </div>
          <h1 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl md:text-5xl">
            Vende con cuotas fijas y olvídate del estrés del mercado tradicional
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-600 md:text-xl">
            Compara cómo evolucionan tus ingresos con Habi frente al mercado tradicional mientras avanzas por nuestra historia.
          </p>
        </header>

        <div className="relative mt-24">
          <div ref={stickyCardRef} className="sticky top-24 z-10 rounded-3xl border border-white/60 bg-white/90 p-8 shadow-2xl backdrop-blur-md">
            <div className="mb-8 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                {phases[activeIndex].month}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mb-8">
              {/* Contador Habi */}
              <div className="relative overflow-hidden rounded-2xl border-2 border-[#5a2dfa]/30 bg-gradient-to-br from-[#5a2dfa]/5 to-[#5a2dfa]/10 p-6 shadow-lg">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#5a2dfa] text-white font-bold text-lg">
                    H
                  </div>
                  <div className="text-left">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#5a2dfa]/80 font-semibold">Habi</p>
                    <p className="text-sm font-semibold text-slate-800">
                      {phases[activeIndex].habiHeadline}
                    </p>
                  </div>
                </div>
                
                <div ref={habiCounterRef} className="my-6">
                  <p className="text-sm text-slate-600 mb-1">Acumulado recibido:</p>
                  <p className="text-4xl font-bold text-[#5a2dfa]">
                    ${habiAccumulated.toFixed(1)}M
                  </p>
                  {activeIndex < 9 && (
                    <p className="text-sm text-slate-500 mt-2">
                      + ${habiMonthlyPayment.toFixed(1)}M este mes
                    </p>
                  )}
                </div>

                <p className="text-sm leading-relaxed text-slate-600">
                  {phases[activeIndex].habiDescription}
                </p>
              </div>

              {/* Contador Mercado */}
              <div className="relative overflow-hidden rounded-2xl border-2 border-red-200 bg-gradient-to-br from-red-50 to-red-100/50 p-6 shadow-lg">
                <div className="mb-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-red-700/80 font-semibold">Mercado Tradicional</p>
                  <p className="text-sm font-semibold text-slate-800 mt-1">
                    {phases[activeIndex].marketHeadline}
                  </p>
                </div>
                
                <div ref={marketCounterRef} className="my-6">
                  <p className="text-sm text-slate-600 mb-1">Resultado neto:</p>
                  <p className={`text-4xl font-bold ${marketAccumulated >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${marketAccumulated.toFixed(1)}M
                  </p>
                  {activeIndex < 9 ? (
                    <p className="text-sm text-red-600 mt-2">
                      - ${monthlyExpenses}M en gastos este mes
                    </p>
                  ) : (
                    <p className="text-sm text-green-600 mt-2">
                      + $110M de la venta - $13.5M en gastos = $96.5M neto
                    </p>
                  )}
                </div>

                <p className="text-sm leading-relaxed text-slate-600">
                  {phases[activeIndex].marketDescription}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/60 bg-slate-50/70 p-6 shadow-inner">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-3">
                Gastos del mercado tradicional:
              </p>
              <ul className="grid grid-cols-2 gap-3 text-sm text-slate-600">
                <li className={`${activeIndex >= 0 ? "opacity-100" : "opacity-40"} transition-opacity flex items-center gap-2`}>
                  <span className="text-red-500">•</span> Administración y servicios
                </li>
                <li className={`${activeIndex >= 2 ? "opacity-100" : "opacity-40"} transition-opacity flex items-center gap-2`}>
                  <span className="text-red-500">•</span> Reparaciones
                </li>
                <li className={`${activeIndex >= 4 ? "opacity-100" : "opacity-40"} transition-opacity flex items-center gap-2`}>
                  <span className="text-red-500">•</span> Certificados y avalúos
                </li>
                <li className={`${activeIndex >= 6 ? "opacity-100" : "opacity-40"} transition-opacity flex items-center gap-2`}>
                  <span className="text-red-500">•</span> Costos financieros
                </li>
              </ul>
              <p className="mt-4 text-sm font-semibold text-slate-700">
                Total gastos 9 meses: ~$13.5M ($1.5M/mes)
              </p>
            </div>

            <div ref={chartRef} className={`mt-12 grid gap-6 transition-all duration-700 md:grid-cols-2 ${showChart ? "opacity-100" : "opacity-0 translate-y-6"}`}>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">
                  Resultado final después de 9 meses
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Con Habi recibes <strong className="text-[#5a2dfa]">$100M</strong> en 9 cuotas fijas, sin gastos adicionales ni preocupaciones.
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  En el mercado tradicional recibes $110M por la venta, pero gastas <strong className="text-red-600">$13.5M</strong> en 9 meses ($1.5M/mes) = <strong className="text-green-600">$96.5M neto</strong>.
                </p>
                <div className="mt-6 rounded-xl bg-[#5a2dfa]/10 border-2 border-[#5a2dfa]/30 p-4">
                  <p className="text-lg font-bold text-[#5a2dfa]">
                    Habi te da $3.5M más + tranquilidad garantizada
                  </p>
                  <p className="text-sm text-slate-600 mt-1">
                    $100M Habi vs $96.5M Mercado tradicional
                  </p>
                </div>
              </div>
              <div className="relative flex items-center justify-center">
                <svg viewBox="0 0 320 200" className="h-48 w-full">
                  <defs>
                    <linearGradient id="lineHabi" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#5a2dfa" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#5a2dfa" stopOpacity="0.05" />
                    </linearGradient>
                    <linearGradient id="lineMarket" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>
                  <rect x="0" y="0" width="320" height="200" rx="18" ry="18" fill="white" opacity="0.9" />
                  <g transform="translate(40,20)">
                    <line x1="0" y1="150" x2="240" y2="150" stroke="#cbd5f5" strokeWidth="1" />
                    <line x1="0" y1="0" x2="0" y2="150" stroke="#cbd5f5" strokeWidth="1" />
                    {cumulativeHabi.map((value, index) => {
                      if (index === 0) return null;
                      const previous = cumulativeHabi[index - 1];
                      const x1 = ((index - 1) / (cumulativeHabi.length - 1)) * 240;
                      const x2 = (index / (cumulativeHabi.length - 1)) * 240;
                      const y1 = 150 - (previous / 120) * 150;
                      const y2 = 150 - (value / 120) * 150;
                      return (
                        <line
                          key={`habi-${index}`}
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke="#5a2dfa"
                          strokeWidth={3}
                          strokeLinecap="round"
                          className={`transition-all duration-500 ease-out ${showChart ? "opacity-100" : "opacity-0"}`}
                        />
                      );
                    })}
                    {cumulativeMarket.map((value, index) => {
                      if (index === 0) return null;
                      const previous = cumulativeMarket[index - 1];
                      const x1 = ((index - 1) / (cumulativeMarket.length - 1)) * 240;
                      const x2 = (index / (cumulativeMarket.length - 1)) * 240;
                      const y1 = 150 - (previous / 120) * 150;
                      const y2 = 150 - (value / 120) * 150;
                      return (
                        <line
                          key={`market-${index}`}
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke="#ef4444"
                          strokeWidth={3}
                          strokeLinecap="round"
                          className={`transition-all duration-500 ease-out ${showChart ? "opacity-80" : "opacity-0"}`}
                        />
                      );
                    })}
                    <text x="0" y="-6" className="fill-slate-400 text-xs">
                      Ingresos netos acumulados (millones)
                    </text>
                    <text x="170" y="170" className="fill-slate-400 text-xs">
                      Tiempo
                    </text>
                  </g>
                  <g transform="translate(50,20)" className={`transition-opacity duration-700 ${showChart ? "opacity-100" : "opacity-0"}`}>
                    <circle cx="0" cy="170" r="6" fill="#5a2dfa" />
                    <text x="12" y="174" className="fill-slate-500 text-xs font-semibold">
                      Habi $100M
                    </text>
                    <circle cx="120" cy="170" r="6" fill="#ef4444" />
                    <text x="132" y="174" className="fill-slate-500 text-xs font-semibold">
                      Mercado $96.5M
                    </text>
                  </g>
                </svg>
              </div>
            </div>
          </div>

          <div className="relative">
            {phases.map((phase, index) => (
              <div
                key={phase.month}
                ref={(element) => {
                  if (element) {
                    stepRefs.current[index] = element;
                  }
                }}
                className="h-[50vh]"
              >
                <div className="pointer-events-none absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
