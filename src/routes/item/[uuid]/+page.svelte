<script lang="ts">
  import type { SpatialUnit } from 'ochre-sdk';
  import {
    getUniquePropertyLabels,
    getPropertyValueByLabel
  } from 'ochre-sdk';

  const { data } = $props();
  const item = data as SpatialUnit;

  // 🔹 图片（现在结构是 image.url）
  const imageUrl = item.image?.url ?? null;

  // 🔹 真正 metadata 在 observation 里
  const observationProperties =
    item.observations?.[0]?.properties ?? [];

  const propertyLabels =
    observationProperties.length > 0
      ? getUniquePropertyLabels(observationProperties)
      : [];
</script>

<div class="min-h-screen bg-slate-50">
  <div class="max-w-4xl mx-auto px-6 py-12 space-y-10">

    <!-- Back Button -->
    <a
      href="/"
      class="text-blue-600 hover:underline text-sm"
    >
      ← Back to all items
    </a>

    <!-- Title -->
    <div class="space-y-3">
      <h1 class="text-3xl font-bold text-slate-900">
        {item.identification?.label ?? 'Untitled'}
      </h1>

      {#if item.description}
        <p class="text-slate-600 leading-relaxed">
          {item.description}
        </p>
      {/if}
    </div>

    <!-- Image -->
    {#if imageUrl}
      <img
        src={imageUrl}
        alt={item.identification?.label}
        class="rounded-2xl shadow-lg max-h-[500px] object-contain bg-white p-4"
      />
    {:else}
      <div class="bg-white border rounded-2xl p-8 text-center text-slate-400">
        No image available
      </div>
    {/if}

    <!-- Metadata -->
    <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <h2 class="text-lg font-semibold mb-6">
        Metadata
      </h2>

      {#if propertyLabels.length === 0}
        <div class="text-slate-400 text-sm">
          No metadata available
        </div>
      {:else}
        <div class="space-y-4">
          {#each propertyLabels as label}
            <div class="flex flex-col sm:flex-row sm:justify-between border-b pb-3">
              <span class="font-medium text-slate-800">
                {label}
              </span>

              <span class="text-slate-600 mt-1 sm:mt-0">
                {getPropertyValueByLabel(observationProperties, label)}
              </span>
            </div>
          {/each}
        </div>
      {/if}

    </div>

  </div>
</div>