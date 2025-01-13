"use client"
//  bg-blue-950 border-blue-950
//  bg-zinc-900 border-zinc-900
//  bg-rose-950 border-rose-950
//  bg-red-600 border-red-600
//  bg-green-600 border-green-600
//  bg-orange-600 border-orange-600


import { AspectRatio } from '@/components/ui/aspect-ratio'
import { cn, formatPrice } from '@/lib/utils'
import { Rnd } from "react-rnd"
import React, { useRef, useState } from 'react'
import HandleComponent from '@/components/HandleComponent'
import { ScrollArea } from '@/components/ui/scroll-area'
import { COLORS, FINISHES, MATERIALS, MODELS } from '@/validators/option-validator'
import { Radio, RadioGroup } from '@headlessui/react'
import { Label } from '@/components/ui/label'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ArrowRight, Check, ChevronsUpDown } from 'lucide-react'
import { Description } from '@radix-ui/react-toast'
import { BASE_PRICE } from '@/config/products'
import NextImage from 'next/image'
import { useUploadThing } from '@/lib/uploadthings'
import { useMutation } from '@tanstack/react-query'
import { SaveConfigTypes, saveConfig as _saveConfig } from './actions'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

interface DesignConfiguratorProps {
  configId: string,
  imageDimensions: { width: number, height: number },
  imageUrl: string
}

