/* =========================================================
   AXION QUANT — BASE DE DATOS DEL CATÁLOGO Y MERCADOS
   Archivo: data.js
========================================================= */

// 1. ACTIVOS PARA EL TICKER EN VIVO
const MARKET_TICKERS = [
  { symbol: "SPX500", price: "5,984.20", change: "+0.84%", up: true },
  { symbol: "NDX100", price: "21,142.55", change: "+1.32%", up: true },
  { symbol: "USD/MXN", price: "19.1840", change: "-0.41%", up: false },
  { symbol: "IPC BMV", price: "54,810.10", change: "+0.62%", up: true },
  { symbol: "NVDA", price: "148.65", change: "+2.94%", up: true },
  { symbol: "AMD", price: "162.30", change: "+1.18%", up: true },
  { symbol: "MSFT", price: "438.90", change: "+0.45%", up: true },
  { symbol: "BTC/USD", price: "96,420.00", change: "+3.15%", up: true },
  { symbol: "XAU/USD", price: "2,695.40", change: "-0.22%", up: false },
  { symbol: "US10Y", price: "4.31%", change: "-0.04%", up: false }
];

// 2. ETIQUETAS DE CATEGORÍAS
const CATEGORY_LABELS = {
  algoritmos: "Algoritmos & Bots",
  membresias: "Membresías",
  educacion: "Formación",
  herramientas: "Indicadores & Guías"
};

// 3. CUPONES DE DESCUENTO DISPONIBLES
const COUPONS = {
  AXION10: {
    discount: 0.10,
    label: "Descuento de bienvenida (10%)"
  },
  QUANT20: {
    discount: 0.20,
    label: "Acceso VIP Institucional (20%)"
  }
};

