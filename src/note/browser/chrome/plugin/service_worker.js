chrome.runtime.onInstalled.addListener((details) => {
    if(details.reason !== "install" && details.reason !== "update") return;
    chrome.contextMenus.create({
      "id": "apifox",
      "title": "复制apifox",
      "documentUrlPatterns": ["https://app.apifox.com/project/*"],
    //   onClick: (info, tab) => {
    //     console.log('click'. info, tab);
    //   }
    });
    chrome.contextMenus.onClicked.addListener((detail, tab) => {
        console.log('click', tab)
        chrome.tabs.sendMessage(tab.id, {greeting: "hello"}, function(response) {
            console.log('response', response);
            // Unchecked runtime.lastError: Some of the required properties are missing: type, iconUrl, title and message.
            chrome.notifications.create(
                // notificationId?: string,
                '',
                {
                    message: '复制成功',
                    title: '提示',
                    type: 'basic',
                    iconUrl: 'https://pics3.baidu.com/feed/00e93901213fb80e95e763359a5b8220b83894b3.jpeg@f_auto?token=11da8c2c1f642f22270c4dbb97b97143',
                },
                // callback?: function,
              )
        });
    })
  });