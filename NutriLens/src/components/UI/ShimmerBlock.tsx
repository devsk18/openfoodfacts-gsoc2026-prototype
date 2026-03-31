const ShimmerBlock = () => (
  <div class="h-16 flex-1 bg-gray-100 rounded-lg relative overflow-hidden">
    <div 
      class="absolute inset-0 animate-shimmer"
      style="background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)"
    />
  </div>
);

export default ShimmerBlock;