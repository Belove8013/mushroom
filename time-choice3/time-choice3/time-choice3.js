var dateOption = document.getElementById('dateBox'),
    hourOption = document.getElementById('hourBox'),
    minuteOption = document.getElementById('minuteBox'),
    dateIndex = 0, // 当前的日期索引
    hourIndex = 0, // 当前的hour索引
    minuteIndex = 0, // 当前的分钟索引
    currentDate, // 格式 2016-11-30
    currentTime = {
        year: '',
        month: '',
        day: '',
        hour: '',
        minute: '',
        currentDate: '' // 格式 2016-11-30
    }, // 当前时间对象
    month2MaxDay = 28, // 2月最大日期
    defaultDayNum = 60, // 默认创建当前日期向后两个月
    isLeapYear = false; // 判断闰年 
/**
 * 获取样式属性
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
function getClass(obj, name) {
    if (obj.currentStyle) {
        return obj.currentStyle[name]; //IE下获取非行间样式
    } else {
        return getComputedStyle(obj, false)[name]; //FF、Chorme下获取非行间样式
    }
}
/**
 * 判断document对象是否有某class
 * @param obj document对象
 * @param cls class名称
 * @returns {Array|{index: number, input: string}}
 */
function hasClass(obj, cls) {
    var classReg = new RegExp('(\\s+|^)' + cls + '(\\s+|$)'),
        flag = false;
    if (!!obj) {
        if (!!obj.length) {
            for (var i = 0; i < obj.length; i++) {
                if (obj[i].nodeType === 1 && (" " + obj[i].className + " ").replace(rclass, " ").indexOf(cls) >= 0) {
                    flag = true;
                }
            }
        } else if (obj.className.match(classReg)) {
            flag = true;
        }
    }
    return flag;
}
/**
 * document对象添加某class
 * @param obj document对象
 * @param cls class名称
 */
function addClass(obj, cls) {
    var classReg = new RegExp('(\\s+|^)' + cls + '(\\s+|$)');
    if (!hasClass(obj, cls)) {
        if (!!obj.length) {
            for (var i = 0; i < obj.length; i++) {
                if (obj[i].nodeType === 1) {
                    obj[i].className += " " + cls;
                }
            }
        } else if (obj.nodeType === 1) {
            obj.className += " " + cls;
        }
    }
}

/**
 * document对象移除某class
 * @param obj document对象
 * @param cls class名称
 */
function removeClass(obj, cls) {
    var classReg = new RegExp('(\\s+|^)' + cls + '(\\s+|$)');
    if (hasClass(obj, cls)) {
        if (!!obj.length) {
            for (var i = 0; i < obj.length; i++) {
                if (obj[i].nodeType === 1) {
                    obj[i].className += obj[i].className.replace(classReg, ' ');
                }
            }
        } else if (obj.nodeType === 1) {
            obj.className = obj.className.replace(classReg, ' ');
        }
    }
}
/**
 * 获取带有某样式的指定元素
 * @param obj document对象
 * @param cls class名称
 * @returns {{}} 返回指定元素的index及当前对象
 */
function getCurrentObj(obj, cls) {
    var classReg = new RegExp('(\\s+|^)' + cls + '(\\s+|$)'),
        currentObj = {};
    if (!!obj.length) {
        for (var i = 0; i < obj.length; i++) {
            if (obj[i].nodeType === 1 && (" " + obj[i].className + " ").replace(/[\t\r\n]/g, " ").indexOf(cls) >= 0) {
                currentObj = {
                    obj: obj[i],
                    index: i
                }
            }
        }
    } else if (obj.className.match(classReg)) {
        currentObj = obj;
    }
    return currentObj;
}

/**
 * 获取当前时间
 * @return {[type]}
 */
function getcurrentTime() {
    var myDate = new Date(),
        hour = myDate.getHours(), //获取当前小时数(0-23)
        minute = myDate.getMinutes(), //获取当前分钟数(0-59)
        year = myDate.getFullYear(), //获取完整的年份(4位,1970-????)
        month = myDate.getMonth() + 1, //获取当前月份(0-11,0代表1月)
        day = myDate.getDate(); //获取当前日(1-31)
    currentDate = year + '-' + month + '-' + day;
    isLeapYear = Date.prototype.isLeapYear; // 判断闰年 
    if (isLeapYear) {
        month2MaxDay = 29
    }
    currentTime = {
        year: year,
        month: month,
        day: day,
        hour: hour,
        minute: minute,
        currentDate: currentDate
    };
}
/**
 * [countDays 判断当前是一年中的第几天]

 * @param  {[type]} date [当前日期]
 * @return {[type]}      [description]
 */
