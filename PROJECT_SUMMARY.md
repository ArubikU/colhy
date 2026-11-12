# ColhyAI - Plataforma de Cotizaciones Inteligentes

## 🎯 Descripción General
ColhyAI es una plataforma B2B moderna que permite a consultores y clientes generar cotizaciones profesionales y equilibradas usando inteligencia artificial. Diseñada con un estilo glossy y moderno, ofrece características avanzadas de edición en tiempo real.

## 🎨 Diseño Visual
- **Tema**: Glossy y moderno con gradientes suaves
- **Colores principales**: Azul (#2563eb), Cian (#0891b2), con fondos translúcidos (backdrop-blur)
- **Efectos**: Glassmorphism, bordes suaves, sombras elegantes
- **Navegación**: Fixed navbar translúcida, smooth scrolling

## 🚀 Características Principales

### 1. **Autenticación y Gestión de Usuarios**
- Signup/Signin con Supabase Auth
- Perfiles de usuario (Consultant/Client)
- Row Level Security para privacidad

### 2. **Generación de Cotizaciones**
- Descripción detallada del proyecto
- Tarifa horaria y estimación automática de horas
- Soporte de múltiples tecnologías
- Gestión dinámica de equipo (nombre + rol)
- Detalles adicionales customizables
- **IA Inteligente**: Genera cotizaciones equilibradas y profesionales

### 3. **Selección Flexible de Modelos IA**
**OpenAI:**
- gpt-4o (Recomendado - más potente)
- gpt-4-turbo
- gpt-4
- gpt-3.5-turbo

**Cohere:**
- command-r-plus (Recomendado)
- command-r
- command
- command-light

### 4. **Generación PDF Inteligente**
- Documento HTML profesional y editable
- Incluye secciones de firmas para cada miembro del equipo
- Líneas de fecha personalizables
- Diseño responsivo e imprimible

### 5. **Editor de Cotización con Chatbot IA**
- Chat en tiempo real para editar documentos
- Tools inteligentes: REPLACE, INSERT, DELETE, REFORMAT
- Actualización dinámica del PDF
- Interfaz intuitiva y responsiva

### 6. **Búsqueda Web Integrada**
- Análisis automático de stack tecnológico
- Enriquecimiento de contexto para mejores cotizaciones
- Detección de complejidad y metodologías

### 7. **Dashboard Profesional**
- Estadísticas en tiempo real
- Filtros avanzados (búsqueda, estado, rango de precio)
- Tabla de cotizaciones con información detallada
- Vista de historial completo

### 8. **Gestión de Archivos**
- Upload de múltiples archivos (imágenes, PDFs, documentos)
- Validación de tipos y tamaños
- Visor de imágenes integrado
- Descarga de adjuntos

## 📁 Estructura del Proyecto

```
ColhyAI/
├── /app
│   ├── /api
│   │   ├── /generate-quote     # Generación de cotizaciones
│   │   ├── /edit-pdf           # Editor con IA
│   │   ├── /upload             # Carga de archivos
│   │   └── /quotes             # Listado de cotizaciones
│   ├── /auth                   # Páginas de autenticación
│   ├── /dashboard              # Dashboard principal
│   ├── /quote/[id]             # Detalles de cotización
│   ├── /quote/[id]/edit        # Editor PDF con chat
│   ├── /settings               # Configuración de usuario
│   ├── layout.tsx              # Layout principal
│   ├── page.tsx                # Home (glossy)
│   └── globals.css             # Estilos globales (colores mejorados)
├── /components
│   ├── providers.tsx           # Auth Provider
│   ├── quote-form.tsx          # Formulario de cotización
│   ├── quote-filters.tsx       # Filtros del dashboard
│   ├── quote-attachments.tsx   # Visor de adjuntos
│   ├── quotes-table.tsx        # Tabla de cotizaciones
│   ├── dashboard-stats.tsx     # Estadísticas
│   ├── file-upload.tsx         # Componente de carga
│   ├── model-selector.tsx      # Selector de modelos IA
│   ├── pdf-viewer.tsx          # Visor de PDF
│   ├── pdf-editor-chat.tsx     # Chat para editar
│   ├── api-config.tsx          # Configuración de API Keys
│   ├── profile-settings.tsx    # Configuración de perfil
│   └── quote-generation-status.tsx # Estado de generación
├── /lib
│   ├── ai-service.ts           # Lógica de generación de prompts
│   ├── ai-models.ts            # Catálogo de modelos IA
│   ├── pdf-generator.ts        # Generación de PDFs
│   ├── web-search.ts           # Búsqueda e enriquecimiento
│   ├── file-processor.ts       # Procesamiento de archivos
│   └── utils.ts
├── /types
│   └── index.ts                # TypeScript interfaces
├── /scripts
│   ├── init-db.sql             # Inicialización de base de datos
│   └── fix-db-schema.sql       # Corrección de schema
└── package.json
```

## 🗄️ Base de Datos (Supabase)

### Tablas Principales
- `auth.users` - Usuarios autenticados
- `profiles` - Información de perfiles (role, email)
- `quotes` - Cotizaciones con todos los detalles
- `quote_attachments` - Archivo de adjuntos

### Columnas de Quotes
```sql
- id (UUID)
- consultant_id (UUID FK)
- user_id (UUID FK)
- description (TEXT)
- price_per_hour (NUMERIC)
- technologies (TEXT[])
- team_members (JSONB)
- extra_details (TEXT)
- min_hours (INTEGER)
- quote_content (TEXT - HTML)
- status (ENUM)
- created_at, updated_at (TIMESTAMPS)
```

## 🔐 Seguridad
- API Keys se usan solo en sesión (nunca se guardan)
- Row Level Security en Supabase
- Validación de inputs
- Encriptación de datos sensibles

## 🎭 Flujo de Usuario

### Consultor
1. Registrarse → Configurar perfil
2. Crear nueva cotización
3. Rellenar detalles del proyecto
4. Configura API Key y modelo IA
5. Generar cotización
6. Editar con chatbot IA (opcional)
7. Descargar/Imprimir PDF
8. Guardar en historial

### Cliente
1. Acceder a plataforma
2. Ver cotizaciones compartidas
3. Descargar documentos
4. Consultar detalles

## 🤖 Capabilidades de IA

### Generación de Cotizaciones
- Análisis de complejidad del proyecto
- Estimación de horas automática
- Equilibrio justo entre cliente y consultor
- Inclusión de riesgos y supuestos
- Formato profesional HTML

### Edición Inteligente
- Comprende contexto del documento
- Aplica cambios sin romper estructura
- Mantiene formato profesional
- Puede iterar múltiples cambios

### Búsqueda Web
- Análisis de stack tecnológico
- Detección de tendencias de mercado
- Estimaciones basadas en datos reales

## 🎨 Estilos y Temas

### Colores
- Primary: `--primary: oklch(0.55 0.2 260)` (Azul)
- Accent: `--accent: oklch(0.7 0.25 40)` (Naranja)
- Background: Gradientes suaves de fondo
- Borders: `oklch(0.94 0.006 280)` (Translúcido)

### Componentes Glossy
- Backdrop blur: `backdrop-blur-xl`
- Bordes translúcidos: `border-white/20`
- Sombras elegantes: `shadow-2xl`
- Gradientes de fondo: `bg-gradient-to-br`

## 📦 Dependencias Principales
- Next.js 16
- React 19
- Supabase
- Tailwind CSS v4
- AI SDK v5
- shadcn/ui

## 🚀 Próximas Mejoras
- [ ] Exportación a PDF nativo (pdfkit/puppeteer)
- [ ] Plantillas predefinidas de cotizaciones
- [ ] Historial de versiones de documentos
- [ ] Colaboración en tiempo real
- [ ] Notificaciones por email
- [ ] Sistema de pagos integrado
- [ ] Análisis de rendimiento de cotizaciones

## 📝 Variables de Entorno
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## ✨ Características Exclusivas
1. **Edición con IA en tiempo real** - Único en su clase
2. **Múltiples modelos IA** - Flexibilidad total
3. **Búsqueda web integrada** - Cotizaciones más precisas
4. **Gestión de firmas** - Automático basado en equipo
5. **Diseño glossy moderno** - Interfaz atractiva
6. **API Keys privadas** - Nunca se guardan

---

**Versión**: 1.0  
**Última actualización**: Enero 2026  
**Estado**: 🟢 Producción lista
