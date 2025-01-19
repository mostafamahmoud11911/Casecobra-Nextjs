import { notFound } from "next/navigation"
import { db } from "../../../db"
import DesignConfigurator from "./DesignConfigurator"




interface searchParams {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined
  }>
}

export default async function Design({ searchParams }: searchParams) {

  const { id } = await searchParams

  if (!id || typeof id !== "string") {
    return notFound()
  }


  const configuration = await db.configuration.findUnique({
    where: {
      id
    }
  });


  if (!configuration) {
    return notFound();
  }



  const { imageUrl, width, height } = configuration;
  return <DesignConfigurator configId={configuration.id} imageDimensions={{ width, height }} imageUrl={imageUrl} />
}
