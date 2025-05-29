import{_ as i,c as a,o as n,ae as l}from"./chunks/framework.z0sZ1NT9.js";const o=JSON.parse('{"title":"001 初识docker","description":"","frontmatter":{"title":"001 初识docker","date":"2024-01-06T00:00:00.000Z","categories":["服务端"],"tags":["nginx"],"sidebar":"auto"},"headers":[],"relativePath":"collect/server/001.md","filePath":"collect/server/001.md"}'),e={name:"collect/server/001.md"};function t(p,s,h,k,E,r){return n(),a("div",null,s[0]||(s[0]=[l(`<h2 id="一、dockerfile" tabindex="-1">一、Dockerfile <a class="header-anchor" href="#一、dockerfile" aria-label="Permalink to &quot;一、Dockerfile&quot;">​</a></h2><p><code>Dockerfile</code> 是docker的配置文件，文件名必须叫<code>Dockerfile</code>，而且必须放在项目根目录。</p><h3 id="_1-语法" tabindex="-1">1. 语法 <a class="header-anchor" href="#_1-语法" aria-label="Permalink to &quot;1. 语法&quot;">​</a></h3><div class="language-dockerfile vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">dockerfile</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 基础镜像 以哪个镜像作为基础去构建</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">FROM</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> node:14</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 工作目录</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">WORKDIR</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> /app</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 拷贝文件 .表示当前目录下所有文件 但拷贝的时候会忽略 .dockerignore 文件里面定义的文件。</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">COPY</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> . /app</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 运行一些命令 可以RUN多个</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">RUN</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> xxx</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">RUN</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> xxx</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 启动容器时运行，只能有一个 CMD</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">CND xxx</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">CMD</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> echo $M1 &amp;&amp; eche $C1 &amp;&amp; npm run dev &amp;&amp; npx pm2 log # CMD最后一定要是一个阻塞控制台的程序 比如 npx pm2 log</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 环境变量</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">ENV</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> M1=N1</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">ENV</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> C1=D1</span></span></code></pre></div><h2 id="二、docker-compose" tabindex="-1">二、Docker-compose <a class="header-anchor" href="#二、docker-compose" aria-label="Permalink to &quot;二、Docker-compose&quot;">​</a></h2><p>基于Docker和Docker-compose，通过一个配置文件，就可以让你的系统一键启动所有的运行环境：nodejs mysql mongodb redis</p><h3 id="安装" tabindex="-1">安装 <a class="header-anchor" href="#安装" aria-label="Permalink to &quot;安装&quot;">​</a></h3><p>一行命令即可安装</p><h3 id="配置文件" tabindex="-1">配置文件 <a class="header-anchor" href="#配置文件" aria-label="Permalink to &quot;配置文件&quot;">​</a></h3><ul><li>.gitignore 需要增加 .docker-volumes/</li></ul><div class="language-dockerfile vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">dockerfile</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># docker-compose.yml</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">version: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;3&#39;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">services:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">	editor-server: # service name</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">		build:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">			context： . # 当前目录</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">			dockerfile: Dockerfile # 基于 Dockerfile 构建</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">		image: editor-server # 依赖于当前 Dockerfiles 创建出来的对象</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">		container_name: editor-server</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">		ports:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">			- 8081:3000 # 宿主机通过 8081 访问</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">	editor-redis:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">		image: redis #引用官网 redis 镜像</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">		container_name: editor-redis</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">		ports:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">			- 6378:6379</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">		environment:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">			- TZ=Asia/Shanghai # 设置时区</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">	editor-mysql</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">		image: mysql # 引用官网 mysql 镜像</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">		container_name: editor-mysql</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">		restart: always # 出错则重启</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">		privileged: true # 高权限，执行下面的 mysql/init</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">		command: --default-authentication-plugin=mysql_native_password # 远程访问</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">		volumes:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">			- </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;.docker-volumes/mysql/log:/var/log/mysql&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> # 记录日志</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">			- </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;.docker-volumes/mysql/data:/var/lib/mysql&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> # 数据持久化</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">			- </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;./mysql/init:/docker-entrypoint-initdb.d/&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> # 初始化 sql</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">		environment:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">			- MYSQL_DATABASE=imooc_lego_course # 初始化容器时创建数据库</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">			- MYSQL_ROOT_PASSWORD=Mysql_2019</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">			- TZ=Asia/Shanghai # 设置时区</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">	editor-mongo</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">		image: mongo # 引用官网 mongo 镜像</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">		container_name: editor-mongo</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">		restart: always # 出错则重启</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">		volumes:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">			- </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;.docker-volumes/mongo/data:/data/db&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> # 数据持久化</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">		environment:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">			- MONGO_INITDB_DATABASE=imooc_lego_course</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">			- TZ=Asia/Shanghai</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">		ports:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">			- </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;27016:27017&#39;</span></span></code></pre></div><h3 id="命令" tabindex="-1">命令 <a class="header-anchor" href="#命令" aria-label="Permalink to &quot;命令&quot;">​</a></h3><ul><li>构建容器 <code>docker-compose build &lt;service-name&gt;</code></li><li>启动所有服务器 docker-compose up -d，后台启动</li><li>停止所有服务 docker-compose down</li><li>查看服务（查看 docker-compose中列举的服务） docker-compose ps</li></ul>`,13)]))}const c=i(e,[["render",t]]);export{o as __pageData,c as default};
