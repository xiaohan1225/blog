import{_ as i,c as t,o as a,ae as e}from"./chunks/framework.BHrE6nLq.js";const P=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"collect/interview/复习/1.网络.md","filePath":"collect/interview/复习/1.网络.md"}'),o={name:"collect/interview/复习/1.网络.md"};function r(h,l,p,T,c,n){return a(),t("div",null,l[0]||(l[0]=[e('<h2 id="tcp和udp的区别" tabindex="-1">TCP和UDP的区别 <a class="header-anchor" href="#tcp和udp的区别" aria-label="Permalink to &quot;TCP和UDP的区别&quot;">​</a></h2><ol><li>面向连接 无连接</li><li>TCP头 20字节 UDP 8字节</li><li>可靠传输</li><li>面向字节流 面向报文</li><li>TCP只能一对一，UDP可以多对多</li></ol><h2 id="get和post的区别" tabindex="-1">get和post的区别 <a class="header-anchor" href="#get和post的区别" aria-label="Permalink to &quot;get和post的区别&quot;">​</a></h2><ol><li>缓存：get会被浏览器主动缓存，留下历史记录，post默认不会</li><li>编码：get只能进行URL编码，只能接收ASCII字符，而post没有限制</li><li>幂等性：get是幂等性的，post不是，幂等指执行相同的操作，得到的结果是一样的。</li><li>参数：get的参数放在URL中，相对不安全，而post放在请求体里面，请求体不限制大小，而浏览器会对url长度有限制</li><li>TCP：GET 请求会把请求报文一次性发出去，而 POST 会分为两个 TCP 数据包，首先发 header 部分，如果服务器响应 100(continue)， 然后发 body 部分。(火狐浏览器除外，它的 POST 请求只发一个 TCP 包)</li></ol><h2 id="http状态码" tabindex="-1">HTTP状态码 <a class="header-anchor" href="#http状态码" aria-label="Permalink to &quot;HTTP状态码&quot;">​</a></h2><p>状态码是一个10进制数据，RFC规定的状态码是3位，000-999，如果一个个往上罗列，灵活性和扩展性太差，于是分为5类，0-99不用，于是状态码范围为100-599</p><ol><li>1xx表示协议处理的中间状态，还需要后续处理 <ul><li>101升级协议 Switching Protocols</li></ul></li><li>2xx表示请求成功 报文已收到并被正确处理 <ul><li>200 成功处理请求</li><li>204 响应头后没有body数据</li><li>206 范围请求 断点续传</li></ul></li><li>3xx表示重定向 <ul><li>301永久重定向 浏览器会做缓存优化</li><li>302临时重定向</li><li>304 Not Modified用来做条件缓存，表示资源未修改</li></ul></li><li>4xx表示客户端错误，一般是请求报文有误 <ul><li>400 笼统的状态码</li><li>403 表示服务器禁止访问 权限不够、信息敏感或者法律禁止</li><li>404 Not Found表示资源未找到</li><li>405 请求方法不支持</li><li>406 Not Acceptable 资源无法满足客户端请求的条件 比如请求中文只有英文</li><li>408 请求超时</li><li>413 请求体太大</li><li>414 请求URI过长</li></ul></li><li>5xx表示服务端错误 服务器处理时发生了错误 <ul><li>500 笼统的状态码</li><li>501 客户端的功能暂时不支持</li><li>502 服务器作为网关或者代理时返回的状态码</li><li>503 服务器当前很忙</li></ul></li></ol><h2 id="http和https" tabindex="-1">HTTP和HTTPS <a class="header-anchor" href="#http和https" aria-label="Permalink to &quot;HTTP和HTTPS&quot;">​</a></h2><ol><li>明文传输 信息加密</li><li>身份认证 数字证书 费用较高</li><li>完整性校验 单向散列函数</li><li>增加了TLS层 需要建立ssl连接 增加了握手时间</li><li>端口 80 443</li></ol><p>HTTPS不是保证绝对安全，它只是极大地增加了中间人攻击的成本</p><p>HTTPS的缺点：</p><ol><li>证书费用</li><li>握手时间 页面加载时间延长50% 增加10%~20%的耗电</li><li>ssl证书需要绑定IP，不能一个IP绑定多个域名</li></ol><h2 id="tcp-三次握手" tabindex="-1">tcp 三次握手 <a class="header-anchor" href="#tcp-三次握手" aria-label="Permalink to &quot;tcp 三次握手&quot;">​</a></h2><ol><li>开始客户端的状态close，服务端的状态是listen</li><li>客户端发送一个SYN请求给客户端 比如序列号为seq=x，SYN=1 SYN-SENT同步已发送</li><li>服务端回复一个ACK并带上自己的请求 ack=x+1 seq=y SYN-RCVD同步已接收</li><li>客户端回复一个ACK ack=y+1 establish</li></ol><h2 id="tcp握手为什么需要三次" tabindex="-1">tcp握手为什么需要三次 <a class="header-anchor" href="#tcp握手为什么需要三次" aria-label="Permalink to &quot;tcp握手为什么需要三次&quot;">​</a></h2><ol><li>确认双方收发能力正常</li><li>防止已失效的连接请求报文段突然又传送到了服务端，防止产生错误 客户端发送的第一个包并没有丢失，而是延误到连接释放以后的某个时间才到达server端，而server端会认为这是一个新的建立连接的请求，从而确认应答建立连接，而此时客户端不会向server端发送数据，这样会白白浪费服务器的资源</li></ol><h2 id="tcp的特点" tabindex="-1">TCP的特点 <a class="header-anchor" href="#tcp的特点" aria-label="Permalink to &quot;TCP的特点&quot;">​</a></h2><ol><li>可靠传输</li></ol><ul><li>序列号：按顺序给发送数据的每一个字节（8个字节）都标上号码的编号。接收端接收到TCP首部中的序列号和数据的长度，将自己下一步要接收的序列号作为确认应答。</li><li>校验和（checkSum）：伪首部+首部+数据</li><li>确认应答：客户端发送数据给服务器，服务器会返回一个已经收到消息的通知。</li><li>重发控制：数据发送超过一定时间没收到确认应答即会重发。TCP每次发包时都会计算往返时间及其偏差，将往返时间和偏差相加，重发超时的时间比这个总和稍大。</li><li>窗口控制：窗口大小就是指无须等待确认应答而可以继续发送数据的最大值，利用窗口可以提高发送速度。客户端要设置一个缓存区。在窗口的控制下，即使某些确认应答即使丢失也无需重发。</li></ul><ol start="2"><li>流量控制 原因：服务器可能处理数据包较慢或者在高负荷的情况下无法接收数据，这样会导致无限触发重传机制，浪费资源。 定义：TCP提供一种机制可以让发送端根据接收端的实际接收能力控制发送的数据量。</li></ol><ul><li>接收端发送数据时告诉发送端自己可以接收数据的大小，而发送端不能超过这个窗口限度。发送端会是不是发送一个叫做窗口探测的数据段。</li></ul><ol start="3"><li>拥塞控制 原因：当网络拥堵时，如果突然发送一个较大量的数据，极有可能导致整个网络的瘫痪。</li></ol><ul><li>慢开始</li><li>拥塞避免</li><li>快速重传</li><li>快速恢复</li></ul><p>Nagle算法：</p><ul><li>该算法指的是发送端即使还有应该发送的数据，但如果这部分数据很少，则进行延迟发送的一种机制。</li></ul><h2 id="http的特点" tabindex="-1">HTTP的特点 <a class="header-anchor" href="#http的特点" aria-label="Permalink to &quot;HTTP的特点&quot;">​</a></h2><ol><li>可靠传输</li><li>灵活可扩展：个是语义上的自由，只规定了基本格式，比如空格分隔单词，换行分隔字段，其他的各个部分都没有严格的语法限制。另一个是传输形式的多样性，不仅仅可以传输文本，还能传输图片、视频等任意数据，非常方便。</li><li>请求-应答模式</li><li>无状态：这里的状态是指通信过程的上下文信息，而每次 http 请求都是独立、无关的，默认不需要保留状态信息。</li><li>应用层协议</li></ol><h2 id="http的缺点" tabindex="-1">HTTP的缺点 <a class="header-anchor" href="#http的缺点" aria-label="Permalink to &quot;HTTP的缺点&quot;">​</a></h2><ol><li>无状态 在需要长连接的场景中，需要保存大量的上下文信息，以免传输大量重复的信息，那么这时候无状态就是 http 的缺点了。 但与此同时，另外一些应用仅仅只是为了获取一些数据，不需要保存连接上下文信息，无状态反而减少了网络开销，成为了 http 的优点。</li><li>安全性 明文传输</li><li>对头阻塞：当 http 开启长连接时，共用一个 TCP 连接，同一时刻只能处理一个请求，那么当前请求耗时过长的情况下，其它的请求只能处于阻塞状态，也就是著名的队头阻塞问题。</li></ol><h2 id="http1-1-和-http2-0-有什么区别" tabindex="-1">http1.1 和 http2.0 有什么区别？ <a class="header-anchor" href="#http1-1-和-http2-0-有什么区别" aria-label="Permalink to &quot;http1.1 和 http2.0 有什么区别？&quot;">​</a></h2><p>http1.1:</p><ol><li>默认长链接 即TCP默认不关闭 connection:keep-alive</li><li>增加缓存控制 cache-control 强缓存 条件缓存if-none-match e-tag if-modified-since last-modified</li><li>新增了一些请求方法 PUT DELETE OPTIONS</li><li>引入了管道机制，一个TCP上可以发送多个HTTP请求 （缺点：HTTP Pipelining其实是把多个HTTP请求放到一个TCP连接中一一发送，而在发送过程中不需要等待服务器对前一个请求的响应；只不过，客户端还是要按照发送请求的顺序来接收响应。）</li><li>支持断点续传 通过Content-Range Accept-Ranges</li></ol><p>http2.0:</p><ol><li>多路复用</li><li>请求资源的优先级</li><li>头部压缩</li><li>服务端推送</li><li>二进制传输，头信息和数据体都是二进制</li><li>安全性 必须https</li></ol><h2 id="http1-1-如何解决-http-的队头阻塞问题" tabindex="-1">HTTP1.1 如何解决 HTTP 的队头阻塞问题 <a class="header-anchor" href="#http1-1-如何解决-http-的队头阻塞问题" aria-label="Permalink to &quot;HTTP1.1 如何解决 HTTP 的队头阻塞问题&quot;">​</a></h2><p>HTTP是请求应答模式，一发一收，串行执行，如果前面的资源没有收到，那它之后的所有请求都会阻塞。</p><ol><li>并发连接 chrome一个域名可并发6个请求</li><li>域名分片</li></ol><h2 id="https" tabindex="-1">HTTPS <a class="header-anchor" href="#https" aria-label="Permalink to &quot;HTTPS&quot;">​</a></h2><h3 id="定义" tabindex="-1">定义 <a class="header-anchor" href="#定义" aria-label="Permalink to &quot;定义&quot;">​</a></h3><ul><li>HyperText Transfer Protocol Secure 超文本传输安全协议 常被称为HTTP over TLS（Transport Layer Security传输层安全性协议）、HTTP over SSL（Secure Sockets Layer安全套接层）、HTTP Secure 默认端口为443</li></ul><h3 id="缺点" tabindex="-1">缺点 <a class="header-anchor" href="#缺点" aria-label="Permalink to &quot;缺点&quot;">​</a></h3><ol><li>证书的费用</li><li>加解密的计算</li><li>降低了访问速度</li></ol><p>有些企业的策略是，包含敏感数据的请求用HTTPS，其它保持用HTTP</p><h3 id="通信过程" tabindex="-1">通信过程 <a class="header-anchor" href="#通信过程" aria-label="Permalink to &quot;通信过程&quot;">​</a></h3><ol><li>TCP的3次握手</li><li>TLS的连接</li><li>HTTP请求与响应</li></ol><h2 id="握手" tabindex="-1">握手 <a class="header-anchor" href="#握手" aria-label="Permalink to &quot;握手&quot;">​</a></h2><p>目的：协商TLS版本、加密套件（对称加密算法，密钥交换算法、摘要算法、非对称加密算法等）</p><p>安全特性：</p><ol><li>机密性</li><li>完整性</li><li>身份认证</li><li>不可否认</li></ol><p>加密方式：</p><ol><li>对称加密 比如 RC4、DES、3DES、AES、ChaCha20 等，但前三种算法都被认为是不安全的，通常都禁止使用，目前常用的只有 AES 和 ChaCha20。</li></ol><p>缺点：无法安全地传输秘钥 2. 非对称加密</p><p>RSA：它的安全性基于“整数分解”的数学难题，使用两个超大素数的乘积作为生成密钥的材料，想要从公钥推算出私钥是非常困难的。</p><p>ECC（Elliptic Curve Cryptography）是非对称加密里的“后起之秀”，它基于“椭圆曲线离散对数”的数学难题，使用特定的曲线方程和基点生成公钥和私钥，子算法 ECDHE 用于密钥交换，ECDSA 用于数字签名。</p><p>缺点：虽然非对称加密没有“密钥交换”的问题，但因为它们都是基于复杂的数学难题，运算速度很慢</p><ol start="3"><li>混合加密 用RSA、ECDHE解决秘钥交换的问题，然后用随机数产生“会话秘钥”，通过公钥加密传递给对方，对方用私钥解密取出会话秘钥，然后后续就不再使用非对称加密。</li></ol>',56)]))}const d=i(o,[["render",r]]);export{P as __pageData,d as default};
