import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { csvEscape, formatGs } from '@/lib/csv';

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
};

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { data: cliente } = await supabase
      .from('clientes')
      .select('id, nombre, comision_pct')
      .eq('auth_user_id', user.id)
      .single();

    if (!cliente) {
      return NextResponse.json({ error: 'Cliente no vinculado' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const mes = searchParams.get('mes');

    if (!mes || !/^\d{4}-\d{2}$/.test(mes)) {
      return NextResponse.json({ error: 'Mes invalido. Formato: YYYY-MM' }, { status: 400 });
    }

    const [year, month] = mes.split('-').map(Number);
    const fechaInicio = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0)).toISOString();
    const fechaFin = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999)).toISOString();

    const { data: paquetes, error: paquetesError } = await supabase
      .from('paquetes')
      .select('nro_guia, destinatario, direccion, estado, tipo_servicio, monto_cobro, tarifa_flete, cobrado, fecha_entrega')
      .eq('cliente_id', cliente.id)
      .gte('created_at', fechaInicio)
      .lte('created_at', fechaFin)
      .order('created_at', { ascending: true });

    if (paquetesError) {
      return NextResponse.json({ error: 'Error al consultar paquetes' }, { status: 500 });
    }

    const paquetesData = (paquetes ?? []) as Paquete[];

    let totalTarifa = 0;
    let totalMontoCobro = 0;
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
    const totalComision = totalMontoCobro * (comisionPct / 100);
    const totalARendir = totalMontoCobro - totalComision;
    const totalAFacturar = totalTarifa;

    const lines: string[] = [];
    lines.push(csvEscape('REPORTE MENSUAL - ' + cliente.nombre));
    lines.push(csvEscape('Mes: ' + mes));
    lines.push(csvEscape('Comision contra entrega: ' + comisionPct + '%'));
    lines.push('');
    lines.push(csvEscape('RESUMEN'));
    lines.push(csvEscape('Entregados') + ',' + csvEscape(entregados));
    lines.push(csvEscape('Ausentes') + ',' + csvEscape(ausentes));
    lines.push(csvEscape('Devueltos') + ',' + csvEscape(devueltos));
    lines.push(csvEscape('En Ruta') + ',' + csvEscape(enRuta));
    lines.push(csvEscape('Total tarifa flete (Gs.)') + ',' + csvEscape(formatGs(totalTarifa)));
    lines.push(csvEscape('Total monto cobrado (Gs.)') + ',' + csvEscape(formatGs(totalMontoCobro)));
    lines.push(csvEscape('Total comision (' + comisionPct + '%) (Gs.)') + ',' + csvEscape(formatGs(totalComision)));
    lines.push(csvEscape('Total a rendir (Gs.)') + ',' + csvEscape(formatGs(totalARendir)));
    lines.push(csvEscape('Total a facturar (Gs.)') + ',' + csvEscape(formatGs(totalAFacturar)));
    lines.push('');
    lines.push(csvEscape('DETALLE DE PAQUETES'));
    lines.push([
      'N Guia', 'Destinatario', 'Direccion', 'Estado', 'Tipo',
      'Tarifa Flete (Gs.)', 'Monto Cobro (Gs.)', 'Cobrado', 'Fecha Entrega'
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
        p.fecha_entrega ? new Date(p.fecha_entrega).toLocaleString('es-PY') : '',
      ].map(csvEscape).join(','));
    }

    const csv = lines.join('\n');
    const filename = 'reporte-mensual-' + cliente.nombre.replace(/[^a-z0-9]/gi, '-').toLowerCase() + '-' + mes + '.csv';

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="' + filename + '"',
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('Error en reporte mensual portal:', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}