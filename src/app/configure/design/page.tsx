import { notFound } from "next/navigation"
import { db } from "../../../../db"
import DesignConfigurator from "./DesignConfigurator"



type SearchParamsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

export default async function Design({ searchParams }: SearchParamsProps) {

  const { id } = searchParams

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
  return <DesignConfigurator configId={configuration.id} imageDimensions={{ width, height }} imageUrl={imageUrl}  />
}
