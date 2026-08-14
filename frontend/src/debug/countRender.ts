const renderMap = new Map<string, number>();

export const countRender = (key: string) => {
    const count = (renderMap.get(key) ?? 0) + 1;
    renderMap.set(key, count);
    console.debug(`[Render] ${key}: ${count}`);
}

export const clearRender = () => renderMap.clear();