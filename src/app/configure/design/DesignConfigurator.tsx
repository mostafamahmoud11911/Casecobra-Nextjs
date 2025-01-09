import React from 'react'

interface DesignConfiguratorProps {
  configId: string,
  imageDimensions: { width: number, height: number },
  imageUrl: string
}

export default function DesignConfigurator({ configId, imageDimensions, imageUrl }: DesignConfiguratorProps) {
  return (
    <div className='mt-20 mb-20 pb-20 relative grid grid-cols-3'>
      <div className='col-span-2 w-full overflow-hidden h-[37.5rem] max-w-4xl bg-red-700 flex justify-center align-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ducimus, voluptas!</div>
      
    </div>
  )
}
