"use server";
import {
  CaseColor,
  CaseFinish,
  CaseMaterial,
  PhoneModel,
} from "@prisma/client";
import { db } from "../../../db";

export type SaveConfigTypes = {
  color: CaseColor;
  material: CaseMaterial;
  finish: CaseFinish;
  model: PhoneModel;
  configId: string;
}

export async function saveConfig({
  color,
  finish,
  material,
  model,
  configId,
}: SaveConfigTypes) {
  await db.configuration.update({
    where: {
      id: configId,
    },
    data: {
      color,
      material,
      finish,
      model,
    },
  });
}
