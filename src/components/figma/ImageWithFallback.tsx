import React, { useState } from 'react'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

export const ImageWithFallback = React.forwardRef<HTMLImageElement, React.ImgHTMLAttributes<HTMLImageElement>>(
  (props, ref) => {
    const [didError, setDidError] = useState(false)
    // 移除透明度控制状态，直接由浏览器处理加载显示，避免 lazy loading 导致的 loaded 状态不同步问题
    // const [loaded, setLoaded] = useState(false)

    React.useEffect(() => {
      setDidError(false)
      // setLoaded(false)
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
        ref={ref}
        referrerPolicy="no-referrer"
        src={src}
        alt={alt}
        className={`${className} transition-opacity duration-300`}
        style={style}
        {...rest}
        onError={handleError}
        // onLoad={() => setLoaded(true)}
      />
    )
  },
)
