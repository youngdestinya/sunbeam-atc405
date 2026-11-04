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

## Supplied login reference

The user then supplied a split-card login reference. The final sign-in uses a centered rounded white card, a form on the left and a curved deep-navy service panel on the right. Sunbeam's identity, gold accents and Alegreya Sans are retained. The workspace selector updates the displayed service and username; the server still authenticates each account and assigns its role.

Browser-verified controls: switching field/reviewer workspaces, wrong-password feedback and focus, show/hide password, sign-in help dialog, successful reviewer login, successful field-officer login and logout. Phone width 390 measured 375 pixels of document content with no horizontal overflow; Alegreya Sans was loaded. On phones, the form precedes the branded panel. All 9 backend integration tests passed after this change.

Screenshots named `reference-login-*` show this final composition. The earlier `desktop-login.png` records the preceding visual iteration, not the final supplied-reference layout.

## Default viewport fit
The login now adapts spacing and card width to desktop height. Verified with all controls visible and no document overflow at 1440 x 900, 1366 x 768 and 1280 x 720. No browser zoom or CSS scaling is required. Phones retain readable stacked content and normal scrolling. Measurements: viewport-fit-checks.json; screenshot: screenshots/viewport-fit-desktop.png.

Viewport-fit release ed770e6 was deployed successfully to Docker (8081) and Dokku (8082). Both served stylesheets match source after newline normalization. Both post-deployment checks passed, including retained visit evidence and appeal reviews. The final deployed desktop screenshot is screenshots/viewport-fit-deployed.png.
