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


### 2.`Github`中`Contribution activity`不展示`commit`相关的信息
可能是git配置的邮箱登录`github`的邮箱不一致导致的，这时候需要使用`git config --local user.email xxx.com` 配置下。