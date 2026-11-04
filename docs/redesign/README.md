# Translucent colour edition — verification

4 November 2026 · Sunbeam · AGL202607071 · D=1.

The user requested distinct translucent colours on every card and a luxury/premium redesign. Deep navy, gold and the locally bundled Alegreya Sans remain the visual identity. Sapphire, jade, peach, lilac, rose and champagne surfaces replace the original uniform white panels. Figures now have individual coloured cards; forms, dialogs, nested evidence records, outage timings and the sign-in workspace receive coordinated treatments. The sign-in illustration is resolution-independent SVG, showing the feeder/evidence/human-review sequence.

## Completed checks

- All six screens inspected at desktop width 1440; all six at phone width 390. No horizontal document overflow was measured. Desktop sign-in width was also measured at exactly 1440 with no overflow.
- Alegreya Sans reported loaded by the browser. Overview panel backgrounds were confirmed as distinct RGBA values with alpha 0.72–0.76; text remains opaque.
- Rendered text samples collected from all six screens: 281 text elements. Composite foreground/background contrast calculations found no failures against 4.5:1 normal text / 3:1 large text thresholds. This targeted check is not a full WCAG or axe-core audit. Raw samples and results are saved alongside this file.
- Browser checks: empty search results, restored visit list, native evidence dialog, close action, policy assistant disconnection refusal and logout.
- `npm test`: all 9 integration tests passed. `node --check` passed for the server and client JavaScript.
- Source preview uses http://localhost:3000. Deployment update results and additional commands are recorded separately in `../lab-evidence/`; original initial-deployment counts remain Docker 6 and Dokku 10.

The original app's data and authorization model are preserved. Existing VM volumes must remain attached during the redesign rollout. No real customer information, model scores or regulatory cap values are introduced.
