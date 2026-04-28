import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const CONCIERGE_EMAIL = 'rbrito@relaxinnhomes.com'

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const body = await req.json()
    const { filename, fileBase64, guestName, email, checkIn, checkOut } = body

    if (!filename || !fileBase64) {
      return new Response(JSON.stringify({ error: 'Missing filename or fileBase64' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const { data, error } = await resend.emails.send({
      from: 'RelaxInn Itinerarios <itinerarios@relaxinnhomes.com>',
      to: [CONCIERGE_EMAIL],
      subject: `Nuevo Itinerario — ${guestName || 'Cliente'} · ${checkIn || 'Sin fecha'}`,
      html: buildEmailHtml({ guestName, email, checkIn, checkOut }),
      attachments: [
        {
          filename,
          content: fileBase64,
          contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        },
      ],
    })

    if (error) {
      console.error('Resend error:', error)
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ success: true, id: data?.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Handler error:', err)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

/* ── Email body for concierge ────────────── */

interface EmailMeta {
  guestName?: string
  email?: string
  checkIn?: string
  checkOut?: string
}

function buildEmailHtml({ guestName, email, checkIn, checkOut }: EmailMeta): string {
  return `
    <div style="font-family: Calibri, sans-serif; color: #2E3530; max-width: 520px;">
      <h2 style="font-family: Georgia, serif; font-weight: 300; color: #4A7C6B;">
        Nuevo itinerario recibido
      </h2>
      <table style="font-size: 14px; border-collapse: collapse;">
        <tr>
          <td style="padding: 6px 16px 6px 0; color: #8A9189;">Huésped</td>
          <td style="padding: 6px 0;">${guestName || '—'}</td>
        </tr>
        <tr>
          <td style="padding: 6px 16px 6px 0; color: #8A9189;">Email</td>
          <td style="padding: 6px 0;">${email || '—'}</td>
        </tr>
        <tr>
          <td style="padding: 6px 16px 6px 0; color: #8A9189;">Check-in</td>
          <td style="padding: 6px 0;">${checkIn || '—'}</td>
        </tr>
        <tr>
          <td style="padding: 6px 16px 6px 0; color: #8A9189;">Check-out</td>
          <td style="padding: 6px 0;">${checkOut || '—'}</td>
        </tr>
      </table>
      <p style="margin-top: 20px; font-size: 13px; color: #8A9189;">
        El documento .docx está adjunto. Descárgalo, completa los campos pendientes
        (resaltados en amarillo), conviértelo a PDF y envíalo al cliente.
      </p>
      <hr style="border: none; border-top: 1px solid #B4BAB6; margin: 24px 0;" />
      <p style="font-size: 11px; color: #B4BAB6; letter-spacing: 1px;">
        RELAXINN VACATION HOMES · Punta Cana
      </p>
    </div>
  `
}