// 4. CATÁLOGO DE PRODUCTOS Y SERVICIOS
const PRODUCTS = [
  {
    id: "ax-bot-sentinel",
    title: "Sentinel FX & Indices Bot v4.2",
    category: "algoritmos",
    price: 289.00,
    oldPrice: 360.00,
    rating: 4.9,
    reviews: 184,
    badge: "Bestseller",
    badgeType: "emerald",
    featured: true,
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=900&q=80",
    shortDesc: "Motor de ejecución algorítmica para MetaTrader 5 y cTrader basado en ruptura de volatilidad y control estricto de drawdown.",
    fullDesc: "Sentinel v4.2 ejecuta entradas automatizadas en sesiones de Nueva York y Londres filtrando eventos macroeconómicos de alto impacto. Incluye protección automática de capital diario y cálculo dinámico de lotaje según tu balance.",
    specs: ["MT5 / cTrader", "Licencia Perpetua", "Drawdown < 4.5%"],
    features: [
      "Código compilado + archivo de configuración para US30, NAS100 y EUR/USD",
      "Filtro automático de noticias de la Reserva Federal (FOMC / CPI)",
      "Módulo de gestión de riesgo dinámico (0.25% a 2% por operación)",
      "Actualizaciones gratuitas de por vida y soporte de instalación en VPS"
    ]
  },
  {
    id: "ax-mem-desk",
    title: "Membresía Axion Live Desk (Trimestral)",
    category: "membresias",
    price: 179.00,
    oldPrice: 225.00,
    rating: 4.9,
    reviews: 312,
    badge: "Institucional",
    badgeType: "gold",
    featured: true,
    image: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&w=900&q=80",
    shortDesc: "Acceso diario a nuestra mesa de análisis en vivo, niveles institucionales pre-mercado y alertas cuantitativas en Discord.",
    fullDesc: "Opera acompañado por analistas cuantitativos cada mañana antes de la apertura de Wall Street. Recibe mapas de liquidez en S&P 500, Nasdaq, USD/MXN y acciones tecnológicas líderes, más reportes macro semanales.",
    specs: ["Sesiones NY Live", "Discord Privado", "90 Días"],
    features: [
      "Transmisión en vivo Lun-Vie de 08:00 a 10:30 AM (Hora CDMX / NY)",
      "Alertas verificadas de setups con entrada, stop loss y ratio R:R",
      "Reporte dominical de contexto macro, tasas y flujos de opciones",
      "Bitácora auditable de todas las operaciones tomadas en la sala"
    ]
  },
  {
    id: "ax-ind-liquidity",
    title: "Indicador Liquidity Pulse V4 (TradingView)",
    category: "herramientas",
    price: 119.00,
    oldPrice: 149.00,
    rating: 4.8,
    reviews: 249,
    badge: "Top Ventas",
    badgeType: "emerald",
    featured: true,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
    shortDesc: "Suite en Pine Script v5 que detecta zonas de acumulación institucional, desequilibrios de volumen y divergencias de flujo.",
    fullDesc: "Diseñado para eliminar el ruido visual en tus gráficos. Liquidity Pulse mapea en tiempo real los bloques de órdenes relevantes, calcula perfiles de volumen por sesión y dispara alertas directas a tu celular o webhook.",
    specs: ["Pine Script v5", "Sin Repintado", "Multi-Activo"],
    features: [
      "Compatible con la cuenta gratuita y Pro de TradingView",
      "Algoritmo 100% libre de repintado en cierres de vela",
      "Panel HUD en pantalla con sesgo multi-temporalidad (M5 a D1)",
      "Incluye plantillas optimizadas para acciones, futuros y forex"
    ]
  },
  {
    id: "ax-bot-alpha-py",
    title: "Alpha-7 Python Quant Framework",
    category: "algoritmos",
    price: 349.00,
    oldPrice: 420.00,
    rating: 5.0,
    reviews: 76,
    badge: "Código Fuente",
    badgeType: "gold",
    featured: true,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=900&q=80",
    shortDesc: "Repositorio profesional en Python para backtesting vectorizado, simulaciones Monte Carlo y conexión vía API con brokers.",
    fullDesc: "Construye, valida y despliega tus propias estrategias sin depender de cajas negras. Incluye scripts listos para evaluar Sharpe Ratio, Sortino, VaR y optimización Walk-Forward en minutos.",
    specs: ["Python 3.12", "API Ready", "Monte Carlo"],
    features: [
      "Código fuente abierto 100% documentado (Pandas, NumPy, VectorBT)",
      "Conectores preconfigurados para Interactive Brokers, Alpaca y Binance",
      "Módulo de pruebas de estrés Monte Carlo con 10,000 iteraciones",
      "3 estrategias base auditadas listas para clonar y modificar"
    ]
  },
  {
    id: "ax-edu-master",
    title: "Programa: Ingeniería de Portafolios & Riesgo",
    category: "educacion",
    price: 215.00,
    oldPrice: 270.00,
    rating: 4.9,
    reviews: 143,
    badge: "Certificado",
    badgeType: "emerald",
    featured: false,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80",
    shortDesc: "Formación rigurosa en matemáticas financieras, valoración de riesgo, cobertura con opciones y balanceo entre renta fija y variable.",
    fullDesc: "Olvida los cursos básicos de patrones de velas. Aprende a estructurar capital como un desk profesional combinando bonos gubernamentales, ETFs indexados, acciones de crecimiento y gestión cuantitativa del riesgo.",
    specs: ["36 Horas HD", "Excel & Python", "Acceso Vitalicio"],
    features: [
      "8 módulos prácticos desde probabilidad aplicada hasta modelos Markowitz",
      "Plantillas profesionales de control de portafolio y cálculo de VaR",
      "Casos reales de cobertura cambiaria (USD/MXN) y tasas de interés",
      "Certificado digital verificable emitido por AXION QUANT Labs"
    ]
  },
  {
    id: "ax-mem-mentor",
    title: "Mentoría 1 a 1: Auditoría de Estrategia",
    category: "membresias",
    price: 240.00,
    oldPrice: null,
    rating: 5.0,
    reviews: 58,
    badge: "Cupo Limitado",
    badgeType: "gold",
    featured: false,
    image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=900&q=80",
    shortDesc: "4 sesiones privadas por videollamada para auditar tu historial de trades, corregir fugas de riesgo y profesionalizar tu plan.",
    fullDesc: "Analizamos estadísticamente tus últimas 100 operaciones para identificar horarios tóxicos, sesgos de ejecución y dimensionamiento incorrecto. Sales con un manual operativo cuantificado a tu perfil.",
    specs: ["4 Sesiones 1:1", "Auditoría Real", "Plan a Medida"],
    features: [
      "Revisión completa de métricas: Profit Factor, Expectancy y Drawdown",
      "Diseño personalizado de reglas de entrada, salida y gestión de racha",
      "Seguimiento directo por canal privado durante 30 días",
      "Grabación en HD de todas las sesiones para repaso"
    ]
  },
  {
    id: "ax-edu-options",
    title: "Manual Cuantitativo de Opciones y Griegas",
    category: "herramientas",
    price: 49.00,
    oldPrice: 69.00,
    rating: 4.8,
    reviews: 410,
    badge: "E-Book + Sheets",
    badgeType: "emerald",
    featured: false,
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80",
    shortDesc: "Guía técnica de 260 páginas sobre Delta, Gamma, Theta, volatilidad implícita y estrategias de cobertura en acciones de EE. UU.",
    fullDesc: "Escrito en lenguaje claro pero matemáticamente preciso. Explica paso a paso cómo utilizar spreads, iron condors y coberturas protectoras sin caer en errores de apalancamiento.",
    specs: ["PDF 260 Págs", "Calculadora Black-Scholes", "Descarga Inmediata"],
    features: [
      "Edición digital en alta resolución compatible con tablet y escritorio",
      "Hoja de cálculo automatizada de modelo Black-Scholes y Griegas",
      "Ejemplos paso a paso en NVDA, SPY, AAPL y QQQ",
      "Checklist imprimible de validación antes de abrir cada contrato"
    ]
  },
  {
    id: "ax-ind-journal",
    title: "Axion Edge Journal Pro (Notion + Excel)",
    category: "educacion",
    price: 39.00,
    oldPrice: 55.00,
    rating: 4.7,
    reviews: 295,
    badge: "Esencial",
    badgeType: "emerald",
    featured: false,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
    shortDesc: "Sistema automatizado de bitácora estadística que calcula tu esperanza matemática, curva de capital y rendimiento por horario.",
    fullDesc: "Lo que no se mide no se puede optimizar. Registra tus operaciones en segundos y obtén tableros automáticos que te muestran exactamente qué activo, sesión y setup te generan dinero real.",
    specs: ["Notion + XLSX", "KPIs Automáticos", "Tutorial Incluido"],
    features: [
      "Dashboard visual con curvas de equity, winrate y ratio riesgo/beneficio",
      "Etiquetado emocional y de errores operativos para corregir disciplina",
      "Cálculo automático de tamaño de posición según stop loss",
      "Compatible con cuentas fondeadas (Prop Firms) y brokers personales"
    ]
  }
];
