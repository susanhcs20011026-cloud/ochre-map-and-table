<script lang="ts">
  import type { SpatialUnit } from 'ochre-sdk';
  import {
    getUniquePropertyLabels,
    getPropertyValueByLabel,
    filterProperties
  } from 'ochre-sdk';

  import { MapLibre, DefaultMarker } from 'svelte-maplibre';
  import * as Table from "$lib/components/ui/table";
  import { Input } from "$lib/components/ui/input";

  const { data } = $props();

  
  const spatialUnits: SpatialUnit[] =
    (data?.items ?? []) as SpatialUnit[];

  
  const propertyLabels =
    spatialUnits.length > 0
      ? getUniquePropertyLabels(
          spatialUnits[0]?.properties ?? []
        )
      : [];

  let search = $state('');

  let filteredData = $derived(
    search === ''
      ? spatialUnits
      : spatialUnits.filter((unit) => {

          const nameMatch =
            unit.identification?.label
              ?.toLowerCase()
              .includes(search.toLowerCase());

          const propertyMatch =
            unit.properties?.some((prop) =>
              filterProperties(
                prop,
                { label: 'all fields', value: search },
                { includeNestedProperties: true }
              )
            );

          return nameMatch || propertyMatch;
        })
  );
</script>

<div class="min-h-screen bg-slate-50">

  <div class="max-w-6xl mx-auto px-6 py-12 space-y-12">

    <!-- Header -->
    <div class="space-y-3">
      <h1 class="text-4xl font-bold tracking-tight text-slate-900">
        {data.identification?.label}
      </h1>

      <p class="text-slate-600 max-w-3xl leading-relaxed">
        {data.description ?? ''}
      </p>
    </div>

    <!-- Filter Card -->
    <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <label class="block text-sm font-medium text-slate-700 mb-2">
        Filter by name, object type, or material
      </label>

      <Input
        placeholder="Search..."
        bind:value={search}
        class="w-full h-11"
      />
    </div>

    <!-- Map Card -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="p-6 border-b border-slate-200">
        <h2 class="text-lg font-semibold text-slate-800">
          Map View
        </h2>
      </div>

      <MapLibre
        zoom={5}
        center={[33.9, 36.0]}
        class="h-[450px]"
        style="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
      >
        {#each filteredData as item (item.uuid)}
          {#each item.coordinates ?? [] as coord}
            {#if coord.type === 'point'}
              <DefaultMarker
                lngLat={[coord.longitude, coord.latitude]}
              />
            {/if}
          {/each}
        {/each}
      </MapLibre>
    </div>

    <!-- Table Card -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-200">

      <div class="p-6 border-b border-slate-200">
        <h2 class="text-lg font-semibold text-slate-800">
          Objects ({filteredData.length})
        </h2>
      </div>

      <div class="overflow-x-auto">

        <Table.Root>

          <!-- Header -->
          <Table.Header>
            <Table.Row class="bg-slate-100">
              <Table.Head class="text-slate-700 font-semibold">
                Name
              </Table.Head>

              {#each propertyLabels as label}
                <Table.Head class="text-slate-700 font-semibold">
                  {label}
                </Table.Head>
              {/each}
            </Table.Row>
          </Table.Header>

          <!-- Body -->
          <Table.Body>

            {#each filteredData as item (item.uuid)}

              <Table.Row class="hover:bg-slate-50 transition-colors">

                <!-- Name Column -->
                <Table.Cell>
                  <a
                    href={`/item/${item.uuid}`}
                    class="text-blue-600 font-medium hover:underline"
                  >
                    {item.identification?.label ?? ''}
                  </a>
                </Table.Cell>

                <!-- Dynamic Columns -->
                {#each propertyLabels as label}
                  <Table.Cell class="text-slate-700">
                    {getPropertyValueByLabel(item.properties, label) ?? ''}
                  </Table.Cell>
                {/each}

              </Table.Row>

            {/each}

          </Table.Body>

        </Table.Root>

      </div>
    </div>

  </div>

</div>