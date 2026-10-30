# Medición de Chasqui

Actualizado y publicado: 2026-10-26.

- Propiedad GA4: Chasqui Aventura - Sitio web (557868748).
- Flujo web: Chasqui Aventura - Web (16057235198).
- ID de medición: G-WDPSJJXNTF.
- Las 54 páginas indexables cargan analytics.js desde el head con defer.
- No agregar una segunda instalación de gtag o GTM para este flujo.
- La medición mejorada de GA4 registra los clics salientes.
- La regla existente en GA4 genera whatsapp_click cuando event_name es click
  y link_domain contiene wa.me. Copia los parámetros del evento de origen.
- whatsapp_click ya está marcado como evento clave. No enviarlo también desde
  JavaScript: duplicaría el evento que genera la regla de GA4.
- Vinculación creada con la propiedad de Search Console de dominio
  chasquiaventura.com.ar y este flujo web.

## Verificación

- Los 55 archivos publicados (54 HTML y analytics.js) coincidieron con los locales.
- Prueba de inicialización repetida: solo un cargador y una configuración de GA4.
- Prueba en navegador de la ficha Avión de los Uruguayos: carga del script de Google
  confirmada y sin errores de consola.
- GA4 en tiempo real recibió una vista de esa ficha y un whatsapp_click de prueba,
  también registrado como evento clave. Este clic es de verificación, no una venta
  ni una consulta enviada.

## Publicación

La generación de URL de subida mediante el conector devolvió 404. Se publicaron
los archivos con el administrador de archivos de hPanel, mediante acceso de
colaborador. Se solicitó limpiar la caché del sitio.

Se guardó una copia previa de los 54 HTML fuera de la carpeta pública, en los
artefactos locales de esta conversación (chasqui-antes-analytics-20261026.zip).

El panel de Hostinger mostró un aviso de vencimiento del hosting en 14 días.
Revisar la renovación con el titular; no se realizó ninguna compra ni renovación.
