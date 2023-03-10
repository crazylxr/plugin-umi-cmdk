import { IApi, RUNTIME_TYPE_FILE_NAME } from 'umi';
import { readFileSync } from 'fs';
import { Mustache } from 'umi/plugin-utils';
import { join } from "path";

function withTmpPath(opts: { api: IApi; path: string; noPluginDir?: boolean }) {
  return join(
    opts.api.paths.absTmpPath,
    opts.api.plugin.key && !opts.noPluginDir
      ? `plugin-${opts.api.plugin.key}`
      : '',
    opts.path,
  );
}

export default (api: IApi) => {
  api.describe({
    key: 'cmdk',
    config: {
      schema(joi) {
        return joi.object({
          searchPlaceholder: joi.string(),
          empty: joi.string(),
          keyFilter: joi.string(),
          suggestionKeys: joi.array().items(joi.string()),
          groups: joi.array().items(joi.object({
            groupName: joi.string(),
            items: joi.array().items(joi.object({
              key: joi.string(),
              title: joi.string(),
              action: joi.func(),
            }))
          })),
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
        path: 'runtime.tsx',
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

  api.addRuntimePlugin(() => {
    return [withTmpPath({ api, path: 'runtime.tsx' })]
  });

  api.addRuntimePluginKey(() => {
    return ['cmdk'];
  });

  // api.addLayouts((arg) => {
  //     console.log('arg:', arg);
  //     return [{
  //         id: 'cmdk',
  //         file: join(api.paths.absTmpPath, "./plugin-cmdk/cmdk.tsx"),
  //     }]
  // });
};
