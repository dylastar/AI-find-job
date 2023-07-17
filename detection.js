// ==UserScript==
// @name         Boss AI
// @version      1.0.0
// @description  "Remove inactive recruiters.
// @author       Dylan
// @match       *://*.zhipin.com/web/geek/job*
// @icon         https://www.zhipin.com/favicon.ico
// @grant        none
// ==/UserScript==

//网页脚本
(function() {
  'use strict';

// 创建一个可拖拽的自定义框
function createDraggableBox() {
  const box = document.createElement('div');
  box.style.position = 'fixed';
  box.style.top = '150px';
  box.style.left = '1600px';
  // box.style.transform = 'translate(-50%, -50%)';
  box.style.width = '200px';
  box.style.height = '300px';
  box.style.backgroundColor = 'skyblue';
  box.style.border = '2px solid blue';
  box.style.borderRadius = '8px';
  box.style.zIndex = '9999';
  box.style.cursor = 'move';

  // 添加按钮
  const button = document.createElement('button');
  button.textContent = '保留仅在今日活跃的HR';
  button.style.marginTop = '10px'; // 调整按钮与盒子的间距

  // 按钮点击事件
  button.addEventListener('click', detection);

  // 添加按钮到盒子内部
  box.appendChild(button);

  // 记录鼠标与拖拽框的偏移量
  let offsetX, offsetY;

  // 让框可拖拽
  let isDragging = false;
  box.addEventListener('mousedown', function(e) {
    isDragging = true;
    offsetX = e.screenX - box.getBoundingClientRect().left;
    offsetY = e.screenY - box.getBoundingClientRect().top;
  });

  document.addEventListener('mousemove', function(e) {
    if (isDragging) {

      box.style.left = e.screenX - offsetX + 'px';
      box.style.top = e.screenY - offsetY + 'px';
    }
  });

  document.addEventListener('mouseup', function() {
    isDragging = false;
  });

  document.body.appendChild(box);
}

// 在页面加载完成后生成可拖拽的自定义框
window.addEventListener('load', function() {
  createDraggableBox();
});
})();

//过滤仅在今日活跃HR的函数
async function detection() {
    const liElements = document.querySelectorAll("li.job-card-wrapper");
    for (const e of liElements) {
      const newWindow = window.open(e.querySelector('a').href, "_blank");

      await new Promise((resolve) => {
        newWindow.onload = () => {
          const keymsg = newWindow.document.querySelector('span.boss-active-time');
          if (keymsg) {
            if (keymsg.textContent == '刚刚活跃' || keymsg.textContent == '今日活跃') {
                document.querySelector('span.salary').style = "color: #24272e;"
              console.log('%c' + keymsg.textContent,'color:green;');
              newWindow.close();
            } else {
              console.log(keymsg.textContent);
              e.remove();
              newWindow.close();
            }
          } else {
            e.style = "background-color: #00b100;"
            console.log("%chr在线", "color: red;");
            newWindow.close();
          }
          resolve();
        };
      });
    }
  }