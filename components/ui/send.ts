export const SEND_SVG: string = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-label="Send" fill="none">
  

  <defs>
    <!-- Warm gradient fill for the plane -->
    <linearGradient id="sendFill" x1="4" y1="20" x2="20" y2="6" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#FFF3E0"/>
      <stop offset="1" stop-color="#FFB84D"/>
    </linearGradient>
  </defs>

  <!-- Plane body (filled) -->
  <path fill="url(#sendFill)" d="M3.8 11.7 20.2 4.8c.7-.3 1.3.4 1 .9l-6.8 16.4c-.2.6-1 .6-1.3.1l-3.2-5.2-5.2-3.2c-.5-.3-.5-1.1.1-1.3Z"/>

  <!-- Plane outline -->
  <path stroke="#FF6B35" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" d="M3.8 11.7 20.2 4.8c.7-.3 1.3.4 1 .9l-6.8 16.4c-.2.6-1 .6-1.3.1l-3.2-5.2-5.2-3.2c-.5-.3-.5-1.1.1-1.3Z"/>
  <g transform="translate(.2 .2)">
    <path stroke="#D84315" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity=".22" d="M3.8 11.7 20.2 4.8c.7-.3 1.3.4 1 .9l-6.8 16.4c-.2.6-1 .6-1.3.1l-3.2-5.2-5.2-3.2c-.5-.3-.5-1.1.1-1.3Z"/>
  </g>

  <!-- Fold line -->
  <path stroke="#FF6B35" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" d="M9.9 17 21 5.9"/>
</svg>`