# 🚀 ColhyAI - Guía Rápida de Inicio

## ¿Qué necesito para empezar?

### 1️⃣ Crear una Cuenta
- Ingresa a la plataforma y haz clic en "Crear Cuenta Gratis"
- Proporciona email y contraseña
- Confirma tu email (se envía automáticamente)
- ¡Listo! Ya tienes acceso

### 2️⃣ Obtener API Keys (Necesario para generar cotizaciones)

#### Opción A: OpenAI (Recomendado)
1. Ve a https://platform.openai.com/api-keys
2. Crea una nueva API Key
3. Copia la clave (comienza con `sk-`)
4. Úsala en ColhyAI

#### Opción B: Cohere
1. Ve a https://dashboard.cohere.ai/api-keys
2. Crea una nueva API Key
3. Copia la clave
4. Úsala en ColhyAI

**⚠️ Importante**: Tu API Key NUNCA se guarda en nuestros servidores. Solo se usa en tu navegador durante la sesión.

### 3️⃣ Crear tu Primera Cotización

1. Ve al Dashboard
2. Haz clic en "Nueva Cotización"
3. Rellena los campos:
   - **Descripción**: Detalles del proyecto
   - **Precio/Hora**: Tu tarifa horaria
   - **Tecnologías**: Stack tecnológico (ej: React, Node.js)
   - **Equipo**: Nombre y rol de cada miembro
   - **Detalles Adicionales**: Contexto importante
   - **Adjuntos**: Imágenes, PDFs, documentos

4. Haz clic en "Guardar Cotización"

### 4️⃣ Generar Cotización con IA

1. Abre la cotización que creaste
2. Haz clic en "Generar Cotización"
3. Selecciona:
   - **Proveedor**: OpenAI o Cohere
   - **Modelo**: Elige el modelo que prefieras (ver tabla abajo)
   - **API Key**: Proporciona tu API Key
4. ¡Genera! La IA crea una cotización profesional

### 5️⃣ Editar la Cotización

#### Opción A: Edición Rápida
1. En la página de la cotización, haz clic en "Vista Previa"
2. Ve al PDF y léelo

#### Opción B: Edición Inteligente con Chat
1. Haz clic en "Editar con IA"
2. A la derecha verás un chat
3. Pídele cambios al chatbot:
   - "Aumenta el precio un 15%"
   - "Agrega una sección de garantía"
   - "Cambia el color del documento"
4. El chatbot edita el PDF en tiempo real

### 6️⃣ Descargar y Compartir

1. En el visor de PDF, haz clic en "Descargar"
2. Se descargará un archivo HTML editable
3. También puedes imprimir directamente

## 📊 Modelos IA Disponibles

### OpenAI (Recomendado para cotizaciones)
| Modelo | Velocidad | Calidad | Costo |
|--------|-----------|---------|-------|
| gpt-4o | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | $$$ |
| gpt-4-turbo | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | $$ |
| gpt-4 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | $$$$ |
| gpt-3.5-turbo | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | $ |

### Cohere
| Modelo | Velocidad | Calidad | Costo |
|--------|-----------|---------|-------|
| command-r-plus | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | $$ |
| command-r | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | $ |
| command | ⭐⭐⭐⭐ | ⭐⭐⭐ | $ |
| command-light | ⭐⭐⭐⭐⭐ | ⭐⭐ | $ |

**💡 Recomendación**: Para cotizaciones profesionales, usa `gpt-4o` o `command-r-plus`

## 🎨 Dashboard

### Visualización
- **Estadísticas**: Total de cotizaciones, generadas, aceptadas
- **Filtros**: Busca por nombre, filtra por estado, rango de precio
- **Tabla**: Ve todas tus cotizaciones de un vistazo

### Estados de Cotización
- 📝 **Draft**: Recién creada, sin generar
- ✅ **Generated**: Ya tiene contenido generado
- 📤 **Sent**: Compartida con el cliente
- ✔️ **Accepted**: Cliente la aceptó
- ❌ **Rejected**: Cliente rechazó

## 💬 Chat Editor - Ejemplos de Comandos

```
"Aumenta el precio total 20%"
"Agrega una sección de metodología"
"Quita el logo de la empresa"
"Cambia las firmas a tres personas"
"Agrega términos de pago: 50% al iniciar, 50% al finalizar"
"Hazlo más formal/casual"
"Resalta los puntos principales"
```

## 🔒 Privacidad y Seguridad

✅ **Lo que es SEGURO:**
- Tu API Key se usa solo en tu navegador
- Nunca se guarda en nuestros servidores
- La sesión se cierra automáticamente
- Tus cotizaciones son privadas

❌ **NO hagas:**
- No compartas tu API Key
- No dejes la sesión abierta en computadoras públicas
- No uses API Keys de terceros

## ⚡ Consejos Pro

1. **Cotizaciones Mejores**: Incluye más detalles en la descripción del proyecto
2. **Búsqueda Web**: La IA busca información de mercado automáticamente
3. **Modelos Rápidos**: Usa gpt-3.5-turbo para borradores rápidos
4. **Edición Iterativa**: Puedes pedir múltiples cambios al chatbot
5. **Firmas Automáticas**: Agrega todo el equipo al proyecto para firmas automáticas

## 📚 Recursos Adicionales

- [Documentación Completa](./PROJECT_SUMMARY.md)
- [Términos de Servicio]()
- [Política de Privacidad]()
- [Soporte Técnico]()

## ❓ Preguntas Frecuentes

### ¿Cuánto cuesta usar ColhyAI?
ColhyAI es **100% GRATIS**. Solo pagas lo que usas de tu API Key (OpenAI o Cohere).

### ¿Mis datos son privados?
Sí. Todos los datos se almacenan encriptados en Supabase. Nadie más puede verlos.

### ¿Qué pasa si se corta internet?
Los cambios se guardan automáticamente. Si se corta, se guardarán cuando vuelva.

### ¿Puedo usar múltiples proveedores?
Sí. Puedes cambiar entre OpenAI y Cohere cuando quieras.

### ¿Los PDFs son editables?
Sí. Se descargan como HTML, puedes abrirlos en Word o Google Docs y editarlos.

### ¿Puedo colaborar con otros?
No por ahora, pero está en nuestro roadmap.

---

**¿Tienes más preguntas?** Contacta a nuestro equipo de soporte.

🎉 **¡Bienvenido a ColhyAI!** Feliz generación de cotizaciones.
