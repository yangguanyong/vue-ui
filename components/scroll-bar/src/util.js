export default {
  wheelHandle (e, upHandle, downHandle) {
    if (e.wheelDelta) { //判断浏览器IE，谷歌滑轮事件               
      if (e.wheelDelta > 0) { //当滑轮向上滚动时  
        upHandle()
      }  
      if (e.wheelDelta < 0) { //当滑轮向下滚动时  
        downHandle()
      }  
    } else if (e.detail) {  //Firefox滑轮事件  
      if (e.detail> 0) { //当滑轮向上滚动时  
        upHandle()
      }  
      if (e.detail< 0) { //当滑轮向下滚动时  
        downHandle()
      }  
    }  
  }
}