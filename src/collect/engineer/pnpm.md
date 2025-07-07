## 什么是 pnpm？
`pnpm` 是对标 `npm、yarn`的 `node` 包管理器。

## pnpm 的优势
### 可以大大节约磁盘空间
pnpm 的安装包是以全局的方式进行存储的，存储目录为`~/.pnpm-store`，这样的话，相同的包在只会安装一次，然后通过硬链接（`Hard Links`）机制，将项目的 `node_modules` 中的包通过硬链接指向全局 store 存储。

得益于内部采用了硬链接（`Hard Links`）机制，
### 安装速度快
创建非扁平化的 `node_modules` 文件夹，目录结构很清晰。
### 内置 monorepo 支持
 pnpm 提出了 `workspace` 的概念，内置了对 `monorepo` 的支持。

### 管理 Node.js 版本

## pnpm的安装为什么那么快？
### 硬链接机制
pnpm 有一

## 为什么用 pnpm 取代之前的 lerna 呢?
- lerna 已经不再维护，后续有任何问题社区无法及时响应
- pnpm装包效率更高，并且可以节约更多磁盘空间
- pnpm本身就预置了对monorepo的支持，不需要再额外第三方包的支持




## 只允许 pnpm

如果不希望开发者使用 npm 或者 yarn 等其它包管理工具安装依赖，可以在 `package.json` 添加如下命令：
```bash
"preinstall": "npx only-allow pnpm"
```