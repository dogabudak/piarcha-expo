export const PROFILE_SVG: string = `<!-- Icon: User / Profile (friendly avatar) -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-label="User" fill="none">
  

  <defs>
    <linearGradient id="userFill" x1="7" y1="18" x2="17" y2="6" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#FFF3E0"/>
      <stop offset="1" stop-color="#FFB84D"/>
    </linearGradient>
  </defs>

  <!-- Head (filled) -->
  <circle cx="12" cy="9" r="3.6" fill="url(#userFill)"/>
  <circle cx="12" cy="9" r="3.6" stroke="#FF6B35" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <g transform="translate(.2 .2)"><circle stroke="#D84315" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity=".22" cx="12" cy="9" r="3.6"/></g>

  <!-- Shoulders (hug-like curve) -->
  <path stroke="#FF6B35" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" d="M5.4 20.2c1.8-3.5 4.2-5.2 6.6-5.2s4.8 1.7 6.6 5.2"/>
  <g transform="translate(.2 .2)"><path stroke="#D84315" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity=".22" d="M5.4 20.2c1.8-3.5 4.2-5.2 6.6-5.2s4.8 1.7 6.6 5.2"/></g>
</svg>`