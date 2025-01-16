import { notFound } from 'next/navigation';
import React from 'react'
import { db } from '../../../../db';
import DesignPreview from './DesignPreview';

interface SearchParamsProps {
    searchParams: {
        [key: string]: string | string[] | undefined
    }
}

export default async function Preview({ searchParams }: SearchParamsProps) {
    const { id } = searchParams;


    if (!id || typeof id !== "string") {
        return notFound();
    }

    const configuration = await db.configuration.findUnique({
        where: {
            id: id
        },
    });

    if (!configuration) {
        return notFound();
    }


    return (
        <DesignPreview configuration={configuration}/>
    )
}
