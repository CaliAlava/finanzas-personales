# 📘 CONTEXTO GENERAL DEL PROYECTO: FINANZAS PERSONALES

> **Documento de Contexto Activo y Evolutivo**  
> Este archivo contiene la arquitectura completa, reglas de negocio, modelo de datos, roadmap y estado actual del proyecto. Se actualiza de forma obligatoria tras cada fase o cambio significativo.

---

## 1. REGLAS FUNDAMENTALES Y POLÍTICAS DEL PROYECTO
1. **Verificación sin Explorador Web:**  
   - **ESTRICTAMENTE PROHIBIDO** abrir el navegador para pruebas automatizadas o tomar capturas de pantalla (`browser_subagent` o apertura de ventanas).
   - Toda validación se realiza exclusivamente vía terminal, compilación estática (`npm run build`), análisis de tipos (`tsc --noEmit`), linter (`npm run lint`) y scripts de verificación.
2. **Actualización Continua del Contexto:**  
   - Este archivo (`PROJECT_CONTEXT.md`) se mantiene sincronizado tras cada paso completado, documentando decisiones de diseño, archivos creados/modificados y el estado de avance.
3. **Moneda y Formato:**  
   - 100% en Dólares Estadounidenses (USD - `$`). Utilizar siempre los formateadores centralizados de `lib/utils.ts` (`formatUSD`).
4. **Acceso y Audiencia:**  
   - Aplicación de uso personal directo (single-user), optimizada para desktop y móvil.

---

## 2. FILOSOFÍA FINANCIERA Y REGLAS DE NEGOCIO
- **"Págate a ti primero" (Pay Yourself First):**  
  Al comenzar cada ciclo mensual, las cuotas de ahorro de las metas se apartan inmediatamente como un **gasto obligatorio no negociable**.
- **Flujo en Cascada:**  
  $$\text{Saldo Disponible para Variables} = (\text{Ingresos Fijos} + \text{Ingresos Extras}) - \text{Cuotas Obligatorias de Metas} - \text{Gastos Fijos Recurrentes}$$
- **Persistencia de Recurrentes:**  
  Las plantillas de ingresos y gastos fijos persisten automáticamente mes a mes sin requerir recreación manual.
- **Semáforo y Alertas de Presupuesto por Categoría:**  
  - **Normal (Verde):** Consumo $< 80\%$ del límite mensual.
  - **Advertencia (Amarillo):** Consumo $\ge 80\%$ y $\le 100\%$.
  - **Crítico (Rojo):** Consumo $> 100\%$ del límite mensual.

---

## 3. STACK TECNOLÓGICO Y DEPENDENCIAS
- **Framework:** Next.js 16 (App Router) + TypeScript 5.
- **Estilos:** Tailwind CSS v4 con paleta oklch, soporte dark mode y utilidades de animación (`tw-animate-css`).
- **Componentes UI:** shadcn/ui (estilo base-nova) con iconos de `lucide-react`.
  - Componentes instalados en `components/ui/`: `button`, `card`, `badge`, `dialog`, `progress`, `input`, `label`, `select`, `tabs`.
- **Visualización de Datos:** `recharts` instalado para gráficos de flujo mensual y distribución por plazos.
- **Persistencia / Base de Datos:** Supabase (`@supabase/supabase-js`) con tipado estricto `Database`.

---

## 4. MODELO DE DATOS Y DEFINICIONES SQL
El esquema se encuentra definido en `supabase/schema.sql` y mapeado en `types/database.types.ts`:

1. `savings_goals` (Metas de Ahorro):
   - `id`: UUID (PK)
   - `name`: TEXT
   - `target_amount`: NUMERIC(12, 2)
   - `current_amount`: NUMERIC(12, 2) (Default 0.00)
   - `monthly_quota`: NUMERIC(12, 2) (Cuota obligatoria mensual)
   - `term_type`: TEXT ('short' | 'medium' | 'long')
   - `deadline`: DATE (Opcional)
   - `color`: TEXT (Default '#10b981')
   - `created_at`: TIMESTAMPTZ

2. `categories` (Categorías de Clasificación):
   - `id`: UUID (PK)
   - `name`: TEXT
   - `type`: TEXT ('income' | 'fixed_expense' | 'variable_expense')
   - `monthly_budget_limit`: NUMERIC(12, 2) (Límite mensual para variables)
   - `color`: TEXT
   - `icon`: TEXT (Nombre de icono Lucide)
   - `created_at`: TIMESTAMPTZ

