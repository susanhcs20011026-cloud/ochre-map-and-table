import { fetchItem } from 'ochre-sdk';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {

  const { uuid } = params;

  const { error, item } =
    await fetchItem<"spatialUnit">(
      uuid,
      "spatialUnit"
    );

  if (error !== null || !item) {
    throw new Error("Failed to load item.");
  }

  console.log("FULL SPATIAL UNIT:", item);

  return item;
};