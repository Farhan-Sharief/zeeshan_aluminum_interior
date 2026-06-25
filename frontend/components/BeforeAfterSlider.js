'use client';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

export default function BeforeAfterSlider({ beforeImage, afterImage, heightClass = 'h-[400px] md:h-[500px]' }) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      className={`relative w-full ${heightClass} overflow-hidden select-none rounded-xl shadow-lg border border-gray-200 cursor-ew-resize`}
    >
      {/* Before Image (Left/Full Background) */}
      <div className="absolute inset-0">
        <Image
          src={beforeImage}
          alt="Before"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded">
          Before
        </div>
      </div>

      {/* After Image (Right/Clip Path Overlay) */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
      >
        <Image
          src={afterImage}
          alt="After"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute top-4 right-4 bg-gold backdrop-blur-sm text-white px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded">
          After
        </div>
      </div>

      {/* Slider Control Line */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
      >
        {/* Handle Button */}
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full shadow-xl border border-gold/30 flex items-center justify-center z-30 select-none pointer-events-none">
          <div className="flex gap-1">
            <span className="w-1 h-3 bg-gold rounded-full" />
            <span className="w-1 h-3 bg-gold rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
