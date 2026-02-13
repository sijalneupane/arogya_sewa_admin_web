import { ReactNode, useState, useEffect, useRef } from 'react';
import { X, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';

interface ImagePreviewProps {
  src: string;
  alt?: string;
  title?: string;
  children?: ReactNode;
  className?: string;
}

export function ImagePreview({ src, alt = 'Preview', title, children, className = '' }: ImagePreviewProps) {
  const [open, setOpen] = useState(false);
  const transformRef = useRef<ReactZoomPanPinchRef | null>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleClose = () => {
    setOpen(false);
    if (transformRef.current) {
      transformRef.current.resetTransform();
    }
  };

  if (!open) {
    return (
      <div onClick={() => setOpen(true)}>
        {children || (
          <img
            src={src}
            alt={alt}
            className={`cursor-pointer hover:opacity-80 transition-opacity ${className}`}
          />
        )}
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center overflow-hidden h-full"
      style={{ zIndex: 9999 }}
      onClick={handleClose}
      onTouchMove={(e) => e.preventDefault()}
    >
      {/* Close Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}
        className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
        style={{ zIndex: 10001 }}
        title="Close (Click anywhere or press ESC)"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Title */}
      {title && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2" style={{ zIndex: 10001 }}>
          <div className="bg-black/70 text-white px-4 py-2 rounded-lg text-sm font-medium backdrop-blur-sm">
            {title}
          </div>
        </div>
      )}

      {/* Image Container with Zoom Pan Pinch */}
      <div
        className="relative flex items-center justify-center"
        style={{ 
          zIndex: 10000,
          maxWidth: '90vw',
          maxHeight: '85vh',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <TransformWrapper
          ref={transformRef}
          initialScale={1}
          initialPositionX={0}
          initialPositionY={0}
          minScale={0.5}
          maxScale={5}
          centerOnInit
          centerZoomedOut
          limitToBounds={false}
          wheel={{ step: 0.2 }}
          doubleClick={{ mode: 'reset' }}
          panning={{ disabled: false }}
          alignmentAnimation={{ 
            disabled: false,
            sizeX: 0,
            sizeY: 0,
            animationTime: 200,
          }}
          onInit={(ref) => {
            transformRef.current = ref;
            // Center the image after component mounts
            setTimeout(() => {
              ref.centerView(1, 0);
            }, 100);
          }}
        >
          {({ zoomIn, zoomOut, resetTransform, centerView }) => (
            <>
              <TransformComponent
                wrapperStyle={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                contentStyle={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src={src}
                  alt={alt}
                  className="border-2 border-white/30 shadow-2xl rounded-lg select-none"
                  style={{
                    maxWidth: '90vw',
                    maxHeight: '85vh',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain',
                  }}
                  draggable={false}
                />
              </TransformComponent>

              {/* Zoom Controls */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2" style={{ zIndex: 10001 }}>
                <div className="flex items-center gap-2 bg-black/80 backdrop-blur-md px-4 py-2.5 rounded-full shadow-2xl">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      zoomOut();
                    }}
                    className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                    title="Zoom Out"
                  >
                    <ZoomOut className="h-5 w-5" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      zoomIn();
                    }}
                    className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                    title="Zoom In"
                  >
                    <ZoomIn className="h-5 w-5" />
                  </button>

                  <div className="w-px h-8 bg-white/20 mx-2" />

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      resetTransform();
                      setTimeout(() => centerView(1, 0), 50);
                    }}
                    className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                    title="Reset Zoom"
                  >
                    <Maximize2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </TransformWrapper>
      </div>
    </div>
  );
}