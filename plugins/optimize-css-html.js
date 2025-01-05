import fs from 'fs/promises';

export default function optimizeCSSAndHTMLPlugin() {
    return {
        name: 'optimize-css-html',
        setup(build) {
            build.onLoad({ filter: /\.(ts|js)$/ }, async (args) => {
                // Читаем исходный код файла
                const source = await fs.readFile(args.path, 'utf8');

                // Оптимизация CSS и HTML внутри шаблонных строк
                const optimizedSource = source.replace(/`([^`]*)`/g, (match, content) => {
                    if (/[:{};<>]/.test(content)) {
                        return '`' +
                            content
                                .replace(/\/\*[\s\S]*?\*\//g, '') // Удаляем комментарии
                                .replace(/\s+/g, ' ') // Убираем лишние пробелы
                                .trim() +
                            '`';
                    }
                    return match;
                });

                return {
                    contents: optimizedSource,
                    loader: 'ts', // или 'js' в зависимости от формата
                };
            });
        },
    };
}
