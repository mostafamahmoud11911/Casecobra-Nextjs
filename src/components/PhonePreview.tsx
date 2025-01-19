"use client"
import { CaseColor } from '@prisma/client'
import React, { useEffect, useRef, useState } from 'react'
import { AspectRatio } from './ui/aspect-ratio';
import { cn } from '@/lib/utils';


export default function PhonePreview({ color, croppedImageUrl }: { color: CaseColor | null, croppedImageUrl: string | null }) {
    const ref = useRef<HTMLDivElement>(null);
    const [renderDimensions, setRenderDimensions] = useState({ width: 0, height: 0 });


    let caseBackgroundColor = "bg-zinc-900";

    if (color === "blue") caseBackgroundColor = "bg-blue-950";
    if (color === "red") caseBackgroundColor = "bg-red-600";
    if (color === "green") caseBackgroundColor = "bg-green-600";
    if (color === "orange") caseBackgroundColor = "bg-orange-600";

    function handleResize() {
        if (!ref.current) return;

        const {width, height} = ref.current.getBoundingClientRect();

        setRenderDimensions({ width, height })
    }

    useEffect(() => {
        handleResize();

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        }
    }, [ref.current])


    return (
        <AspectRatio ref={ref} ratio={3000 / 2001} className='relative'>
            <div className='absolute z-20 scale-[1.0352]' style={{ left: renderDimensions.width / 2 - renderDimensions.width / (1216 / 121), top: renderDimensions.height / 6.22 }}>
                <img width={renderDimensions.width / (3000 / 637)} src={croppedImageUrl!} className={cn('phone-skew relative z-20 rounded-t-[15px] rounded-b-[10px] md:rounded-t-[30px] md:rounded-b-[20px]', caseBackgroundColor)} alt='phone' />
            </div>


            <div className='relative h-full w-full z-40' >
                <img
                    alt='phone'
                    src='/images/clearphone.png'
                    className='pointer-events-none h-full w-full antialiased rounded-md'
                />
            </div>
        </AspectRatio>
    )
}
