import { IApi, RUNTIME_TYPE_FILE_NAME } from 'umi';
import { readFileSync } from 'fs';
import { Mustache } from 'umi/plugin-utils';
import { join } from "path";

export default (api: IApi) => {
    api.describe({
        key: 'cmdk',
        config: {
            schema(joi) {
                return joi.object({
                    hotKey: joi.string().default('k'),
                });
            },
        },
        enableBy: api.EnableBy.config,
    })

    api.onGenerateFiles({
        fn() {
            const runtimeTpl = readFileSync(
                join(__dirname, 'cmdk.tpl'),
                'utf-8',
            );

            const tplLess = readFileSync(
                join(__dirname, 'cmdk.less'),
                'utf-8',
            );

            api.writeTmpFile({
                path: 'cmdk.tsx',
                content: Mustache.render(runtimeTpl, {
                    props: JSON.stringify(api.userConfig.cmdk)
                }),
            });

            api.writeTmpFile({
                path: 'cmdk.less',
                content: Mustache.render(tplLess, {}),
            });

            api.writeTmpFile({
                path: RUNTIME_TYPE_FILE_NAME,
                tplPath: join(__dirname, 'runtimeConfig.d.ts'),
                context: {}
            });
        }
    })

    api.addLayouts(() => {
        return [{
            id: 'cmdk',
            file: join(api.paths.absTmpPath, "./plugin-cmdk/cmdk.tsx"),
        }]
    });
};
