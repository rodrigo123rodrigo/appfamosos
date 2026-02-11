# ClarifyPro - Plataforma Oficial de Aclaraciones Verificadas

**La plataforma donde figuras públicas publican aclaraciones oficiales verificadas con trazabilidad completa y evidencias que respaldan cada declaración.**

## 🌟 Características Principales

### Para Figuras Públicas
- **Dashboard personalizado** para gestionar aclaraciones y monitorear rumores
- **Editor guiado** con categorización de aclaraciones por temas
- **Sistema de verificación** con sello de autenticidad
- **Gestión de evidencia** con carga de documentos, imágenes y audio
- **Panel de métricas** con alcance, sentimiento y evolución de rumores

### Categorías de Aclaraciones
- 💕 **Relaciones** - Vida personal y relaciones
- 🎬 **Proyectos** - Cine, música, deportes, marcas  
- 🌟 **Salud** - Bienestar y salud personal
- ⚖️ **Legal** - Situaciones legales
- 🤝 **Filantropía** - Causas y donaciones
- 📸 **Imagen** - Campañas y colaboraciones
- 💬 **Declaraciones** - Citas mal interpretadas
- 📋 **Otros** - Temas importantes diversos

### Funcionalidades Premium
- **Kit de prensa** descargable por aclaración (PDF + assets)
- **Programación de embargos** para publicar a cierta hora
- **Feed privado** para agentes/PR con links seguros
- **Notificaciones segmentadas** (fans, medios, stakeholders)
- **API para medios** con acceso a feeds verificados

## 🎨 Diseño y Experiencia

### Estética Editorial Minimal-Lujosa
- **Tipografía**: Crimson Text (serif display) + Inter (sans geométrica)
- **Paleta de colores**: Marfil (#FFFEF7) / Negro (#0A0A0A) / Dorado (#D4A853)
- **Microanimaciones** de entrada y hover sutiles
- **Statement cards** con sello de autenticidad y timestamp visible

### Modo Crisis/Evento
- Layout prioriza tarjetas fijas con aclaraciones urgentes
- Notificaciones push inmediatas
- Distribución automática a medios aliados

## 🔐 Seguridad y Verificación

### Proceso de Onboarding
- ✅ Verificación de identidad (ID gubernamental + selfie)
- ✅ Prueba de control de redes sociales
- ✅ Revisión por equipo de verificación interno

### Integridad de Contenido
- **Firmas digitales** de aclaraciones
- **QR codes** en cada card para trazabilidad  
- **Watermarks sutiles** en imágenes/evidencias
- **Hash blockchain** opcional para prueba de integridad inmutable

### Flujo de Moderación
- Revisión interna antes de publicar
- Historial inmutable de ediciones (diffs visibles)
- Sistema de "contexto" para rumores recurrentes

## 🛠 Arquitectura Técnica

### Stack Tecnológico
- **Frontend**: Next.js 14+ con App Router, React 19, TypeScript
- **Styling**: Tailwind CSS 4 con configuración personalizada
- **Fuentes**: Google Fonts (Crimson Text + Inter)
- **Desarrollo**: Hot reload, ESLint, TypeScript strict mode

### Estructura del Proyecto
```
src/
├── app/
│   ├── dashboard/         # Panel de control de celebridades
│   ├── clarifications/    # Feed público de aclaraciones
│   ├── globals.css        # Estilos globales y tema
│   ├── layout.tsx         # Layout raíz con fuentes
│   └── page.tsx           # Landing page principal
├── components/
│   ├── Header.tsx         # Navegación principal
│   └── StatementCard.tsx  # Tarjeta de aclaración
└── public/
    └── assets/            # Recursos estáticos
```

### Modelo de Datos (Planificado)
```typescript
interface Celebrity {
  id: string;
  name: string;
  handler: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  tier: 'free' | 'pro' | 'enterprise';
}

interface Clarification {
  id: string;
  celebrityId: string;
  title: string;
  content: string;
  category: string;
  status: 'draft' | 'review' | 'published' | 'archived';
  evidenceUrls: string[];
  Hash: string;
  publishedAt: Date;
  embargoUntil?: Date;
}

interface Rumor {
  id: string;
  sourceUrl: string;
  quote: string;
  severity: 'low' | 'medium' | 'high';
  tags: string[];
  addressed: boolean;
}
```

## 🚀 Desarrollo Local

### Prerequisitos
- Node.js 18+
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone <repository-url>
cd clarifypro

# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo  
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

### Scripts Disponibles
```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción  
npm run start    # Servidor de producción
npm run lint     # Análisis de código
```

## 📋 Planes y Precios (Planificado)

### Gratuito
- ✅ Lectura pública ilimitada
- ✅ Búsqueda por categorías
- ✅ Notificaciones básicas

### Pro (Celebridades/Equipos)
- ✅ Publicación ilimitada de aclaraciones
- ✅ Métricas avanzadas y analytics
- ✅ Programación de embargos
- ✅ Kit de prensa descargable
- ✅ Soporte prioritario

### Enterprise (Agencias/Medios)
- ✅ API completa y feeds personalizados
- ✅ Alertas en tiempo real
- ✅ Integraciones personalizadas
- ✅ Descargas masivas de press-kits
- ✅ Gestor de cuenta dedicado

## 🎯 Próximos Pasos de Desarrollo

### MVP Core Features
- [ ] Sistema de autenticación OAuth
- [ ] Base de datos PostgreSQL
- [ ] Backend API con Node.js/Express
- [ ] Sistema de roles y permisos
- [ ] Carga y gestión de evidencias

### Funcionalidades Avanzadas  
- [ ] Panel de métricas y analytics
- [ ] Sistema de notificaciones push
- [ ] Integración con blockchain
- [ ] API para terceros
- [ ] App móvil nativa

### Seguridad y Escalabilidad
- [ ] Implementación de Passkeys
- [ ] CDN para distribución global
- [ ] Monitoreo y alertas
- [ ] Backup y recuperación
- [ ] Tests automatizados

## 📞 Contacto y Soporte

Para consultas sobre desarrollo, colaboración o implementación de la plataforma, contacta al equipo de desarrollo.

---

**ClarifyPro** - *Donde la verdad encuentra su voz oficial* ✨
