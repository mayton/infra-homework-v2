import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import yaml from "yaml";

export async function load(url, context, nextLoad) {
    if (url.endsWith('.yaml') || url.endsWith('.yml')) {
        const source = await fs.readFile(fileURLToPath(url), 'utf8');
        const data = yaml.parse(source);

        return {
            format: 'module',
            source: `export default ${JSON.stringify(data)};`,
            shortCircuit: true,
        };
    }

    return nextLoad(url, context);
};
