## 同步 vscode 配置
1. 点击用户头像
2. 选择`Backup and Sync Setttings`
3. 点击`Sign in`
4. 选择 `Sign in with GitHub`

## 安装 nvm
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