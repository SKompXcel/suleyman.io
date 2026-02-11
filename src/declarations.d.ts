declare module '*.svg' {
  import React from 'react'
  const Component: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
  export default Component
}

declare module '*.jpg' {
  const content: import('next/image').StaticImageData
  export default content
}

declare module '*.jpeg' {
  const content: import('next/image').StaticImageData
  export default content
}

declare module '*.png' {
  const content: import('next/image').StaticImageData
  export default content
}

declare module '*.mp4' {
  const content: string
  export default content
}
