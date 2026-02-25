"use client";

import { useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";

function EmotionCacheProvider({ children }: { children: React.ReactNode }) {
  const [{ cache, flush }] = useState(() => {
    const c = createCache({ key: "css" });
    c.compat = true;
    const prevInsert = c.insert;
    let inserted: { name: string; isGlobal: boolean }[] = [];
    c.insert = (...args) => {
      const [selector, serialized] = args;
      if (c.inserted[serialized.name] === undefined) {
        inserted.push({ name: serialized.name, isGlobal: !selector });
      }
      return prevInsert(...args);
    };
    const f = () => {
      const prev = inserted;
      inserted = [];
      return prev;
    };
    return { cache: c, flush: f };
  });

  useServerInsertedHTML(() => {
    const ins = flush();
    if (ins.length === 0) return null;

    let styles = "";
    let dataAttr = cache.key;
    const globals: { name: string; style: string }[] = [];

    ins.forEach(({ name, isGlobal }) => {
      const style = cache.inserted[name];
      if (typeof style === "string") {
        if (isGlobal) {
          globals.push({ name, style });
        } else {
          styles += style;
          dataAttr += ` ${name}`;
        }
      }
    });

    return (
      <>
        {globals.map(({ name, style }) => (
          <style
            key={name}
            data-emotion={`${cache.key}-global ${name}`}
            dangerouslySetInnerHTML={{ __html: style }}
          />
        ))}
        {styles && (
          <style
            data-emotion={dataAttr}
            dangerouslySetInnerHTML={{ __html: styles }}
          />
        )}
      </>
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <EmotionCacheProvider>
      <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
    </EmotionCacheProvider>
  );
}