function countDays(date) {
    date = date.split('-');
    var year = parseInt(date[0], 10);
    date = (new Date(date)).getTime();
    var initial = (new Date(year + '-1-1')).getTime(),
        offset = date - initial;
    return Math.floor(offset / 24 / 3600 / 1e3) + 1;
}

/**
 * [creatDate 创建日期]
 * @param  {[type]} dayNum [当前日期向后多少天]
 * @return {[type]}        [description]
 */
function creatDate(dayNum) {
    var result = [],
        now = new Date();
    Date.prototype.getMonthDay = function() {
        return (this.getMonth() + 1) + '月' + this.getDate() + '日';
    }
    if (!dayNum) {
        dayNum = defaultDayNum;
    }
    var newLi = document.createElement('LI');
    newLi.innerHTML = now.getMonthDay();
    addClass(newLi, 'selected');
    dateOption.append(newLi);
    for (var i = 0; i < dayNum; i++) {
        now.setDate(now.getDate() + 1);
        var newLi = document.createElement('LI');
        newLi.innerHTML = now.getMonthDay();
        dateOption.append(newLi);
    }
    dateIndex = countDays(currentDate); // 当前是第几天
    dateOption.style.top = -0;

}
/**
 * 创建时钟
 * @param  {[type]}
 * @return {[type]}
 */
