import React, { useState } from 'react'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

export const ImageWithFallback = React.forwardRef<HTMLImageElement, React.ImgHTMLAttributes<HTMLImageElement>>(
  (props, ref) => {
    const [didError, setDidError] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const imgRef = React.useRef<HTMLImageElement | null>(null)

    // 合并 ref
    const handleRef = (node: HTMLImageElement) => {
      imgRef.current = node
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref) {
        (ref as { current: HTMLImageElement | null }).current = node
      }
    }

    React.useEffect(() => {
      if (imgRef.current?.complete) {
        setLoaded(true)
      }
    }, [])

    React.useEffect(() => {
      setDidError(false)
      setLoaded(false)
    }, [props.src])

    const handleError = () => {
      setDidError(true)
    }

    const { src, alt, style, className, ...rest } = props
    const invalidSrc = !src || (typeof src === 'string' && src.trim() === '')

    return didError || invalidSrc ? (
      <div
        className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
        style={style}
      >
        <div className="flex items-center justify-center w-full h-full">
          <img src={ERROR_IMG_SRC} alt="Error loading image" {...rest} data-original-url={src} />
        </div>
      </div>
    ) : (
      <img
        ref={handleRef}
        referrerPolicy="no-referrer"
        src={src}
        alt={alt}
        className={className}
        style={{
          ...(style || {}),
          opacity: loaded ? 1 : 0,
          transition: loaded ? 'opacity 200ms ease-in' : 'none'
        }}
        {...rest}
        onError={handleError}
        onLoad={() => setLoaded(true)}
      />
    )
  },
)
