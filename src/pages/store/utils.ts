import { Script } from "@App/app/repo/scripts";
import { extractFavicons } from "@App/pkg/utils/favicon";
import { store } from "./store";
import { scriptSlice } from "./features/script";
import Cache from "@App/app/cache";
import { SystemClient } from "@App/app/service/service_worker/client";
import { message } from "./global";

// 将数组分成指定大小的批次
const chunkArray = <T>(array: T[], chunkSize: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

// 处理单个脚本的favicon
const processScriptFavicon = async (script: Script) => {
  if (!script.uuid || !script.metadata) {
    return { uuid: script.uuid || '', fav: [] };
  }
  
  try {
    return {
      uuid: script.uuid,
      fav: await Cache.getInstance().getOrSet(`favicon:${script.uuid}`, async () => {
        const icons = await extractFavicons(script.metadata!.match || [], script.metadata!.include || []);
        if (icons.length === 0) return [];

        // 从缓存中获取favicon图标
        const systemClient = new SystemClient(message);
        
        // 添加超时控制的Promise处理
        const loadIconWithTimeout = (icon: any) => {
          if (!icon.icon) {
            return Promise.resolve({
              match: icon.match,
              website: icon.website,
              icon: "",
            });
          }
          
          // 设置5秒超时
          const timeout = new Promise<any>((_, reject) => 
            setTimeout(() => reject(new Error('Favicon加载超时')), 5000)
          );
          
          const loadIcon = systemClient
            .loadFavicon(icon.icon)
            .then((url) => ({
              match: icon.match,
              website: icon.website,
              icon: url,
            }))
            .catch((err) => {
              console.warn(`加载图标失败: ${icon.website}`, err);
              return {
                match: icon.match,
                website: icon.website,
                icon: "",
              };
            });
            
          return Promise.race([loadIcon, timeout]).catch(() => ({
            match: icon.match,
            website: icon.website,
            icon: "",
          }));
        };
        
        const newIcons = await Promise.all(icons.map(loadIconWithTimeout));
        return newIcons;
      })
    };
  } catch (err) {
    console.error(`处理脚本favicon失败: ${script.name || script.uuid}`, err);
    return {
      uuid: script.uuid,
      fav: [],
    };
  }
};

// 在scriptSlice创建后处理favicon加载，以批次方式处理
export const loadScriptFavicons = async (scripts: Script[]) => {
  if (!scripts || scripts.length === 0) {
    return;
  }
  
  try {
    const batchSize = 20; // 每批处理20个脚本
    const scriptChunks = chunkArray(scripts, batchSize);
    
    // 逐批处理脚本
    for (const chunk of scriptChunks) {
      try {
        const chunkResults = await Promise.all(chunk.map(processScriptFavicon));
        
        // 每完成一批就更新一次store
        store.dispatch(scriptSlice.actions.setScriptFavicon(chunkResults));
        
        // 添加小延迟，避免浏览器过载
        await new Promise(resolve => setTimeout(resolve, 10));
      } catch (err) {
        console.error('处理favicon批次失败', err);
        // 继续处理下一批
      }
    }
  } catch (err) {
    console.error('加载脚本图标失败', err);
  }
};
