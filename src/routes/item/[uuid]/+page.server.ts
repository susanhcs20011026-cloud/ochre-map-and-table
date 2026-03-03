import { fetchItem } from 'ochre-sdk';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const { uuid } = params;

  const { error, item } = await fetchItem(
    uuid,
    "spatialUnit",
    { refresh: true }
  );

  if (error !== null || !item) {
    throw new Error("Failed to load item.");
  }

  return item;
};