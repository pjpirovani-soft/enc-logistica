# AI-RULES — enc-logistica

Reglas para la IA en este proyecto.

## Idioma

- **Español (Paraguay).**
- **Identificadores de código SIN acentos:** variables, funciones, tipos, imports, keys de objetos, nombres de archivos.
  - Ejemplo: `const encarnacion`, `type Cliente`, `import { crearPaquete }`.
- **Strings visibles al usuario CON acentos:** UI, placeholders, labels, mensajes de error, títulos, meta tags, alt text.
  - Ejemplo: `"Encarnación"`, `"La dirección es obligatoria"`, `<title>ENC Logística</title>`.
- **Docs y comentarios CON acentos:** `docs/proyecto/*.md`, comentarios en código.
  - Ejemplo: `// Logística urbana`, `# BUSINESS-LOGIC — enc-logistica`.
- **Mensajes Zod:** los mensajes visibles al usuario llevan acentos. Los nombres de campos no.
  - Ejemplo: `z.string().min(1, 'La dirección es obligatoria')`.

## Flujo de trabajo

- Un bloque a la vez. Esperar output.
- Verificar antes de asumir.
- Documentar decisiones en ARCHITECTURE.md.

## Codigo

- TypeScript estricto. No usar any sin justificar.
- Componentes funcionales, no clases.
- Server Components por defecto. Client Components solo cuando hay estado/eventos.
- Validacion con Zod en cliente y servidor.

## Tests

- Vitest + RTL. Un test por feature critica.
- Tests deben pasar antes de commitear.

## Seguridad

- **Regla de oro: nunca imprimir el VALOR de una key. Solo el NOMBRE.** Ver SEGURIDAD.md para comandos prohibidos.
- Nunca commitear .env.local ni secretos.
- RLS en Supabase para todo dato de usuario.
- Validar en servidor, no solo en cliente.

## Commits

- Conventional Commits.
- Un commit por feature o grupo logico.