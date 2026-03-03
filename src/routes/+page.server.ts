import { fetchItem } from 'ochre-sdk';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {

  const { error, item: set } =
    await fetchItem<"set", "spatialUnit">(
      "240e6e06-9d05-4210-aa83-f4190639886d",
      "set"
    );

  if (error !== null) {
    throw new Error("Response failed!");
  }

  // 🔥 直接返回 set
  return set;
};