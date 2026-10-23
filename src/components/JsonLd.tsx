/**
 * Inyecta datos estructurados schema.org.
 *
 * Es un Server Component: el JSON-LD viaja en el HTML inicial, que es
 * justo donde los rastreadores lo buscan.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  const payload = Array.isArray(data) ? data : [data];

  return (
    <>
      {payload.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          // El contenido lo generamos nosotros desde la BD, no viene del usuario final.
          // Escapamos "<" para cerrar la puerta a un </script> inyectado en un texto.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema).replace(/</g, '\u003c'),
          }}
        />
      ))}
    </>
  );
}
