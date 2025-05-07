## 如何生成 ssh 密钥
```bash
ssh-keygen -t rsa -C "email@xxx.com"
cd ~/.ssh
cat id_rsa.pub
```

## 下载 git
1. 访问git下载链接：[https://git-scm.com/downloads](https://git-scm.com/downloads)
2. 点击`macOS`
3. 找到`Binary installer`，点击`installer`进行下载安装即可

## 常用git命令

### git remote
- `git remote`：此命令列出本地仓库关联的所有远程仓库的名称。
- `git remote -v`：此选项显示所有远程仓库的 URL，以及它们对应的名称。
- `git remote add <name> <url>`：该子命令向本地仓库添加一个新的远程仓库。`<name>` 是您为远程仓库选择的自定义名称，`<url>` 是远程仓库的 URL。
- `git remote rename <old-name> <new-name>`：该子命令重命名现有的远程仓库。`<old-name>` 是当前的远程仓库名称，`<new-name>` 是您要为其指定的新名称。
- `git remote remove <name>`：该子命令取消本地仓库与远程仓库之间的关联。`<name>` 是要删除的远程仓库的名称。
- `git remote set-url <name> <new-url>`：该子命令更改现有远程仓库的 URL。`<name>` 是远程仓库的名称，`<new-url>` 是要指定的新 URL。



## git commit 
如何修改最近一次的commit信息: git commit --amend
1. 如果只需要追加修改，而不修改上次提交信息: git commit --amend --no-edit
2. 如果只想修改上次提交信息，而不是追加修改: git commit --amend --only -m "new message"

## git rebase
git rebase -i ba90dc7ff4ab54f9bbb2ca89ddea031fa735c6d2
git rebase解决冲突：
1. git checkout branch_a  git rebase master
2. 手动解决冲突，然后执行git add 或者git rm文件，然后再执行 git rebase --continue 继续变基，当然，也可以直接git rebase --skip跳过这个commit，或者使用git rebase --abort放弃rebase。
3. 修改好:wq保存即可
批量rebase：
1. git rebase -i ba90dc7ff4ab54f9bbb2ca89ddea031fa735c6d2
2. :%s/pick /f /g  (:s/old/new/g   将当前行的所有字符串old替换为new)
3. Ctrl + b 往上滚动一屏幕 找到第一个commit 改成s

## git注意点
- 有时即使你本地代码什么都没改，但别人可能把他代码同步到了远程分支，导致远程代码和你本地代码不一致会造成有冲突，git pull拉下来会有很多文件需要commit，可用git reset --hard origin/分支名和远程代码保持同步
git 

## 修改远程分支url
git remote set-url origin git@github.com:username/repo.git

## 删除远程分支
git push --delete origin branch-name

## 配置git用户名和邮箱

全局配置：
```bash
git config --global user.name xx
git config --global user.email xxx.com
```
本地配置：

```bash
git config --local user.name xx
git config --local user.email xxx.com
```

## git常见问题
### 1.github push报错
在推送代码给`github`仓库的时候，报错：`ssh: connect to host github.com port 22: Connection timed out`；

解决方案如下：

$ ssh -T git@github.com
ssh: connect to host github.com port 22: Connection timed out

$ # but this might work
$ ssh -T -p 443 git@ssh.github.com
Hi xxxx! You've successfully authenticated, but GitHub does not provide shell access.
$ # Override SSH settings
$ vim ~/.ssh/config
```
# Add section below to it
Host github.com
  Hostname ssh.github.com
  Port 443
```
$ ssh -T git@github.com
Hi xxxxx! You've successfully authenticated, but GitHub does not
provide shell access.

如果用了上述方式还是报错，则继续往下尝试：

先使用 `ssh -vT git@github.com` 看看情况，得到如下结果：
```bash
OpenSSH_9.6p1, OpenSSL 3.2.1 30 Jan 2024
debug1: Reading configuration data /c/Users/15940/.ssh/config
debug1: /c/Users/15940/.ssh/config line 1: Applying options for github.com
debug1: Reading configuration data /etc/ssh/ssh_config
debug1: Connecting to ssh.github.com [::1] port 443.
debug1: connect to address ::1 port 443: Connection refused
debug1: Connecting to ssh.github.com [127.0.0.1] port 443.
debug1: connect to address 127.0.0.1 port 443: Connection refused
ssh: connect to host ssh.github.com port 443: Connection refused
```
原因是系统把 http://ssh.github.com 解析成了 127.0.0.1/::1（本地回环地址），而不是 GitHub 服务器的真实 IP

以管理员身份打开 `PowerShell`，使用 `notepad C:\Windows\System32\drivers\etc\hosts` 命令修改 `hosts` 文件：
```bash
20.205.243.166    github.com
20.205.243.168    api.github.com
```

再将.ssh\config改为:
```bash
Host github.com
  HostName github.com
  Port 22
```

然后就可以了。

### 2.`Github`中`Contribution activity`不展示`commit`相关的信息
可能是git配置的邮箱登录`github`的邮箱不一致导致的，这时候需要使用`git config --local user.email xxx.com` 配置下。