"use strict";

const gridStyles = getComputedStyle(document.querySelector('.grid',null));
const rowHeight = parseInt(gridStyles.getPropertyValue('--grid-row-height'));
const gap = parseInt(gridStyles.getPropertyValue('--grid-gutter'));;

function get_dimensions(el) {
    // Браузер с поддержкой naturalWidth/naturalHeight
    if (el.naturalWidth!=undefined) {
        return { 'real_width':el.naturalWidth,
                 'real_height':el.naturalHeight,
                 'client_width':el.width,
                 'client_height':el.height };
    }
    // Устаревший браузер
    else if (el.tagName.toLowerCase()=='img') {
        var img=new Image();
        img.src=el.src;
        var real_w=img.width;
        var real_h=img.height;
        return { 'real_width':real_w,
                 'real_height':real_h,
                 'client_width':el.width,
                 'client_height':el.height };
    }
    // Что-то непонятное
    else {
        return false;
    }
}

function getDimImg(el) {
    // Изображение уже загружено или взято из кэша браузера
    if (el.complete) {
        var tmp=get_dimensions(el);
        return tmp;
        //alert('complete: '+[tmp.real_width, tmp.real_height]);
    }
    // Ожидаем загрузки изображения
    else {
        el.onload=function(event) {
            event=event || window.event;
            var el=event.target || event.srcElement;
            var tmp=get_dimensions(el);
            return tmp;
            //alert('onload: '+[tmp.real_width, tmp.real_height]);
        }
    }
}

let makeGrid = function() {
  let items = document.querySelectorAll('.grid-item');
  for (let item of items) {
    // вынимаем элемент из грида и измеряем
    item.classList.remove('grid-item-ready');

    let dim = getDimImg(item.querySelector(".picture"));

    let width = dim.real_width * dim.client_height / dim.real_height + 1;
    //let width = item.offsetWidth;
    // рассчитываем, сколько колонок он займет
    let rowSpan = Math.ceil((width + gap)/(rowHeight + gap));
    // задаем соответствующий span в grid-row-end
    item.style.gridColumnEnd = 'span '+rowSpan;
    // возвращаем элемент в грид
    item.classList.add('grid-item-ready');
  }
}

window.addEventListener('load', makeGrid);
window.addEventListener('resize', () => {
  clearTimeout(makeGrid.resizeTimer);
  makeGrid.resizeTimer = setTimeout(makeGrid, 50);
});
