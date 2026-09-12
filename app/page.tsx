import { 
  PiggyBank, 
  Database, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Layers, 
  DollarSign, 
  CalendarClock,
  Sparkles,
  Workflow
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Encabezado Principal */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-border/40">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <PiggyBank className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                Finanzas Personales
              </h1>
              <p className="text-sm text-muted-foreground">
                Filosofía <span className="text-emerald-400 font-medium">"Págate a ti primero"</span> • 100% en USD
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 px-3 py-1">
            <ShieldCheck className="h-3.5 w-3.5 mr-1.5" />
            Paso 1: Setup y Tipos Completados
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            <DollarSign className="h-3.5 w-3.5 mr-1 text-emerald-400" />
            USD
          </Badge>
        </div>
      </header>

      {/* Tarjeta de Filosofía y Flujo en Cascada */}
      <Card className="border-emerald-500/20 bg-gradient-to-r from-emerald-950/20 via-background to-background">
        <CardHeader>
          <div className="flex items-center gap-2 text-emerald-400">
            <Workflow className="h-5 w-5" />
            <CardTitle className="text-lg">Regla de Negocio: Flujo en Cascada</CardTitle>
          </div>
          <CardDescription>
            Al iniciar el mes, el ahorro de las metas no se negocia: se retiene antes de calcular los gastos variables.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-lg bg-card/60 border border-border">
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">1. Ingresos</span>
              <p className="text-base font-semibold text-emerald-400 mt-1">Fijos + Extras</p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
              <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">2. Ahorro Obligatorio</span>
              <p className="text-base font-semibold text-emerald-300 mt-1">Cuotas de Metas</p>
            </div>
            <div className="p-3 rounded-lg bg-card/60 border border-border">
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">3. Fijos del Mes</span>
              <p className="text-base font-semibold text-blue-400 mt-1">Vivienda, Servicios</p>
            </div>
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">4. Remanente Real</span>
              <p className="text-base font-semibold text-amber-300 mt-1">Para Gastos Variables</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid de Estado de la Arquitectura */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Modelo de Datos */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Database className="h-5 w-5 text-emerald-400" />
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
            <CardTitle className="text-base mt-2">Modelo de Datos Supabase</CardTitle>
            <CardDescription>4 tablas fuertemente tipadas en TypeScript</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-border/50">
              <code className="text-foreground">savings_goals</code>
              <Badge variant="outline" className="text-[10px]">Corto/Med/Largo</Badge>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-border/50">
              <code className="text-foreground">categories</code>
              <Badge variant="outline" className="text-[10px]">Límites y Semáforos</Badge>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-border/50">
              <code className="text-foreground">recurring_templates</code>
              <Badge variant="outline" className="text-[10px]">Persistencia Mensual</Badge>
            </div>
            <div className="flex items-center justify-between py-1">
              <code className="text-foreground">transactions</code>
              <Badge variant="outline" className="text-[10px]">Movimientos / Extras</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Cliente Supabase & Entorno */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
            <CardTitle className="text-base mt-2">Conexión Supabase</CardTitle>
            <CardDescription>Cliente configurado con fallback resiliente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs text-muted-foreground">
            <p>
              Cliente singleton disponible en <code className="text-foreground font-mono bg-muted/60 px-1 py-0.5 rounded">lib/supabase.ts</code> parametrizado con el tipo de esquema <code className="text-foreground font-mono bg-muted/60 px-1 py-0.5 rounded">Database</code>.
            </p>
            <div className="rounded-md bg-muted/40 p-2.5 border border-border/50 text-[11px] font-mono space-y-1">
              <div className="text-foreground">NEXT_PUBLIC_SUPABASE_URL</div>
              <div className="text-foreground">NEXT_PUBLIC_SUPABASE_ANON_KEY</div>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Componentes UI & Estilos */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Layers className="h-5 w-5 text-emerald-400" />
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
            <CardTitle className="text-base mt-2">Componentes UI Listos</CardTitle>
            <CardDescription>shadcn/ui + Tailwind CSS v4</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="secondary">Card</Badge>
              <Badge variant="secondary">Progress</Badge>
              <Badge variant="secondary">Dialog</Badge>
              <Badge variant="secondary">Badge</Badge>
              <Badge variant="secondary">Button</Badge>
              <Badge variant="secondary">Input</Badge>
              <Badge variant="secondary">Label</Badge>
              <Badge variant="secondary">Select</Badge>
              <Badge variant="secondary">Tabs</Badge>
            </div>
            <p className="text-muted-foreground text-[11px] pt-2">
              Instalados y listos para construir los formularios y paneles del Paso 2.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Banner del Siguiente Paso: Paso 2 */}
      <div className="rounded-xl border border-border bg-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-emerald-400" />
            <span className="font-semibold text-foreground">Siguiente Fase: Paso 2</span>
            <Badge variant="outline" className="text-xs">Listo para iniciar</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Módulo de Metas de Ahorro (corto, mediano y largo plazo) y Configuración de Plantillas Recurrentes con persistencia mensual.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="default" className="gap-2 bg-emerald-600 hover:bg-emerald-500 text-white">
            <Sparkles className="h-4 w-4" />
            Continuar al Paso 2
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </main>
  );
}
