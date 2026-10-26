import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

type Paquete = {
  nro_guia: string;
  destinatario: string;
  direccion: string;
  estado: string;
  tipo_servicio: string;
  monto_cobro: number;
  tarifa_flete: number;
  cobrado: boolean;
  fecha_entrega: string | null;
  retirado_por: string | null;
  retirado_por_ci: string | null;
  observaciones: string | null;
};

function csvEscape(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '';
  const s = String(value);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

function formatGs(n: number): string {
  return n.toLocaleString('es-PY');
}

export async function GET(request: NextRequest) {
  try {
    // 1. Auth
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // 2. Params
    const { searchParams } = new URL(request.url);
    const clienteId = searchParams.get('cliente_id');
    const fecha = searchParams.get('fecha');

    if (!clienteId || !fecha) {
      return NextResponse.json(
        { error: 'Faltan parametros: cliente_id y fecha' },
        { status: 400 }
      );
    }

    // Validar fecha (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      return NextResponse.json(
        { error: 'Fecha invalida. Formato: YYYY-MM-DD' },
        { status: 400 }
      );
    }

    // 3. Cliente (RLS filtra por user_id en paquetes; clientes es publico autenticado)
    const { data: cliente, error: clienteError } = await supabase
      .from('clientes')
      .select('id, nombre, comision_pct')
      .eq('id', clienteId)
      .single();

    if (clienteError || !cliente) {
      return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 });
    }

    // 4. Paquetes del cliente en la fecha (RLS filtra user_id)
    const fechaInicio = fecha + 'T00:00:00.000Z';
    const fechaFin = fecha + 'T23:59:59.999Z';

    const { data: paquetes, error: paquetesError } = await supabase
      .from('paquetes')
      .select('nro_guia, destinatario, direccion, estado, tipo_servicio, monto_cobro, tarifa_flete, cobrado, fecha_entrega, retirado_por, retirado_por_ci, observaciones')
      .eq('cliente_id', clienteId)
      .gte('created_at', fechaInicio)
      .lte('created_at', fechaFin)
      .order('created_at', { ascending: true });

    if (paquetesError) {
      return NextResponse.json({ error: 'Error al consultar paquetes' }, { status: 500 });
    }

    const paquetesData = (paquetes ?? []) as Paquete[];

    // 5. Calcular totales
    let totalTarifa = 0;
    let totalMontoCobro = 0;
    let totalComision = 0;
    let entregados = 0;
    let ausentes = 0;
    let devueltos = 0;
    let enRuta = 0;

    for (const p of paquetesData) {
      if (p.estado === 'Entregado') {
        entregados++;
        totalTarifa += Number(p.tarifa_flete ?? 0);
        totalMontoCobro += Number(p.monto_cobro ?? 0);
      } else if (p.estado === 'Ausente') ausentes++;
      else if (p.estado === 'Devuelto') devueltos++;
      else if (p.estado === 'En Ruta') enRuta++;
    }

    const comisionPct = Number(cliente.comision_pct ?? 3);
    totalComision = totalMontoCobro * (comisionPct / 100);

    const totalARendir = totalMontoCobro - totalComision;
    const totalAFacturar = totalTarifa;

    // 6. Generar CSV
    const lines: string[] = [];

    // Header del reporte
    lines.push(csvEscape('REPORTE DIARIO - ' + cliente.nombre));
    lines.push(csvEscape('Fecha: ' + fecha));
    lines.push(csvEscape('Comision contra entrega: ' + comisionPct + '%'));
    lines.push('');

    // Resumen
    lines.push(csvEscape('RESUMEN'));
    lines.push(csvEscape('Entregados') + ',' + csvEscape(entregados));
    lines.push(csvEscape('Ausentes') + ',' + csvEscape(ausentes));
    lines.push(csvEscape('Devueltos') + ',' + csvEscape(devueltos));
    lines.push(csvEscape('En Ruta') + ',' + csvEscape(enRuta));
    lines.push(csvEscape('Total tarifa flete (Gs.)') + ',' + csvEscape(formatGs(totalTarifa)));
    lines.push(csvEscape('Total monto cobrado (Gs.)') + ',' + csvEscape(formatGs(totalMontoCobro)));
    lines.push(csvEscape('Total comision (' + comisionPct + '%) (Gs.)') + ',' + csvEscape(formatGs(totalComision)));
    lines.push(csvEscape('Total a rendir al cliente (Gs.)') + ',' + csvEscape(formatGs(totalARendir)));
    lines.push(csvEscape('Total a facturar (Gs.)') + ',' + csvEscape(formatGs(totalAFacturar)));
    lines.push('');

    // Detalle
    lines.push(csvEscape('DETALLE DE PAQUETES'));
    lines.push([
      'N Guia', 'Destinatario', 'Direccion', 'Estado', 'Tipo',
      'Tarifa Flete (Gs.)', 'Monto Cobro (Gs.)', 'Cobrado',
      'Retirado por', 'C.I.', 'Fecha Entrega', 'Observaciones'
    ].map(csvEscape).join(','));

    for (const p of paquetesData) {
      lines.push([
        p.nro_guia,
        p.destinatario,
        p.direccion,
        p.estado,
        p.tipo_servicio,
        formatGs(Number(p.tarifa_flete ?? 0)),
        formatGs(Number(p.monto_cobro ?? 0)),
        p.cobrado ? 'SI' : 'NO',
        p.retirado_por || '',
        p.retirado_por_ci || '',
        p.fecha_entrega ? new Date(p.fecha_entrega).toLocaleString('es-PY') : '',
        p.observaciones || '',
      ].map(csvEscape).join(','));
    }

    const csv = lines.join('\n');
    const filename = 'reporte-diario-' + cliente.nombre.replace(/[^a-z0-9]/gi, '-').toLowerCase() + '-' + fecha + '.csv';

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="' + filename + '"',
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('Error en reporte diario:', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}