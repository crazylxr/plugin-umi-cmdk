# Umi-plugin-cmdk

一个通过快捷键打开搜索面板的插件, 搜索面板默认可以搜索菜单，也可以定制其他的链接。

![Pasted image 20230307175305](https://imgs.taoweng.site/Pasted%20image%2020230307175305.png)

## Install

Npm

```bash
npm install umi-plugin-cmdk
```

Yarn


```bash
yarn add umi-plugin-cmdk
```

Pnpm

```bash
pnpm add umi-plugin-cmdk
```

## Usage

Configure in `.umirc.ts`,

```js
export default {
  plugins: ["umi-plugin-cmdk"],
};
```

## Options

可以通过配置文件 `.umirc.ts` 中的 cmdk 属性开启插件。

```typescript
import { defineConfig } from 'umi';

export default defineConfig({
  cmdk: {
    keyFilter: 'meta.k',
    searchPlaceholder: '搜索菜单',
    empty: '找不到搜索结果',
    suggestionKeys: [],
    groups: []
  }
});
```

### keyFilter
- Type: `KeyFilter`
- Default: `meta.k` 

定义打开弹框的快捷键, 具体用法可见 ahooks 的 [useKeyPress](https://ahooks.js.org/zh-CN/hooks/use-key-press/#params)

### searchPlaceholder
- Type: `string`
- Default: `寻找你想去的地方...` 

弹框搜索框的 `Placeholder`

### empty
- Type: `string`
- Default: `迷路了! ! !` 

搜索结果为空的时候展示效果

### suggestionKeys
- Type: `string[]`
- Default: 无

用于配置哪些菜单需要置顶，置顶之后会放到 suggestion 组内，同时在 menu 组下面就会隐藏。

![Pasted image 20230307180853](https://imgs.taoweng.site/Pasted%20image%2020230307180853.png)

### groups

- Type: `Group`
- Default： 无

出了菜单以外，还想配置更多的跳转链接，可以用这个属性进行扩展更多的分组。
![Pasted image 20230307181335](https://imgs.taoweng.site/Pasted%20image%2020230307181335.png)

类型如下：

```typescript

interface Item {
  key: string;
  title: string;
  action?: () => void;
}

interface Group {
  groupName: string;
  items: Item[];
}
```

## TODO
- [ ] 更多的主题切换
- [ ] 增加一个静态站点演示，或者整一个每个属性配置的 gif

## LICENSE

MIT
