<script lang="ts">
  import { onMount } from 'svelte';
  // 将整个 SDK 作为对象导入
  import * as OCHRE_SDK from 'ochre-sdk'; 
  import * as Table from "$lib/components/ui/table";
  import { Input } from "$lib/components/ui/input";

  // --- Svelte 5 状态管理 ---
  let spatialUnits = $state<any[]>([]);
  let search = $state("");

  // --- 逻辑：获取数据 ---
  onMount(async () => {
    try {
      const uuid = "240e6e06-880c-4e3a-965a-09673898144c";
      
      console.log("SDK 探测成功，尝试获取项目数据...");

      // 修正点：直接从 SDK 对象中获取函数，不需要 new
      // 优先使用 getProject，如果不存在则尝试从 OCHRE 属性中找
      const getProjectFunc = OCHRE_SDK.getProject || (OCHRE_SDK as any).OCHRE?.getProject;

      if (typeof getProjectFunc === 'function') {
        const data = await getProjectFunc(uuid);
        spatialUnits = data.items || [];
        console.log("数据加载成功！项数:", spatialUnits.length);
      } else {
        console.error("在 SDK 中找不到 getProject 函数，请检查控制台打印的 OCHRE_SDK 对象");
      }
    } catch (e) {
      console.error("加载 OCHRE 数据过程中出错:", e);
    }
  });

  // --- 过滤逻辑 (完全遵循讲义第 53 页) ---
  let filteredData = $derived(
    search === "" 
      ? spatialUnits 
      : spatialUnits.filter((unit) => {
          // 匹配名称
          const nameMatch = unit.label?.toLowerCase().includes(search.toLowerCase());
          
          // 匹配属性 (Bonus 逻辑)
          const filterFunc = (OCHRE_SDK as any).filterProperties;
          const propMatch = unit.properties?.some((prop: any) => {
            if (filterFunc) {
              return filterFunc(
                prop,
                { label: 'all fields', value: search },
                { includeNestedProperties: true }
              );
            }
            // 如果 SDK 没导出过滤函数，则手动简单搜索
            return JSON.stringify(prop).toLowerCase().includes(search.toLowerCase());
          });
          
          return nameMatch || propMatch;
        })
  );
</script>

<div class="p-8 space-y-6 container mx-auto">
  <header class="border-b pb-4">
    <h1 class="text-3xl font-bold tracking-tight text-slate-900">OCHRE Spatial Units</h1>
    <p class="text-muted-foreground">DIGS 20005: Data Publication Project</p>
  </header>

  <div class="max-w-sm">
    <Input 
      placeholder="搜索 (例如: Ivory)..." 
      bind:value={search} 
      class="h-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
    />
  </div>

  <div id="map" class="h-48 w-full bg-slate-50 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-slate-200 shadow-inner">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-400 mb-2"><circle cx="12" cy="10" r="3"/><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/></svg>
    <p class="text-slate-500 font-medium">MapLibre 地图加载区</p>
    {#if spatialUnits.length > 0}
      <p class="text-blue-500 text-xs">已准备好 {filteredData.length} 个点位</p>
    {/if}
  </div>

  <div class="rounded-lg border bg-white shadow-sm overflow-hidden">
    <Table.Root>
      <Table.Header class="bg-slate-50">
        <Table.Row>
          <Table.Head class="w-[200px] font-bold">名称 (Label)</Table.Head>
          <Table.Head class="font-bold">UUID</Table.Head>
          <Table.Head class="font-bold">属性预览 (Properties)</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {#each filteredData as unit (unit.uuid)}
          <Table.Row class="hover:bg-slate-50 transition-colors">
            <Table.Cell class="font-bold text-blue-600">
              <a href="/item/{unit.uuid}" class="hover:underline">{unit.label}</a>
            </Table.Cell>
            <Table.Cell class="text-[10px] font-mono text-slate-400">{unit.uuid}</Table.Cell>
            <Table.Cell>
              <div class="flex gap-1.5 flex-wrap">
                {#each (unit.properties || []).slice(0, 2) as prop}
                  <span class="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded border border-slate-200">
                    <span class="font-semibold">{prop.label}:</span> {prop.values?.[0]?.content || ''}
                  </span>
                {/each}
              </div>
            </Table.Cell>
          </Table.Row>
        {:else}
          <Table.Row>
            <Table.Cell colspan={3} class="h-32 text-center text-slate-400">
              {#if spatialUnits.length === 0}
                <div class="flex flex-col items-center">
                  <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mb-2"></div>
                  正在从 OCHRE 获取数据...
                </div>
              {:else}
                没有找到与 "{search}" 相关的项
              {/if}
            </Table.Cell>
          </Table.Row>
        {/each}
      </Table.Body>
    </Table.Root>
  </div>
</div>