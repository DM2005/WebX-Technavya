export const AiIcon = () => (
<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 20 20" fill="none">
    <defs>
      <linearGradient id="sleekGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00D4FF" stopOpacity="1" />
        <stop offset="100%" stopColor="#10B981" stopOpacity="1" />
      </linearGradient>
      <linearGradient id="darkSleekGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0891B2" stopOpacity="1" />
        <stop offset="100%" stopColor="#047857" stopOpacity="1" />
      </linearGradient>
      <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#67E8F9" stopOpacity="1" />
        <stop offset="100%" stopColor="#6EE7B7" stopOpacity="1" />
      </linearGradient>
    </defs>
    <g transform="rotate(180 10 10)">
      <path d="M14.5039 4C15.8846 4 17.0039 5.11929 17.0039 6.5V13.5C17.0039 14.8807 15.8846 16 14.5039 16H5.50391C4.12319 16 3.00391 14.8807 3.00391 13.5V6.5C3.00391 5.11929 4.12319 4 5.50391 4H14.5039Z" fill="url(#sleekGradient)" stroke="#1F2937" stroke-width="0.3" />
      <path d="M5 12C5 10.8954 5.89543 10 7 10H13C14.1046 10 15 10.8954 15 12C15 13.1046 14.1046 14 13 14H7C5.89543 14 5 13.1046 5 12Z" fill="#1A1A1A" stroke="#0F0F0F" stroke-width="0.2" />
      <rect width="2" height="2" rx="1" transform="matrix(1 0 0 -1 7 13)" fill="url(#accentGradient)" stroke="#374151" stroke-width="0.1" />
      <rect width="2" height="2" rx="1" transform="matrix(1 0 0 -1 11 13)" fill="url(#accentGradient)" stroke="#374151" stroke-width="0.1" />
      <rect y="9.00195" width="2" height="4" rx="1" fill="url(#sleekGradient)" stroke="#1F2937" stroke-width="0.2" />
      <rect x="18" y="9.00195" width="2" height="4" rx="1" fill="url(#sleekGradient)" stroke="#1F2937" stroke-width="0.2" />
    </g>

    {/* Eyes */}
    <circle cx="8" cy="8" r="0.5" fill="#FFFFFF" stroke="#1F2937" stroke-width="0.1" />
    <circle cx="12" cy="8" r="0.5" fill="#FFFFFF" stroke="#1F2937" stroke-width="0.1" />
    <circle cx="8" cy="8" r="0.2" fill="#1A1A1A" />
    <circle cx="12" cy="8" r="0.2" fill="#1A1A1A" />
    
</svg>
);


export const Ai2Icon = ()=>{
  return (
    <svg xmlns:xlink="http://www.w3.org/1999/xlink" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="16" fill="#252526"></rect><path d="M10 12.25C10 11.0074 11.0074 10 12.25 10H19.75C20.9926 10 22 11.0074 22 12.25V19.75C22 20.9926 20.9926 22 19.75 22H12.25C11.0074 22 10 20.9926 10 19.75V12.25Z" fill="#C4C4CC"></path><g filter="url(#filter0_d_2657_18603)"><rect x="11.5" y="13" width="9" height="4.5" rx="2.25" fill="#0F0F10"></rect></g><rect x="13.75" y="14.5" width="1.5" height="1.5" rx="0.75" fill="#C4C4CC"></rect><rect x="16.75" y="14.5" width="1.5" height="1.5" rx="0.75" fill="#C4C4CC"></rect><rect x="7" y="13" width="1.5" height="3.75" rx="0.75" fill="#C4C4CC"></rect><rect x="23.5" y="13" width="1.5" height="3.75" rx="0.75" fill="#C4C4CC"></rect><defs><filter id="filter0_d_2657_18603" x="9.25" y="11.875" width="13.5" height="9" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix><feOffset dy="1.125"></feOffset><feGaussianBlur stdDeviation="1.125"></feGaussianBlur><feComposite in2="hardAlpha" operator="out"></feComposite><feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.3 0"></feColorMatrix><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2657_18603"></feBlend><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2657_18603" result="shape"></feBlend></filter></defs></svg>
  )
}
