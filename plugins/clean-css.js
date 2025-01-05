import fs from 'fs/promises';
import path from 'path';

const distPath = 'dist';
export const cleanCssPlugin = () => ({
    name: 'clean-css',
    setup(build) {
        build.onEnd(async () => {
            try {
                const distFiles = await fs.readdir(distPath);
                const exampleFiles = await fs.readdir(examplePath);
                const files = [...distFiles, ...exampleFiles]
                for (const file of files) {
                    if (file.includes('.css') && !file.includes('components') || file.includes('.css') && file.includes('.esm')) {
                        const dist = path.join(distPath, file);
                        await fs.unlink(dist);
                    }
                }
            } catch (err) {

            }
        });
    },
});