# 💰 Finanzas Personales | "Págate a ti primero"

Sistema personal de gestión presupuestaria, metas de ahorro obligatorias y control de flujo mensual en USD ($). Construido con Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4 y Supabase.

---

## 🌟 Características Principales

1. **Filosofía "Págate a ti primero":**  
   Al comenzar cada ciclo mensual, las cuotas de las metas de ahorro se retienen inmediatamente como un compromiso obligatorio antes de calcular los gastos variables.
2. **Flujo en Cascada:**  
   $$\text{Remanente Real} = (\text{Ingresos Fijos} + \text{Extras}) - \text{Metas de Ahorro} - \text{Gastos Fijos} - \text{Variables}$$
3. **Persistencia Híbrida Inteligente:**  
   - Funciona sin configuración con un almacén local precargado con datos de prueba realistas ($900 USD de ingresos base y $600 USD distribuidos en rubros).
   - Se conecta automáticamente a Supabase en cuanto se proveen las variables de entorno.
4. **Captura Ultrarrápida (<5 seg):**  
   Drawer modal optimizado para registrar movimientos diarios al instante desde cualquier vista.
5. **Semáforo de Presupuesto:**  
   Alertas automáticas por categoría: Verde (<80%), Advertencia (80-100%), Crítico (>100%).
6. **Visualización Interactiva:**  
   Gráficos en cascada con Recharts y navegación moderna por pestañas (*Tabs*).

---

## 🚀 Despliegue a Producción (Vercel o Netlify)

### 1. Variables de Entorno
Crea un proyecto en [Supabase](https://supabase.com), ejecuta el script SQL de `supabase/schema.sql` en el SQL Editor y configura en tu plataforma de hosting (Vercel/Netlify):

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-de-supabase
```

### 2. Comandos de Verificación Local
```bash
# Análisis estático de tipos
npx tsc --noEmit

# Linter
npm run lint

# Compilación de producción
npm run build
```

---

## 🛡️ Reglas de Desarrollo
- Moneda 100% en Dólares Estadounidenses (USD - `$`).
- Verificación estricta vía terminal sin navegadores automatizados.
