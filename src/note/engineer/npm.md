`npm(Node Package Manager)` 是2009年发布的一个开源项目，用于管理JavaScript项目的依赖和包。

## npm login命令的使用

### 登录到公共仓库
```bash
npm login
```

### 登录到私有仓库
```bash
npm login --registry https://registry.npmmirror.com
```

### 使用参数登录
```bash
npm login --username <username> --password <password> --email <email>
```

## 查看包信息
`npm view <package-name> versions`: 查看包的所有版本
`npm view <package-name>`: 查看完整包信息
`npm view <package-name> version`: 查看包的最新版本
`npm view <package-name> repository.url`: 查看包的仓库地址
`npm view <package-name> dependencies`: 查看包的生产依赖
`npm view <package-name> devDependencies`: 查看包的开发依赖

##  nrm 切换镜像源
- nrm ls: 查看所有可用的镜像源
- nrm use taobao: 切换到淘宝镜像源
- `nrm add <registry> <url>`
- `nrm del <registry>`
- `nrm test <registry>`: 测试镜像源的响应速度

## npm 配置
- npm config list
- npm config list --ls


## 常用命令
- npm ls -g : 查看全局安装的包
- npm-check -u : 升级包