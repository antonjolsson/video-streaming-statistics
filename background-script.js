function onCreated() {
  console.log('Menu item created!')
}

browser.menus.create(
    {
        id: "show-statistics",
        title: "Show video statistics",
        contexts: ["all"],
    },
    onCreated,
);

browser.menus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
    case "show-statistics":
        browser.tabs
            .query({
                currentWindow: true,
                active: true,
            })
            .then(res => {
                const tabId = res[0].id
                browser.tabs.sendMessage(tabId, info.targetElementId)
            })
      break;
  }
})
