## 同步 vscode 配置
1. 点击用户头像
2. 选择`Backup and Sync Setttings`
3. 点击`Sign in`
4. 选择 `Sign in with GitHub`

## 安装 

```bash
sudo curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```

如果报错，需要在`hosts`文件中进行配置：
1. 打开`hosts`文件：`sudo vi /etc/hosts`
2. 添加`185.199.108.133 raw.githubusercontent.com`

安装后尝试`nvm -v`，如无法正常使用，需要配置`shell`配置文件。

对于 bash，将以下内容添加到 ~/.bash_profile 或 ~/.bashrc 文件中：
```bash
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```

然后重新加载配置文件：
```bash
source ~/.bash_profile
```

对于 zsh（MacOS Catalina 及更新版本默认使用的shell），将以下内容添加到 ~/.zshrc 文件中：
```bash
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```


然后重新加载配置文件：
```bash
source ~/.zshrc
```

## Mac nvm install failed python: not found
在M2芯片的设备上，由于缺少python导致`nvm`安装`node`失败。

`nvm install v12.22.12`报错： `exec: python: not found`

```bash
cd /System/Applications/Utilities/
open .
```
找到 终端.app，右键 -> 显示简介，钩上 Rosetta，然后**退出终端.app，完全退出，再重新打开终端**

增加`alias python=/usr/bin/python3`到`~/.zshrc`和`~/.bash_profile`中：
```bash
echo "alias python=/usr/bin/python3" >> ~/.zshrc
source ~/.zshrc
echo "alias python=/usr/bin/python3" >> ~/.bash_profile
source ~/.bash_profile
```

## 清理工具

腾讯柠檬清理：https://lemon.qq.com/

## 数据库管理

[Sequel Ace](https://sequel-ace.com/)

## code . 命令报错：zsh: command not found: code
1. 尝试安装 code 命令
- 打开 Visual Studio Code。
- 按 Command + Shift + P 打开命令面板。
- 输入 Shell Command: Install 'code' command in PATH 并选择它。
- 重新启动终端。

如果安装报错`EACCES: permission denied, unlink '/usr/local/bin/code'`，需要先选择 `Shell Command: Uninstall 'code' command from PATH` 卸载code命令，然后重新安装。


## windows 安装 nvm

[nvm](https://github.com/coreybutler/nvm-windows/releases)