# Design QA — Servicios

- Source visual truth: `C:\Users\Usuario\Desktop\Atrion\atrionservices.png`
- Implementation: `http://127.0.0.1:4200/servicios`
- Implementation screenshot: browser capture inspected in-session (desktop viewport and responsive 500 CSS px viewport)
- Source pixels: 946 × 1684
- Desktop capture: 1823 × 977 pixels, default browser density
- Mobile capture: 500 CSS px content width, browser responsive override, no density normalization required for layout review
- State: Automatización selected initially; all six service states exercised

## Full-view comparison evidence

The implementation preserves the reference's light gridded surface, dark navy typography, violet emphasis, split hero with technological imagery, dark methodology band and centered closing CTA. Per the written specification, the portfolio grid shown in the screenshot was intentionally replaced with a vertical service selector and one detailed service panel.

## Focused-region evidence

- Hero: heading hierarchy, violet second line, paired CTAs and right-aligned official service image checked at desktop and mobile widths.
- Explorer: active lavender state, numbered selector, image crop, title, description, benefits and actions checked. All six tabs update their corresponding image and content.
- Responsive: at 500 CSS px the selector becomes horizontally scrollable above the single-column detail; `scrollWidth` equals `clientWidth`, so the page has no horizontal overflow.
- Methodology and CTA: semantic order, four steps and contact destination checked in the browser accessibility tree.
- Header/footer: hashes captured before and after implementation are identical for the header files and for the footer HTML/CSS blocks.

## Fidelity surfaces

- Fonts and typography: preserved `Bahnschrift Atrion` through the existing project variables and global font face; no font imports added.
- Spacing and layout rhythm: hero, explorer, methodology and CTA follow the reference's generous desktop rhythm and collapse cleanly on mobile.
- Colors and visual tokens: existing Atrion navy, violet, lavender and light-neutral values reused.
- Image quality and asset fidelity: the seven supplied realistic assets were preserved as PNG and served through optimized JPG derivatives in `/imagenes/servicios/realistas`; hero and all six service crops were visually checked. No logos or brand imagery were changed or invented.
- Copy and content: retained all six existing services and their real descriptions/benefits, with concise menu labels.

## Interaction and accessibility checks

- Six service selections: passed.
- “Siguiente” cyclic navigation: passed.
- Keyboard Arrow keys, Home and End: passed.
- Roving `tabindex`, tab/tabpanel relationships and focus styles: passed.
- “Explorar servicios” same-page scroll: passed after correction.
- Contact links point to `/contacto`: passed.
- Browser console: no runtime errors; only the pre-existing Angular oversized-logo warning from the unchanged header/footer asset.
- Image loading: all seven new sources loaded with non-zero natural dimensions; no broken images detected.
- Reduced-motion rules: present and disable transitions/animations.

## Comparison history

1. P1: “Explorar servicios” resolved against Angular's base URL and navigated to `/#soluciones`. Fixed with an explicit `/servicios#soluciones` URL and controlled same-page scrolling. Post-fix evidence: URL remained `/servicios#soluciones`, section top measured `0`, and scroll position changed to the explorer.
2. P2: mobile horizontal overflow risk. Post-check evidence: `clientWidth: 500`, `scrollWidth: 500`, `overflow: false`.

## Follow-up polish

- P3: Angular reports that the unchanged Atrion logo raster is larger than its rendered size. Optimizing that shared asset is intentionally outside this task's scope.

final result: passed

---

# Design QA — Contacto

- Source visual truth: `C:\Users\Usuario\Desktop\Atrion\paginaWebAtrion2\.design-qa\contacto-opcion-1-reference.png`
- Implementation: `http://127.0.0.1:4200/contacto`
- Implementation screenshots: `.design-qa/contacto-desktop.png` and `.design-qa/contacto-mobile.png`
- Combined comparison: `.design-qa/contacto-comparison.png`
- Source pixels: 1003 × 1600
- Desktop capture: 1440 × 1800 at device scale factor 1
- Mobile capture: 390 × 844 at device scale factor 1
- State: empty form with the native reason selector closed, as required for the implemented initial state

## Full-view comparison evidence

The combined comparison confirms the light editorial surface, approximately 40/60 column split, vertical rule, large left headline, integrated right-side form, fine lavender borders, violet CTA, process separators and lower-left brand composition. The reference displays the reason menu open only to illustrate its options; the implementation correctly starts closed.

## Focused-region evidence

- Form: all ten original fields are present. The eight reason options were checked in the accessibility tree and keyboard selection changed the value to “Software a la medida”.
- Grouping: “Información adicional (opcional)” encloses only Empresa and Cargo; País / Ubicación, Ciudad and Consulta remain outside it.
- Editorial column: three numbered circular steps, working mail link, location icon, official Atrion isotipo outline and both decorative copy blocks were visually checked.
- Mobile: content order is introduction → form → process/contact information; fields collapse to one column and measured horizontal overflow is absent.
- States: six missing-required-field messages appeared after an invalid submit. Success, error, invalid and duplicate-prevention behavior passed isolated fetch simulations without contacting `/api/contact`.

## Fidelity surfaces

- Fonts and typography: existing Bahnschrift Atrion variables remain in use; no global typography changes were made.
- Spacing and layout rhythm: desktop column proportions, heading hierarchy, form density and separators follow the source. Breakpoint spacing compensates for the unchanged fixed header.
- Colors and visual tokens: official navy `#020733`, violet `#4312f8`, deep violet `#220266` and lavender accents are retained.
- Image quality and asset fidelity: the decorative symbol is derived from the official local Atrion isotipo, with its background removed and its silhouette converted to a fine outline. No logo was recreated.
- Copy and content: required process, contact details, labels, options and confirmation/spam copy are preserved; no new promises or requirements were added.

## Comparison history

1. P1: at the existing header’s stacked breakpoints, Contacto began underneath the fixed header. Fixed with component-scoped top spacing at tablet and mobile widths. Post-fix evidence: mobile header bottom measured 122.7px and Contacto begins at 142px.
2. P2: the initial selector decoration used a text glyph and the official isotipo appeared filled. Fixed by retaining the browser-native accessible select arrow, using Material Symbols for utility icons, and producing an outline from the official isotipo pixels. Post-fix evidence is visible in the final desktop/mobile captures.

## Verification

- Production build: passed.
- Contacto unit simulations: 4 passed.
- Keyboard selector and eight options: passed.
- Visible required-field validation: passed.
- Fresh browser console: no runtime errors. One pre-existing Angular image-size warning remains for the unchanged shared `imagenes/atrionlogo.png` asset.
- Header, footer, global typography and other pages were not edited for this implementation.

final result: passed
