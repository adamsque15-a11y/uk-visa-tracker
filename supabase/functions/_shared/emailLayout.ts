// Shared branded HTML wrapper for every outbound email. Colors are copied
// literal hex values from lib/theme.ts's `colors` export (primary #1a3c6e,
// textPrimary #101828, textTertiary #98a2b3, border #e4e7ec,
// surfaceSubtle #f7f8fa) — Edge Functions can't import lib/theme.ts across
// the deploy boundary, so keep these in sync by hand if the palette changes.

interface EmailLayoutOptions {
  bodyHtml: string;
  unsubscribeUrl: string;
  siteUrl: string;
}

export function emailLayout({ bodyHtml, unsubscribeUrl, siteUrl }: EmailLayoutOptions): string {
  return `<!DOCTYPE html>
<html>
  <body style="margin:0;background:#f7f8fa;font-family:-apple-system,Helvetica,Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e4e7ec;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="background:#ffffff;padding:20px 24px;border-bottom:1px solid #e4e7ec;">
                <img src="${siteUrl}/logo-wordmark.png" width="160" alt="UK Visa Tracker" style="display:block;height:auto;border:0;" />
              </td>
            </tr>
            <tr>
              <td style="padding:24px;color:#101828;font-size:15px;line-height:22px;">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:16px 24px;border-top:1px solid #e4e7ec;color:#98a2b3;font-size:12px;line-height:18px;">
                Independent &amp; unaffiliated with UKVI or the Home Office.<br />
                <a href="${unsubscribeUrl}" style="color:#98a2b3;">Unsubscribe from reminder emails</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/** Standalone confirmation page (not wrapped in emailLayout) — used by the unsubscribe function, which returns HTML directly rather than sending an email. */
export function standalonePage(bodyHtml: string, siteUrl: string): string {
  return `<!DOCTYPE html>
<html>
  <body style="margin:0;background:#f7f8fa;font-family:-apple-system,Helvetica,Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:48px 16px;">
          <table width="420" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e4e7ec;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="background:#ffffff;padding:20px 24px;border-bottom:1px solid #e4e7ec;">
                <img src="${siteUrl}/logo-wordmark.png" width="160" alt="UK Visa Tracker" style="display:block;height:auto;border:0;" />
              </td>
            </tr>
            <tr>
              <td style="padding:24px;color:#101828;font-size:15px;line-height:22px;">
                ${bodyHtml}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
