// API pou voye Kit Kado Dijital la pa imèl ak Resend API / Cloudflare
// Sipòte tou de Resend API Pro ak fallback simulasyon

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Mòd sa a pa otorize (Sèlman POST)' });
  }

  const { email, recipient, sender, cardLink, title, attachments } = req.body || {};

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Adrès imèl la pa valab' });
  }

  const senderName = (sender || 'Yon moun espesyal').trim();
  const recipientName = (recipient || 'Zanmi m').trim();
  const cardTitle = (title || 'Bèl Kat Ve & Swè Dijital').trim();
  const link = cardLink || 'https://katdijital.ht';

  const emailHtml = `
<!DOCTYPE html>
<html lang="ht">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kit Kado KatDijital</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F7F5EE; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #2C2C2C;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F7F5EE; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #EADBBA; max-width: 600px;">
          <tr>
            <td align="center" style="background: linear-gradient(135deg, #0F1E14 0%, #1E3D29 100%); padding: 32px 20px;">
              <table border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <div style="width: 52px; height: 52px; border-radius: 50%; background: radial-gradient(circle, #F5D77F 0%, #C99726 70%, #543603 100%); border: 1.5px solid #FFF5D6; line-height: 52px; text-align: center; color: #2B1D04; font-size: 19px; font-weight: 900; letter-spacing: 1px;">
                      KD
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 12px;">
                    <span style="font-size: 20px; font-weight: 800; letter-spacing: 2px; color: #FFFFFF;">KAT</span>
                    <span style="font-size: 20px; font-weight: 800; letter-spacing: 2px; color: #D4AF37;">DIJITAL</span>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 4px;">
                    <span style="font-size: 11px; letter-spacing: 1.5px; color: #B3C2B8; text-transform: uppercase;">Papetri Dijital de Liks • 100% Pèsonalize</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 36px 32px 28px;">
              <h2 style="font-size: 21px; font-weight: 700; color: #1E3D29; margin: 0 0 16px 0; text-align: center;">
                Kit Kado Dijital VIP Ou a Pare
              </h2>
              
              <p style="font-size: 15px; line-height: 1.6; color: #4A4A4A; margin: 0 0 16px 0;">
                Bonjou,
              </p>

              <p style="font-size: 15px; line-height: 1.6; color: #4A4A4A; margin: 0 0 24px 0;">
                Fichye ofisyèl kit kado pèsonalize ou te prepare pou <strong>${recipientName}</strong> de la pati <strong>${senderName}</strong> pare. Kat sa a sele e li disponib kounye a sou platfòm sekirize KatDijital la.
              </p>

              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 28px 0;">
                <tr>
                  <td align="center">
                    <a href="${link}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #1E3D29 0%, #152B1D 100%); color: #F5D77F; font-size: 14px; font-weight: 700; letter-spacing: 1px; text-decoration: none; padding: 14px 34px; border-radius: 999px; border: 1px solid #D4AF37; box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);">
                      OUVRI KAT KADO A (3D AK MIZIK)
                    </a>
                  </td>
                </tr>
              </table>

              <div style="background-color: #FAF8F2; border: 1px solid #E8DFCE; border-radius: 8px; padding: 18px 20px; margin: 24px 0;">
                <p style="font-size: 12px; font-weight: 700; color: #8A6518; margin: 0 0 12px 0; letter-spacing: 0.8px; text-transform: uppercase;">
                  Pake Kit Kado Tout-An-Un Ki Enkli :
                </p>
                <ul style="font-size: 13.5px; line-height: 1.6; color: #555555; margin: 0; padding-left: 20px;">
                  <li style="margin-bottom: 6px;"><strong>Lyen Entèaktif 3D :</strong> Ouvèti anvlòp la ak animasyon reyèl ak mizik.</li>
                  <li style="margin-bottom: 6px;"><strong>Imaj Segondè Rezolisyon (PNG HD) :</strong> Atache nan imèl sa a pou enprime oswa kenbe.</li>
                  <li style="margin-bottom: 6px;"><strong>QR Code Kado Spesyal (PNG) :</strong> Atache nan imèl sa a pou kole sou kado fizik.</li>
                  <li style="margin-bottom: 6px;"><strong>Raccourci Aksè Dirèk (HTML) :</strong> Atache pou ouvri fasil sou nenpòt aparèy.</li>
                  <li><strong>Modèl chwazi :</strong> ${cardTitle}</li>
                </ul>
              </div>

              <p style="font-size: 13px; color: #2B4736; background: #EBF2EC; border-left: 3px solid #2B4736; padding: 10px 14px; border-radius: 4px; margin: 20px 0;">
                📎 <strong>Fichye Atache :</strong> Tout fichye kit ou a atache dirèkteman anba imèl sa a pou w ka telechaje yo an yon sèl klik.
              </p>

              <p style="font-size: 12px; color: #888888; margin: 20px 0 6px 0; word-break: break-all;">
                Si bouton an pa louvri dirèkteman, ou ka kopye lyen sa a nan navigatè w la :<br>
                <a href="${link}" style="color: #1E3D29; text-decoration: underline;">${link}</a>
              </p>
            </td>
          </tr>

          <tr>
            <td align="center" style="background-color: #F1EFEA; padding: 20px 24px; border-top: 1px solid #E5DFD3;">
              <p style="font-size: 11.5px; color: #777777; margin: 0 0 4px 0;">
                © 2026 KatDijital • Bèl Kat Ve & Swè Dijital pou Tout Okazyon
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const resendApiKey = process.env.RESEND_API_KEY;
  const fromAddress = process.env.EMAIL_FROM || 'KatDijital <no-reply@mail.lectus.club>';

  if (resendApiKey) {
    try {
      const emailPayload = {
        from: fromAddress,
        to: [email],
        subject: `Kit Kado KatDijital pou ${recipientName} (Voye pa ${senderName})`,
        html: emailHtml,
      };

      if (attachments && Array.isArray(attachments) && attachments.length > 0) {
        emailPayload.attachments = attachments.map((att) => ({
          filename: att.filename,
          content: att.content,
        }));
      }

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailPayload),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error('Erreur API Resend:', errText);
        return res.status(200).json({
          success: true,
          simulated: true,
          warning: 'Erreur livrezon imèl, men kit la rete disponib nan telechajman dirèk.',
        });
      }

      const resData = await response.json();
      return res.status(200).json({
        success: true,
        message: 'Imèl voye ak siksè !',
        data: resData,
      });
    } catch (e) {
      console.error('Erreur requete Resend:', e);
      return res.status(200).json({
        success: true,
        simulated: true,
        message: 'Kit kado a anrejistre pou voye nan adrès ou !',
      });
    }
  }

  return res.status(200).json({
    success: true,
    simulated: true,
    message: 'Kit kado a anrejistre pou voye nan adrès ou !',
  });
}