function creatTimeClock(dayNum) {
    var currentDay = currentTime.day,
        currentMonth = currentTime.month;
    if (!dayNum) {
        dayNum = defaultDayNum;
    }
    creatDate(dayNum);
    // 创建小时
    for (var hour = 0; hour < 24; hour++) {
        var newMinuteLi = document.createElement('LI');
        newMinuteLi.innerHTML = hour + '时';
        if (hour == currentTime.hour) {
            addClass(newMinuteLi, 'selected');
            hourIndex = hour + 1;
        }
        hourOption.append(newMinuteLi);
    }
    hourOption.style.top = -(hourIndex - 1) * hourOption.children[1].offsetHeight;
    // 创建分钟
    for (var minute = 0; minute < 60; minute++) {
        var newMinuteLi = document.createElement('LI');
        newMinuteLi.innerHTML = minute + '分';
        if (minute == currentTime.minute) {
            addClass(newMinuteLi, 'selected');
            minuteIndex = minute + 1;
        }
        minuteOption.append(newMinuteLi);
    }
    minuteOption.style.top = -(minuteIndex - 1) * minuteOption.children[1].offsetHeight;
}
var timeClockObj = {},
    isSlideQuickOver = true, // 快滑是否结束
    /**
     * [initTimeClock description]
     * @param  {[type]} option [传入的盒子document对象]，如 document.getElementById('dateBox')
     * @return {[type]}        [description]
     */
    bindTimeClock = function(dayNum) {
        var isDown = false, // 鼠标是否键下
            objY, // 当前对象距离顶部的高度
            startY,
            originY,
            maxTop = 0, // 最大top
            minTop = 0, // 最小top
            startTime, // 鼠标键下去的时间
            option, // 当前点击的对象所在的盒子
            singleLiHeight,
            liArrObj, // 所有的孩子节点
            liArr = []; // 子选择的数组
        if (!dayNum) {
            dayNum = defaultDayNum;
        }

        if (!isSlideQuickOver) {
            return;
        }
        /**
         * 鼠标键下
         * @param  {[type]}
         * @return {[type]}
         */
        document.onmousedown = function(e) {
                var obj = e.target;
                option = obj.parentElement;
                if (option === dateOption || option === hourOption || option === minuteOption) {
                    if (option === dateOption) {
                        liLength = dayNum;
                    } else if (option === hourOption) {
                        liLength = 23;
                    } else if (option === minuteOption) {
                        liLength = 59;
                    }
                    liArrObj = option.children;
                    for (var i = 0; i < liArrObj.length; i++) {
                        liArr.push(liArrObj[i]);
                    }
                    objY = option.style.top;
                    startY = e.clientY;
                    originY = e.clientY;
                    startTime = new Date().getTime();
                    isDown = true;
                }
            }
            /**
             * 鼠标移动
             * @param  {[type]}
             * @return {[type]}
             */
        document.onmousemove = function(e) {
                if (isDown) {
                    var currentTop = parseInt(option.style.top || 0), // 当前选择的top

                        y = e.clientY, // 当前鼠标的y位置
                        lastTop = 0, // 最终的top
                        moveY = parseInt(y) - parseInt(startY), // 移动的y
                        newTop = currentTop + moveY; // 移动过程中试试的新top
                    singleLiHeight = option.children[0].offsetHeight, // 单个选择的高度
                        minTop = -(option.offsetHeight - 2 * singleLiHeight);
                    if (newTop >= maxTop) {
                        lastTop = maxTop;
                    } else if (newTop < minTop) {
                        lastTop = minTop;
                    } else {
                        lastTop = newTop;
                    }
                    option.style.top = lastTop + 'px';
                    var nowObj = getCurrentObj(liArr, 'selected'),
                        count = Math.abs(Math.round(lastTop / singleLiHeight)); // 四舍五入
                    removeClass(nowObj.obj, 'selected'); // 移除之前的选中元素
                    if (Math.abs(count) + 1 < liLength && Math.abs(count) >= 0) {
                        addClass(option.children[Math.abs(count) + 1], 'selected');
                    } else {
                        addClass(option.children[liLength], 'selected');
                    }
                    startY = y; // 赋值最新的位置
                    e.preventDefault();
                }
            }
            /**
             * 鼠标离开
             * @param  {[type]}
             * @return {[type]}
             */
        document.onmouseup = function(e) {
                if (isDown) {
                    var endTop = parseInt(option.style.top || 0),
                        endY = e.clientY,
                        singleLiHeight = option.children[0].offsetHeight,
                        count = Math.round(endTop / singleLiHeight), // 四舍五入
                        endTime = new Date().getTime(), // 鼠标离开的时间
                        timeLong = endTime - startTime, // 拖动的时间长度
                        moveHeight = endY - originY, // 拖动的距离长度 
                        sprit = moveHeight / timeLong;
                    var nowObj = getCurrentObj(liArr, 'selected');
                    removeClass(nowObj.obj, 'selected'); // 移除之前的选中元素
                    // 处理快滑事件
                    if (Math.abs(sprit) > 0.6 && Math.abs(moveHeight) >= 100) {
                        var lastTop;
                        if (moveHeight > 0) {
                            if ((count + 15) * singleLiHeight < maxTop) {
                                lastTop = (count + 15) * singleLiHeight + 'px';
                                addClass(option.children[Math.abs(count + 15) + 1], 'selected');
                            } else {
                                lastTop = maxTop + 'px';
                                addClass(option.children[1], 'selected');
                            }
                        } else {
                            if ((count - 15) * singleLiHeight > minTop) {
                                lastTop = (count - 15) * singleLiHeight + 'px';
                                addClass(option.children[Math.abs(count - 15) + 1], 'selected');
                            } else {
                                lastTop = minTop + 'px';
                                addClass(option.children[liLength + 1], 'selected');
                            }
                        }
                        var second = 50;
                        slideQuick(objY, lastTop, moveHeight, second);
                    } else {
                        option.style.top = count * singleLiHeight + 'px';
                        if (Math.abs(count) + 1 < liLength && Math.abs(count) >= 0) {
                            addClass(option.children[Math.abs(count) + 1], 'selected');
                        } else {
                            addClass(option.children[liLength + 1], 'selected');
                        }
                    }
                    isDown = false;
                }
            }
            /**
             * [slideQuick 快速滑动]
             * @param  {[type]} lastTop    [description]
             * @param  {[type]} moveHeight [description]
             * @return {[type]}            [description]
             */


        function slideQuick(changeTop, lastTop, moveHeight, second) {
            var timer = null;
            if (moveHeight < 0) {
                option.style.top = (parseInt(changeTop) - singleLiHeight);
            } else {
                option.style.top = (parseInt(changeTop) + singleLiHeight);
            }
            changeTop = option.style.top;
            // 判断结束条件
            if (moveHeight >= 0 && (parseInt(changeTop) >= parseInt(lastTop) && parseInt(changeTop) <= 0)) {
                option.style.top = lastTop;
                clearTimeout(timer);
            } else if (moveHeight < 0 && parseInt(changeTop) <= parseInt(lastTop)) {
                option.style.top = lastTop;
                clearTimeout(timer);
            } else {
                timer = setTimeout(function() {
                    slideQuick(changeTop, lastTop, moveHeight, second);
                }, second); //递归调用，表示1s后执行一次
                second = second + 10;
            }
        }

    };
getcurrentTime();
creatTimeClock(isLeapYear, currentTime);
bindTimeClock(); // 绑定时钟事件
