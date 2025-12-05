## nuxt 安装时报错

Error: Failed to download template from registry: Failed to download https://raw.githubusercontent.com/nuxt/starter/templates/templates/v3.json: TypeError: fetch failed

报错原因：可能是因为国内的网络政策，对 raw.githubusercontent.com 进行了 DNS 污染，导致无法访问。

解决方案：

在`hosts`文件中增加如下配置：

```bash
185.199.108.133 raw.githubusercontent.com
185.199.109.133 raw.githubusercontent.com
185.199.110.133 raw.githubusercontent.com
185.199.111.133 raw.githubusercontent.com
```

以上 ip 地址的数据来源于`https://ipleak.net/?q=raw.githubusercontent.com`。

## 修改 hosts 文件

windows: `notepad C:\Windows\System32\drivers\etc\hosts`

mac: `sudo vi /etc/hosts`

windows刷新 DNS 缓存命令： `ipconfig /flushdns`