3. `recurring_templates` (Plantillas de Fijos Recurrentes):
   - `id`: UUID (PK)
   - `category_id`: UUID (FK -> categories.id)
   - `name`: TEXT
   - `amount`: NUMERIC(12, 2)
   - `type`: TEXT ('income' | 'fixed_expense')
   - `day_of_month`: INTEGER (1 - 31)
   - `is_active`: BOOLEAN (Default true)
   - `created_at`: TIMESTAMPTZ

4. `transactions` (Movimientos y Gastos Diarios / Extras):
   - `id`: UUID (PK)
   - `category_id`: UUID (FK -> categories.id, Nullable si va directo a meta)
   - `goal_id`: UUID (FK -> savings_goals.id, Nullable si es gasto regular)
   - `description`: TEXT
   - `amount`: NUMERIC(12, 2)
   - `date`: DATE (Default CURRENT_DATE)
   - `is_extra`: BOOLEAN (Indica si es ingreso o gasto no planificado)
   - `created_at`: TIMESTAMPTZ

---

## 5. ESTRUCTURA DEL PROYECTO
```
├── app/
│   ├── globals.css          # Estilos globales, variables CSS y dark mode
│   ├── layout.tsx           # Shell raíz con metadatos y dark mode activo
│   └── page.tsx             # Vista inicial de estado y bienvenida arquitectónica
├── components/
│   ├── dashboard/           # Componentes del dashboard (Paso 5)
│   ├── forms/               # Formularios modales y drawers (Pasos 2 y 3)
│   └── ui/                  # Componentes base shadcn (button, card, dialog, etc.)
├── hooks/                   # Custom hooks de cálculo financiero y datos (Paso 4)
├── lib/
│   ├── supabase.ts          # Cliente singleton tipado con fallback resiliente
│   └── utils.ts             # Función cn() y formateadores formatUSD(), formatPercentage()
├── supabase/
│   └── schema.sql           # DDL completo con índices y categorías semilla
├── types/
│   └── database.types.ts    # Tipos TypeScript exactos y modelos de flujo financiero
├── .env.local               # Configuración local de Supabase
├── .env.local.example       # Plantilla de variables de entorno
├── components.json          # Configuración del CLI de shadcn
├── package.json             # Dependencias y scripts
└── PROJECT_CONTEXT.md       # Contexto activo del programa y reglas
```

---

## 6. ROADMAP Y ESTADO DE EJECUCIÓN

| Paso | Descripción | Estado |
|---|---|---|
| **Paso 1** | Setup, Tipos de Datos y Cliente de Supabase | 🟢 Completado |
| **Paso 2** | Módulo de Metas de Ahorro y Configuración de Recurrentes | 🟡 Siguiente Paso |
| **Paso 3** | Captura Rápida de Gastos Diarios e Ingresos Extras | ⚪ Pendiente |
| **Paso 4** | Motor de Cálculo Financiero y Lógica de Alertas | ⚪ Pendiente |
| **Paso 5** | Dashboard Principal Altamente Visual y Didáctico | ⚪ Pendiente |
| **Paso 6** | Pulido de UX, Dark Mode y Testing de Flujos | ⚪ Pendiente |

---

## 7. REGISTRO HISTÓRICO DE CAMBIOS (CHANGELOG)
- **2026-09-12 (Paso 1 - Completado):**
  - Inicialización completa del proyecto Next.js 16 con TypeScript y Tailwind CSS v4.
  - Regla de oro documentada: **Prohibición de abrir explorador web para pruebas o capturas.**
  - Generación de `types/database.types.ts` con definiciones de `savings_goals`, `categories`, `recurring_templates`, `transactions` y modelos auxiliares para el cálculo en cascada.
  - Creación del cliente resiliente `lib/supabase.ts` y archivos `.env.local` / `.env.local.example`.
  - Instalación y configuración de shadcn/ui con los componentes `card`, `progress`, `dialog`, `badge`, `button`, `input`, `label`, `select`, `tabs`.
  - Creación del esquema SQL relacional en `supabase/schema.sql` con claves foráneas, índices de rendimiento y semillas para 11 categorías estándar.
  - Verificación exitosa de compilación estática vía consola con `npm run build` (0 errores).
