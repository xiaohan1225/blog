// 文档：https://developer.chrome.com/docs/extensions/get-started/tutorial/scripts-on-every-tab?hl=zh-cn

const reg = /project\/(\d+)/;
const projecId = location.href.match(reg)[1];
console.log("projecId", projecId);

const projecIdMap = {
  2744361: "mojave",
  2744194: 'new-book'
};
const requestBase = projecIdMap[projecId] || 'turtle';
/**
 * 1. get方法
 * // 获取分类  https://app.apifox.com/project/2744194/apis/api-194345963
  export function getCategorys(params) {
    return request.get('/categorys', params, { requestBase: 'turtle' });
  }

 */
let text = '';

function getInfo() {
  const parent = document.querySelector(".base-info-path");
  let methodDOM = null,
    pathDOM = null;
  if (parent) {
    methodDOM = parent.querySelector(".request-method-icon");
    pathDOM = parent.querySelector(
      ".pui-g-ui-kit-copyable-text-kit-index-copyable"
    );
  }
  let descDOM = document.querySelector(
    ".pui-g-ui-kit-copyable-text-kit-index-copyable"
  );
  const hasDom = methodDOM || pathDOM || descDOM;

  // const method = document.querySelector("base-info-path select-text > span");
  if (hasDom) {
    const method = methodDOM.textContent;
    const path = pathDOM.textContent;
    const desc = descDOM.textContent;

    if (method === "GET") {
      text =`
// ${desc}  ${location.href}
export function get(params) {
  return request.get('${path}', params, { requestBase: '${requestBase}' });
}`;
      console.log('text', text);
      descDOM.addEventListener('click', () => {
        copy(text);
      })
    }
    
  }

  return hasDom;
}

let timer = setInterval(() => {
  if (getInfo()) {
    clearInterval(timer);
    timer = null;
  }
}, 1000);


// function copy(content) {
//   const dom = document.createElement("textarea");
//   dom.value = content;
//   document.body.appendChild(dom);
//   dom.select();
//   document.execCommand("copy");
//   document.body.removeChild(dom);
// }
// copy('xxx')
function copy(text) {
  console.log('isSecureContext', window.isSecureContext);
  navigator.clipboard
      .writeText(text)
      // .then(
      //   () => {
      //     console.log('复制成功');
      //   },
      // )
}
function removeIndent(str) {
  // 匹配字符串开头的空白符，包括空格、制表符和换行符后的空白
  const regex = /^[\s\uFEFF\xA0]+/gm;
  return str.replace(regex, '');
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
      copy(text);
      console.log('复制成功')
      sendResponse({ message: 'success' });
      
  }
);
 