# ColhyAI - Cotizaciones de Consultoría con IA

Una plataforma inteligente para generar cotizaciones profesionales de consultoría usando IA. Soporta múltiples proveedores de IA (OpenAI, Cohere) y búsqueda web integrada.

## 🌟 Características

- **Cotizaciones Equilibradas**: IA genera cotizaciones justas considerando complejidad
- **Múltiples Proveedores de IA**: OpenAI (GPT-4) y Cohere
- **Búsqueda Web Integrada**: IA busca en internet para mejores resultados
- **Gestión de Adjuntos**: Soporta imágenes, PDF y documentos
- **Gestión de Equipo**: Define roles y miembros del equipo
- **Historial Completo**: Guarda y gestiona todas tus cotizaciones
- **Autenticación Segura**: Con Supabase Auth
- **Privacidad**: API Keys solo se usan localmente, nunca se guardan

## 🚀 Inicio Rápido

### 1. Configuración de Supabase

ColhyAI usa Supabase para autenticación y base de datos. La migración SQL ya está incluida.

**Tablas creadas:**
- `profiles`: Perfiles de usuario (consultor/cliente)
- `quotes`: Cotizaciones generadas
- `quote_attachments`: Archivos adjuntos a cotizaciones
- `consultant_settings`: Configuración del consultor

### 2. Variables de Entorno

Asegúrate de tener configuradas en Vercel:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Instalación

```bash
npm install
# o
yarn install
# o
pnpm install
```

### 4. Desarrollo

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000)

## 📋 Flujo de Uso

### Para Consultores

1. **Crear Cuenta**: Regístrate en `/auth`
2. **Configurar Perfil**: Ve a Configuración para:
   - Nombre de empresa
   - Tarifa horaria base
   - Biografía profesional
3. **Agregar Proveedor de IA**: Ve a Configuración → IA
   - Selecciona OpenAI o Cohere
   - Agrega tu API Key (se usa solo localmente)
4. **Nueva Cotización**: En Dashboard → Nueva Cotización
   - Describe el proyecto (con imágenes/PDFs)
   - Define tarifa horaria y tecnologías
   - Agrega miembros del equipo si aplica
   - Detalles adicionales
5. **Generar Cotización**: Haz clic en "Generar Cotización con IA"
   - La IA genera una cotización equilibrada y profesional
   - Puedes regenerar si lo deseas

### Para Clientes

1. **Crear Cuenta**: Regístrate en `/auth` (selecciona rol "Cliente")
2. **Ver Cotizaciones**: En Dashboard ves cotizaciones que te han enviado
3. **Historial**: Todas tus cotizaciones quedan guardadas

## 🤖 Generación de Cotizaciones

La IA considera:

- **Descripción del proyecto**: Alcance, requisitos, complejidad
- **Tecnologías**: Stack técnico utilizado
- **Equipo**: Roles y experiencia del equipo
- **Tarifa horaria**: Base para el cálculo
- **Horas mínimas**: La IA estima si no especificas
- **Detalles adicionales**: Contexto, limitaciones, urgencia

La cotización generada incluye:
- Resumen del alcance
- Desglose de costos
- Cronograma estimado
- Supuestos y limitaciones
- Términos de pago

## 🔐 Seguridad y Privacidad

- ✅ **Tus API Keys son privadas**: Solo se usan en tu navegador
- ✅ **Row Level Security**: Cada usuario solo ve sus datos
- ✅ **Autenticación nativa Supabase**: Segura y confiable
- ✅ **Sin almacenamiento de credenciales**: Las API Keys se borran al cerrar sesión

## 🛠️ Stack Técnico

- **Frontend**: Next.js 16, React 19
- **Styling**: Tailwind CSS v4
- **Base de Datos**: Supabase PostgreSQL
- **Autenticación**: Supabase Auth
- **IA**: AI SDK v5 (Vercel)
- **Proveedores IA**: OpenAI, Cohere
- **Storage**: Supabase Storage (para adjuntos)

## 📝 API Endpoints

### Autenticación
- `POST /auth/signup` - Crear cuenta
- `POST /auth/signin` - Ingresar
- `POST /auth/signout` - Cerrar sesión

### Cotizaciones
- `GET /api/quotes` - Listar cotizaciones
- `POST /api/quotes` - Crear cotización
- `POST /api/generate-quote` - Generar con IA
- `POST /api/upload` - Subir archivos

## 🎯 Próximas Mejoras

- [ ] Búsqueda web avanzada integrada
- [ ] Compartir cotizaciones con clientes
- [ ] Firmas digitales
- [ ] Integración con Stripe para pagos
- [ ] Dashboard analítico
- [ ] Plantillas de cotización personalizadas
- [ ] Notificaciones por email
- [ ] API pública para integraciones

## 📄 Licencia

MIT

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor abre un issue o pull request.

## 📞 Soporte

Para soporte, abre un issue en el repositorio o contacta al equipo de desarrollo.

---

**ColhyAI** - Simplificando cotizaciones de consultoría con IA 🚀
