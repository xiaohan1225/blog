## 修改远程分支url
git remote set-url origin git@github.com:username/repo.git

## 删除远程分支
git push --delete origin branch-name

## ssh: connect to host github.com port 22: Connection timed out报错

# This should also timeout
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

## 全局配置git用户名和邮箱
```bash
git config --global user.name xx
git config --global user.email "xxx.com"
```