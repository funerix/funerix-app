'use client'

import jsPDF from 'jspdf'

interface PreventivoData {
  nomeCliente: string
  configurazione: string
  totale: number
  data: string
  agenzia?: string
}

export function generaPDFPreventivo(data: PreventivoData) {
  const doc = new jsPDF()
  const w = doc.internal.pageSize.getWidth()

  // Header
  doc.setFillColor(44, 62, 80)
  doc.rect(0, 0, w, 35, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(22)
  doc.text('FUNERIX', 20, 20)
  doc.setFontSize(9)
  doc.text('Preventivo Indicativo', 20, 28)
  doc.text(data.data, w - 20, 20, { align: 'right' })

  // Info cliente
  doc.setTextColor(44, 62, 80)
  doc.setFontSize(12)
  doc.text('Preventivo per:', 20, 50)
  doc.setFontSize(16)
  doc.text(data.nomeCliente, 20, 58)

  // Linea
  doc.setDrawColor(139, 115, 85)
  doc.setLineWidth(0.5)
  doc.line(20, 64, w - 20, 64)

  // Voci preventivo
  doc.setFontSize(10)
  let y = 75

  const righe = data.configurazione.split('\n').filter(Boolean)
  for (const riga of righe) {
    const match = riga.match(/(.+?):\s*(.+?)(?:\s*—\s*€(.+))?$/)
    if (match) {
      doc.setTextColor(107, 114, 128)
      doc.setFontSize(8)
      doc.text(match[1].toUpperCase(), 20, y)
      doc.setTextColor(44, 62, 80)
      doc.setFontSize(10)
      doc.text(match[2], 20, y + 5)
      if (match[3]) {
        doc.setFontSize(11)
        doc.text(`€ ${match[3]}`, w - 20, y + 5, { align: 'right' })
      }
      y += 14
    } else {
      doc.setTextColor(44, 62, 80)
      doc.setFontSize(10)
      doc.text(riga, 20, y)
      y += 8
    }

    if (y > 260) {
      doc.addPage()
      y = 20
    }
  }

  // Totale
  y += 5
  doc.setDrawColor(44, 62, 80)
  doc.setLineWidth(1)
  doc.line(20, y, w - 20, y)
  y += 10
  doc.setFontSize(14)
  doc.setTextColor(44, 62, 80)
  doc.text('TOTALE INDICATIVO', 20, y)
  doc.setFontSize(18)
  doc.text(`€ ${data.totale.toLocaleString('it-IT')}`, w - 20, y, { align: 'right' })

  // Disclaimer
  y += 15
  doc.setFontSize(7)
  doc.setTextColor(156, 163, 175)
  const disclaimer = "Il presente preventivo ha valore meramente indicativo e informativo ai sensi dell'art. 1336 del Codice Civile e non costituisce offerta al pubblico né proposta contrattuale vincolante. I prezzi indicati sono orientativi e possono variare. Il preventivo definitivo sarà formulato a seguito di un colloquio diretto con la famiglia, nel rispetto della L.R. Campania n. 12/2001 e del D.Lgs. 206/2005."
  const lines = doc.splitTextToSize(disclaimer, w - 40)
  doc.text(lines, 20, y)

  // Footer
  const pageH = doc.internal.pageSize.getHeight()
  doc.setFontSize(8)
  doc.setTextColor(156, 163, 175)
  doc.text(data.agenzia || 'Funerix — Servizi Funebri', w / 2, pageH - 10, { align: 'center' })

  // Download
  doc.save(`preventivo-${data.nomeCliente.replace(/\s+/g, '-').toLowerCase()}.pdf`)
}

export function generaPDFManifesto(dati: Record<string, string>) {
  const doc = new jsPDF({ orientation: 'landscape' })
  const w = doc.internal.pageSize.getWidth()
  const h = doc.internal.pageSize.getHeight()

  // Bordo
  doc.setDrawColor(139, 115, 85)
  doc.setLineWidth(1.5)
  doc.rect(10, 10, w - 20, h - 20)
  doc.setLineWidth(0.3)
  doc.rect(14, 14, w - 28, h - 28)

  // Croce
  const cx = w / 2
  doc.setFontSize(24)
  doc.setTextColor(44, 62, 80)
  doc.text('✝', cx, 30, { align: 'center' })

  // Nome
  doc.setFontSize(26)
  let nome = ''
  if (dati.titolo) nome += dati.titolo + ' '
  nome += dati.nome_defunto || ''
  doc.text(nome, cx, 45, { align: 'center' })

  // Soprannome
  let y = 52
  if (dati.soprannome) {
    doc.setFontSize(14)
    doc.setTextColor(139, 115, 85)
    doc.text(`detto "${dati.soprannome}"`, cx, y, { align: 'center' })
    y += 8
  }

  // Età
  if (dati.eta) {
    doc.setFontSize(11)
    doc.setTextColor(156, 163, 175)
    doc.text(`di anni ${dati.eta}`, cx, y, { align: 'center' })
    y += 8
  }

  // Separatore
  y += 4
  doc.setDrawColor(139, 115, 85)
  doc.setLineWidth(0.3)
  doc.line(cx - 25, y, cx + 25, y)
  y += 10

  // Testo
  if (dati.manifesto_testo) {
    doc.setFontSize(12)
    doc.setTextColor(51, 51, 51)
    const lines = doc.splitTextToSize(dati.manifesto_testo, w - 80)
    doc.text(lines, cx, y, { align: 'center' })
    y += lines.length * 6 + 4
  }

  if (dati.manifesto_familiari) {
    doc.setFontSize(10)
    doc.setTextColor(107, 114, 128)
    const lines = doc.splitTextToSize(dati.manifesto_familiari, w - 80)
    doc.text(lines, cx, y, { align: 'center' })
    y += lines.length * 5 + 6
  }

  if (dati.manifesto_cerimonia) {
    doc.setDrawColor(229, 225, 219)
    doc.line(cx - 40, y, cx + 40, y)
    y += 8
    doc.setFontSize(11)
    doc.setTextColor(44, 62, 80)
    const lines = doc.splitTextToSize(dati.manifesto_cerimonia, w - 80)
    doc.text(lines, cx, y, { align: 'center' })
  }

  // Agenzia
  doc.setFontSize(7)
  doc.setTextColor(156, 163, 175)
  doc.text(dati.agenzia_nome || 'Funerix', w - 18, h - 16, { align: 'right' })

  doc.save(`manifesto-${(dati.nome_defunto || 'funebre').replace(/\s+/g, '-').toLowerCase()}.pdf`)
}