export default function DesignConfigurator({ configId, imageDimensions, imageUrl }: DesignConfiguratorProps) {



  const [options, setOptions] = useState<{ color: (typeof COLORS)[number], model: (typeof MODELS.options)[number], materials: (typeof MATERIALS.options)[number], finishes: (typeof FINISHES.options)[number] }>({ color: COLORS[0], model: MODELS.options[0], materials: MATERIALS.options[0], finishes: FINISHES.options[0] });
  const [renderedDimensions, setRenderedDimensions] = useState({ width: imageDimensions.width / 4, height: imageDimensions.height / 4 });
  const [renderedPositions, setRenderedPositions] = useState({ x: 290, y: 205 });

  const phoneCaseRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const router = useRouter()

  const { startUpload } = useUploadThing('imageUploader');

  const { mutate: saveConfig } = useMutation({
    mutationKey: ["saveConfig"],
    mutationFn: async (arg: SaveConfigTypes) => {
      await Promise.all([saveConfiguration(), _saveConfig(arg)])
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "There was an error on our end. Please try again later.",
        variant: "destructive"
      })
    },
    onSuccess: () => {
      router.push(`/configure/preview?id=${configId}`)
    }
  })


  async function saveConfiguration() {
    try {
      const { left: caseLeft, top: caseTop, width, height } = phoneCaseRef.current!.getBoundingClientRect();
      const { left: containerLeft, top: containerTop } = containerRef.current!.getBoundingClientRect();

      const leftOffset = caseLeft - containerLeft;
      const topOffset = caseTop - containerTop;

      const actualX = renderedPositions.x - leftOffset;
      const actualY = renderedPositions.y - topOffset;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      const userImage = new Image();

      userImage.crossOrigin = 'Anonymous'
      userImage.src = imageUrl;

      await new Promise((resolve) => userImage.onload = resolve);

      ctx?.drawImage(
        userImage,
        actualX,
        actualY,
        renderedDimensions.width,
        renderedDimensions.height
      );

      const base64 = canvas.toDataURL();
      const base64Data = base64.split(",")[1];
      const blob = base64toBlob(base64Data, "image/png");
      const file = new File([blob], "fileName", { type: "image/png" });



      await startUpload([file], { configId: configId });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Something went wrong.",
        description: "There was a problem saving your design. Please try again.",
        variant: "destructive"
      })
    }
  }

  function base64toBlob(base64Data: string, type: string) {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type });
  }

  return (
    <div className='mt-20 mb-20 pb-20 relative grid grid-cols-1 md:grid-cols-3'>
      <div ref={containerRef} className='col-span-2 w-full overflow-hidden h-[37.5rem] max-w-4xl flex justify-center align-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'>
        <div className='relative w-60 bg-opacity-50 pointer-events-none aspect-[896/1831]'>
          <AspectRatio ref={phoneCaseRef} ratio={896 / 1831} className='pointer-events-none relative z-50 aspect-[896/1831] w-full'>
            <NextImage src="/images/phone-template.png" fill className='pointer-events-none z-50 select-none' alt='' />
          </AspectRatio>
          <div className='z-40 absolute top-px left-[3px] inset-0 bottom-px right-[3px] rounded-[32px] shadow-[0_0_0_99999px_rgba(229,231,235,0.6)]' />
          <div className={cn("absolute bottom-[10px] top-px left-[3px] right-[3px] rounded-[32px]", `bg-${options.color.tw}`)} />
        </div>
        <Rnd
          default={{ width: imageDimensions.width / 4, height: imageDimensions.height / 4, x: 90, y: 205 }}
          lockAspectRatio
          onResizeStop={(_, __, ref, ___, { x, y }) => {
            setRenderedDimensions({ width: +ref.style.width.slice(0, -2), height: +ref.style.height.slice(0, -2) });

            setRenderedPositions({ x, y })
          }}
          onDragStop={(_, data) => {
            const { x, y } = data;

            setRenderedPositions({ x, y })
          }}
          resizeHandleComponent={{
            bottomRight: <HandleComponent />,
            bottomLeft: <HandleComponent />,
            topRight: <HandleComponent />,
            topLeft: <HandleComponent />
          }}
        >
          <div className='relative w-full h-full'>
            <NextImage src={imageUrl} className='pointer-events-none' fill alt='' />
          </div>
        </Rnd>
      </div>


      <div className='h-[37.5rem] col-span-full md:col-span-1 flex flex-col bg-white'>
        <ScrollArea className='flex-1 overflow-auto relative'>
          <div className='absolute bottom-0 h-12 inset-x-0 bg-gradient-to-t from-white pointer-events-none' />
          <div className='px-8 pb-12 pt-8 '>
            <h2 className='tracking-tight font-bold text-3xl'>Customize your case </h2>
            <div className='h-px w-full bg-gray-200 my-6' />
            <div className='mt-4 relative h-full flex flex-col justify-between'>
              <div className='flex flex-col gap-6'>
                <RadioGroup value={options.color} onChange={(val) => {
                  setOptions((prev) => ({ ...prev, color: val }))
                }}>
                  <Label>Color: {options.color.label}</Label>
                  <div className='mt-3 flex items-center space-x-3'>
                    {COLORS.map((color) => (
                      <Radio
                        key={color.label}
                        value={color}
                        className={({ checked }) =>
                          cn(
                            "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 active:ring-0 focus:ring-0 active:outline-none focus:outline-none border-2 border-transparent",
                            {
                              [`border-${color.tw}`]: checked,
                            }
                          )
                        }
                      >
                        <span
                          className={cn(
                            `bg-${color.tw}`,
                            "size-8 rounded-full border border-black border-opacity-10"
                          )}
                        />
                      </Radio>
                    ))}
                  </div>
                </RadioGroup>

                <div className='relative flex flex-col gap-3 w-full'>
                  <Label>Model</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className='w-full justify-between '>
                        {options.model.label}
                        <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {MODELS.options.map((model) => (
                        <DropdownMenuItem key={model.label} onClick={() => setOptions((prev) => ({ ...prev, model }))} className={cn("flex items-center text-sm gap-1 p-1.5 cursor-pointer hover:bg-zinc-100", { "bg-zinc-100": model.label === options.model.label })}>
                          <Check className={cn("w-4 h-4 mr-2", model.label === options.model.label ? "opacity-100" : "opacity-0")} />
                          {model.label}</DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {[MATERIALS, FINISHES].map(({ name, options: selectableOptions }) => (
                  <RadioGroup key={name} value={options[name]} onChange={(val) => setOptions((prev) => ({
                    ...prev,
                    [name]: val
                  }))}>
                    <Label>{name.slice(0, 1).toUpperCase() + name.slice(1)}</Label>
                    <div className="mt-3 space-y-4">
                      {selectableOptions.map((option) => (
                        <Radio key={option.label} value={option} className={({ checked }) => cn("relative block cursor-pointer rounded-lg bg-white px-6 py-4 shadow-sm border-2 border-zinc-200 focus:outline-none ring-0 focus:ring-0 outline-none sm:flex sm:justify-between", { "border-primary": checked })}>
                          <div>
                            <span className="flex items-center">
                              <span className="flex flex-col text-sm">
                                <Label className="font-medium text-gray-900">{option.label}</Label>
                                {option.description ? (
                                  <Description className='text-gray-500'><span className="block sm:inline"> {option.description}</span></Description>
                                ) : null}
                              </span>
                            </span>
                          </div>
                          <Description className='mt-2 flex text-sm sm:ml-4 sm:mt-0 sm:flex-col sm:text-right'>
                            <span className='text-gray-900 font-medium'>{formatPrice(option.price / 100)}</span>
                          </Description>
                        </Radio>
                      ))}
                    </div>
                  </RadioGroup>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>


        <div className="w-full px-8 h-16 bg-white">
          <div className="bg-zinc-200 h-px w-full" />
          <div className='w-full h-full flex items-center justify-end'>
            <div className='w-full flex gap-6 items-center'>
              <p className='font-medium whitespace-nowrap'>
                {formatPrice((BASE_PRICE + options.finishes.price + options.materials.price) / 100)}
              </p>
              <Button onClick={() => saveConfig({configId, color: options.color.value, model: options.model.value, material: options.materials.value, finish: options.finishes.value})} className='w-full' size="sm">Continue <ArrowRight className='w-4 h-4 ml-1.5 inline-block' /></Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
