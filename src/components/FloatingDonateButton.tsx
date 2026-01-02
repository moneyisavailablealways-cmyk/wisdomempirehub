import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export function FloatingDonateButton() {
  const [position, setPosition] = useState({ x: 20, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setHasMoved(false);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setHasMoved(false);
    setDragStart({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setHasMoved(true);
      const newX = Math.max(0, Math.min(window.innerWidth - 120, e.clientX - dragStart.x));
      const newY = Math.max(0, Math.min(window.innerHeight - 60, e.clientY - dragStart.y));
      setPosition({ x: newX, y: newY });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      setHasMoved(true);
      const touch = e.touches[0];
      const newX = Math.max(0, Math.min(window.innerWidth - 120, touch.clientX - dragStart.x));
      const newY = Math.max(0, Math.min(window.innerHeight - 60, touch.clientY - dragStart.y));
      setPosition({ x: newX, y: newY });
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, dragStart]);

  const handleClick = (e: React.MouseEvent) => {
    if (hasMoved) {
      e.preventDefault();
    }
  };

  return (
    <div
      ref={buttonRef}
      className="fixed z-50 cursor-grab active:cursor-grabbing select-none"
      style={{
        left: position.x,
        top: position.y,
        touchAction: 'none',
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <Link
        to="/donate"
        onClick={handleClick}
        className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow animate-pulse-glow"
      >
        <Heart className="h-5 w-5 animate-heartbeat" />
        <span className="font-semibold text-sm whitespace-nowrap">Donate</span>
      </Link>
    </div>
  );
}
