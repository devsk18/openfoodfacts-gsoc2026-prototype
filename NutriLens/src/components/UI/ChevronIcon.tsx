const ChevronIcon = ({ open }: { open: boolean }) => (
  <span class={`flex items-center text-gray-700 transition-transform duration-250 ${open ? 'rotate-180' : ''}`}>
    <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="24">
      <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06z" clip-rule="evenodd"/>
    </svg>
  </span>
);

export default ChevronIcon;