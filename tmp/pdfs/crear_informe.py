from pathlib import Path
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT

root=Path(__file__).resolve().parents[2]
out=root/'output/pdf/Chasqui_Google_Analytics_2026-10-27.pdf'
out.parent.mkdir(parents=True,exist_ok=True)
styles=getSampleStyleSheet()
styles.add(ParagraphStyle(name='SmallNote',fontSize=9,leading=13,textColor=colors.HexColor('#475569')))
styles['BodyText'].fontSize=10
styles['BodyText'].leading=14
styles['Heading2'].spaceBefore=7
styles['Heading2'].spaceAfter=5
styles['SmallNote'].fontSize=8.5
styles['SmallNote'].leading=11
styles['Title'].textColor=colors.HexColor('#134e4a')
story=[]
def p(text,style='BodyText'):
    story.append(Paragraph(text,styles[style]));story.append(Spacer(1,4))
def table(rows,widths):
    t=Table([[Paragraph(str(c),styles['SmallNote']) for c in r] for r in rows],colWidths=widths,hAlign='LEFT')
    t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),colors.HexColor('#e2efec')),('ROWBACKGROUNDS',(0,1),(-1,-1),[colors.white,colors.HexColor('#f6f8fa')]),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),9),('RIGHTPADDING',(0,0),(-1,-1),9),('TOPPADDING',(0,0),(-1,-1),4),('BOTTOMPADDING',(0,0),(-1,-1),4)]))
    story.append(t);story.append(Spacer(1,12))
p('Chasqui Aventura','Title')
p('Informe de Google Analytics 4 | Consulta: 27 de octubre de 2026','SmallNote')
p('<b>Período:</b> 27 de septiembre al 26 de octubre de 2026 (30 días completos).<br/><b>Comparación:</b> 28 de agosto al 26 de septiembre de 2026.<br/><b>Propiedad:</b> Chasqui Aventura - Sitio web (557868748).','SmallNote')
p('Indicadores principales','Heading2')
table([['Indicador','Resultado','Período anterior'],['Usuarios activos','7','0'],['Sesiones / vistas','12 / 14','0 / 0'],['Sesiones con interacción','6 (50 %)','0'],['Interacción media por sesión','47 segundos','0 segundos'],['Eventos / eventos clave','54 / 2','0 / 0'],['Tasa de evento clave de sesión','16,67 %','0 %'],['Ingresos registrados','0 (moneda mostrada: $)','0']], [250,145,112])
p('Canales de adquisición','Heading2')
table([['Canal','Sesiones','Participación','Eventos clave'],['Directo','6','50 %','0'],['Redes sociales orgánicas','3','25 %','0'],['Referencias','3','25 %','2']], [230,80,95,102])
p('Páginas más vistas','Heading2')
table([['Ruta','Vistas','Participación'],['/','10','71,43 %'],['/index.html','3','21,43 %'],['/expediciones/3000-avion-de-los-uruguayos.html','1','7,14 %']], [345,65,97])
p('Cómo interpretar estos resultados','Heading2')
p('<b>Hay tráfico de prueba:</b> la vista de los últimos siete días (20 al 26 de octubre) registra 1 usuario activo, 2 sesiones, 2 vistas, 9 eventos y 1 evento clave. Las 2 sesiones se atribuyen a <b>tagassistant.google.com / referral</b>. Esto indica actividad asociada a pruebas; no debe interpretarse automáticamente como captación de clientes. Los totales de este informe incluyen esa actividad.','SmallNote')
p('La muestra es pequeña y el período anterior tiene valores cero, por lo que no se calcula crecimiento porcentual. Los 2 eventos clave no acreditan reservas o ventas; aquí no se verificó su nombre. Los ingresos cero son los registrados en GA4 y no prueban ausencia de ventas por otros medios.','SmallNote')
p('<b>Prioridad:</b> separar las pruebas del análisis comercial y verificar qué eventos representan consultas reales. Las rutas / e /index.html podrían corresponder al mismo contenido; se presentan por separado tal como las informa GA4.','SmallNote')
p('Fuente: informes de Adquisición de tráfico y Páginas y pantallas de Google Analytics, y tarjetas de Inicio. Lectura directa del navegador; informes detallados con el 100 % de los datos disponibles. Resumen elaborado a partir de GA4, no exportación íntegra de la plataforma.','SmallNote')
def footer(c,d):
    c.setFont('Helvetica',8);c.setFillColor(colors.HexColor('#64748b'));c.drawString(44,25,'Chasqui Aventura | Google Analytics 4');c.drawRightString(551,25,str(d.page))
SimpleDocTemplate(str(out),pagesize=(595,842),rightMargin=44,leftMargin=44,topMargin=32,bottomMargin=38).build(story,onFirstPage=footer,onLaterPages=footer)
print(out)

