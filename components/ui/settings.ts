export const SETTINGS_SVG: string = `<!-- Icon: Settings (whimsical gear) -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-label="Settings" fill="none">
  

  <defs>
    <!-- Gear center glow -->
    <radialGradient id="gearFill" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(12 12) rotate(90) scale(8)">
      <stop offset="0" stop-color="#FFF3E0"/>
      <stop offset="1" stop-color="#FFB84D"/>
    </radialGradient>
  </defs>

  <!-- Outer gear (organic teeth) -->
  <path stroke="#FF6B35" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" d="M12 3.8l1.2 1.7 2.1-.3.6 2 2 .7-.4 2.1 1.7 1.2-1.2 1.7.4 2.1-2 .7-.6 2-2.1-.3L12 20.2l-1.2-1.7-2.1.3-.6-2-2-.7.4-2.1L4.8 12l1.7-1.2-.4-2.1 2-.7.6-2 2.1.3L12 3.8Z"/>
  <g transform="translate(.2 .2)">
    <path stroke="#D84315" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity=".22" d="M12 3.8l1.2 1.7 2.1-.3.6 2 2 .7-.4 2.1 1.7 1.2-1.2 1.7.4 2.1-2 .7-.6 2-2.1-.3L12 20.2l-1.2-1.7-2.1.3-.6-2-2-.7.4-2.1L4.8 12l1.7-1.2-.4-2.1 2-.7.6-2 2.1.3L12 3.8Z"/>
  </g>

  <!-- Center (filled) -->
  <circle cx="12" cy="12" r="3.6" fill="url(#gearFill)"/>
  <circle cx="12" cy="12" r="3.6" stroke="#FF6B35" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`