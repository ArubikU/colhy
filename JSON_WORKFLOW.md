# ColhyAI - JSON to PDF Workflow

## Flujo Completo

### 1. Generación de Cotización (JSON)

**Endpoint:** `POST /api/generate-quote`

**Proceso:**
1. El usuario proporciona datos del proyecto (descripción, tarifa, tecnologías, equipo, etc.)
2. La IA genera un **JSON estructurado** que sigue el esquema `QuoteDocument`
3. El JSON se parsea y se valida
4. Se convierte el JSON a **HTML profesional** usando `generateQuoteHTML()`
5. Tanto el JSON como el HTML se almacenan en la base de datos

**Entrada (Body):**
```json
{
  "quoteId": "uuid",
  "description": "Descripción del proyecto",
  "pricePerHour": 100,
  "technologies": ["React", "Node.js"],
  "extraDetails": "Detalles adicionales",
  "minHours": 40,
  "teamMembers": [{ "name": "Juan", "role": "Developer" }],
  "provider": "openai",
  "modelId": "gpt-4o",
  "apiKey": "sk-..."
}
```

**Salida (Response):**
```json
{
  "success": true,
  "quoteJSON": { /* JSON estructura completa */ },
  "quoteContent": "<html>... PDF HTML ...</html>",
  "usage": { "promptTokens": 1500, "completionTokens": 2000 }
}
```

---

### 2. Edición de Cotización (Chat + PDF)

**Endpoint:** `POST /api/edit-pdf`

**Proceso:**
1. El usuario solicita cambios vía chat ("Aumenta el total a $5000", "Cambia el color", etc.)
2. La IA recibe el JSON actual (o HTML si no hay JSON)
3. La IA modifica el JSON directamente
4. Se regenera el HTML automáticamente
5. El PDF se renderiza con los cambios

**Entrada (Body):**
```json
{
  "pdfContent": "<html>... PDF HTML ...</html>",
  "quoteJSON": { /* JSON actual */ },
  "userRequest": "Aumenta el total en un 10%",
  "aiProvider": "openai",
  "aiModel": "gpt-4o",
  "apiKey": "sk-..."
}
```

**Salida (Response):**
```json
{
  "success": true,
  "response": "Cambios realizados: aumenté el total...",
  "updatedContent": "<html>... PDF HTML actualizado ...</html>",
  "updatedJSON": { /* JSON actualizado */ }
}
```

---

## Esquema JSON (QuoteDocument)

```typescript
interface QuoteDocument {
  // Metadata
  quoteNumber: string;
  dateIssued: string;           // ISO: YYYY-MM-DD
  validUntil: string;            // ISO: YYYY-MM-DD
  currency: string;              // USD, EUR, etc

  // Client & Consultant
  clientName: string;
  clientEmail?: string;
  clientCompany?: string;
  consultantName: string;
  consultantCompany?: string;
  consultantEmail?: string;
  consultantPhone?: string;

  // Project
  projectTitle: string;
  projectDescription: string;
  projectScope: string;
  objectives: string[];          // Mínimo 3
  keyAssumptions: string[];
  limitations: string[];

  // Technical
  technologies: string[];         // React, Node.js, etc
  methodologies: string[];        // Agile, Scrum, etc
  skillsRequired: string[];

  // Team
  teamMembers: {
    name: string;
    role: string;
    hourlyRate?: number;
    allocatedHours?: number;
  }[];
  signatories: {
    name: string;
    role: string;
    signatureDate?: string;
    signatureLine?: boolean;
  }[];

  // Delivery
  phases: {
    name: string;
    description: string;
    estimatedHours: number;
    deliverables: string[];
    riskFactors?: string[];
  }[];
  estimatedStartDate: string;
  estimatedEndDate: string;
  timeline: string;              // "6 semanas"

  // Costs
  costBreakdown: {
    category: string;
    description: string;
    hours: number;
    hourlyRate: number;
    subtotal: number;
  }[];
  subtotal: number;
  taxes?: {
    type: string;
    rate: number;
    amount: number;
  };
  total: number;
  minimumHours: number;

  // Payment
  paymentTerms: {
    percentage: number;
    description: string;
    dueDate?: string;
  }[];
  paymentMethod: string;
  bankDetails?: string;

  // Terms
  maintenanceSupport?: string;
  warrantyPeriod?: string;
  confidentiality: boolean;
  intellectualProperty: string;
  cancellationPolicy: string;
  revisionRounds?: number;

  // Extra
  notes?: string;
  specialConditions?: string[];
  attachments?: string[];
  extraDetails?: string;
}
```

---

## Prompts de IA

### System Prompt (Generación)
- Enfatiza que DEBE devolver JSON válido
- No debe incluir markdown ```json```
- Debe escapar caracteres especiales
- Debe calcular correctamente total = subtotal + taxes
- Mínimo 4 items en costBreakdown
- Mínimo 3 fases en phases
- Mínimo 2 términos de pago

### System Prompt (Edición)
- Recibe el JSON o HTML actual
- Modifica solo lo solicitado
- Regenera el HTML automáticamente
- Mantiene la estructura intacta
- Recalcula totales si es necesario

---

## Flujo Visual

```
┌─────────────────────────┐
│  Usuario proporciona    │
│  datos del proyecto     │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  IA genera JSON         │
│  estructurado           │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  JSON → HTML            │
│  (generateQuoteHTML)    │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  Almacenar en DB        │
│  (JSON + HTML)          │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  Mostrar PDF            │
│  en el navegador        │
└────────────┬────────────┘
             │
     Usuario solicita cambios
             │
             ▼
┌─────────────────────────┐
│  Chatbot edita JSON     │
│  (cambios específicos)  │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  HTML regenerado        │
│  automáticamente        │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  PDF actualizado        │
│  en tiempo real         │
└─────────────────────────┘
```

---

## Ventajas del Enfoque JSON → PDF

1. **Estructura clara:** JSON es validable y estructurado
2. **Edición precisa:** Cambios sin perder formato
3. **Regeneración automática:** HTML se recalcula siempre
4. **Validación:** JSON se puede validar contra esquema
5. **Exportación:** Fácil convertir a diferentes formatos
6. **Mantenimiento:** Cambios futuros no rompen PDF
7. **Firmas:** Fácil agregar líneas de firma desde JSON

---

## Archivos Clave

- `types/quote-schema.ts` - Esquema TypeScript de QuoteDocument
- `lib/json-to-pdf.ts` - Conversión de JSON a HTML profesional
- `lib/ai-service.ts` - Prompts para generar JSON
- `app/api/generate-quote/route.ts` - Endpoint de generación
- `app/api/edit-pdf/route.ts` - Endpoint de edición
- `components/pdf-editor-chat.tsx` - Chat para editar
- `components/pdf-viewer.tsx` - Visor del PDF
