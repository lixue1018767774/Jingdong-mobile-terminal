window.onload = function () {
	// 顶部的通栏 滚动的效果
	// headerScroll();
	// 倒计时的效果
	cutDownTime();
	// 轮播图的效果
	banner();
}

function headerScroll() {
	// 获取 导航栏
	var navDom = document.querySelector('.jd_nav');
	//  希望获取的是 从顶部 到 导航栏 底部的 距离
	var maxDistance = navDom.offsetTop + navDom.offsetHeight;
	// 获取 顶部的通栏
	var headerDom = document.querySelector('.jd_header');
	headerDom.style.backgroundColor = 'rgba(201,21,35,0)';
	window.onscroll = function () {
		//  获取 滚动的距离 body 是通过 document 点出来的
		var scrollDistance = window.document.body.scrollTop;
		// console.log(scrollDistance);
		// 计算一个 0-1的百分数
		var percent = scrollDistance / maxDistance;
		// console.log(percent);
		// 如果 超过了1 没有意义了 所以 还原为1
		if (percent>1) {
			percent=1;
		}
		// 到这 获取到的 一定是 0-1
		// 设置 顶部通栏的透明度
		headerDom.style.backgroundColor = 'rgba(201,21,35,'+percent+')';
	}
}
// 倒计时方法
function cutDownTime() {
	// 定义 总时间
	var totalHour = 3 ;
	// 转化为秒
	var totalSec = 3*60*60;
	// 获取 想要修改的所有li标签
	// querySelectorAll  querySelector 这两个方法 可以传入 css,css3 中的选择器
	// 如果想要自己封装一个 类似于jq的东西 可以再内部 调用 这两个方法
	var liArr = document.querySelectorAll('.main_content:nth-child(1) .content_top li');
	var timeId = setInterval(function () {
		// 0 判断 是否 小于0了
		if (totalSec<=0) {
			// 干掉 定时器
			clearInterval(timeId);
			console.log('结束啦,你买不到了哦');
			return;
		}
		totalSec--;
		var hour = Math.floor(totalSec / 3600);
		var minute = Math.floor(totalSec % 3600 /60);
		var sec =totalSec % 60;
		// 小时
		liArr[0].innerHTML =Math.floor(hour/10) ;  // 十位 41 / 10  =4.1 所以要取整数
		liArr[1].innerHTML =hour%10 ; // 个位
		// 分
		liArr[3].innerHTML = Math.floor(minute/10);// 是为 55/10 = 5.5 取整
		liArr[4].innerHTML = minute%10;
		// 秒
		liArr[6].innerHTML = Math.floor(sec/10); 
		liArr[7].innerHTML = sec%10; 
	},1000)
}
// 轮播图方法
function banner() {
	// 屏幕的宽度
	var width = document.body.offsetWidth;
	//  获取 轮播图的ul
	var moveUl = document.querySelector('.banner_images');

	// 添加过度效果 由于后面已经设置了 所以 这里 已经没有意义了
	// moveUl.style.transition = 'all .3s';

	// 索引的li标签
	var indexLiArr = document.querySelectorAll('.banner_index li');

	// 定义 index 记录 当前的 索引值
	// 默认 我们的ul 已经 往左边 移动了 一倍的宽度
	// (为什么 一位 最左边的图片 是用来做无限轮播的 不希望用户看到) 所以 index =1
	var index = 1;
	// 开启定时器
	var timeId = setInterval(function () {
		// 累加
		index++;
		// 将 过渡开启 管你三七二十一 只要进来 就开启过渡 保证 过渡效果一直存在
		moveUl.style.transition = 'all .3s';
		// 修改 ul的位置
		moveUl.style.transform = 'translateX('+index*width*-1+'px)';
	},1000);

	// 过渡 结束事件 用来 修正 index的值 并修改索引
	moveUl.addEventListener('webkitTransitionEnd',function () {
		// console.log('过渡结束');
		//  如果 index 太大了 
		if (index>8) {
			index = 1;
			// 关闭过渡
			moveUl.style.transition = '';
			// 瞬间 修改一下 ul 的位置
			moveUl.style.transform = 'translateX('+index*width*-1+'px)';
		}else if(index<1){
			// 跳到倒数第二张
			index= 8;
			// 关闭过渡
			moveUl.style.transition = '';
			// 瞬间 修改一下 ul 的位置
			moveUl.style.transform = 'translateX('+index*width*-1+'px)';
		}
		// 修改 索引li标签的 class
		for (var i = 0; i < indexLiArr.length; i++) {
			indexLiArr[i].className = '';
		}
		// 有一个 1的 差值
		indexLiArr[index-1].className = 'current';
	})
	// 注册 三个 touch事件
	// 定义变量 记录 开始的X
	var startX = 0;
	// 记录移动的值
	var moveX = 0;
	// 记录 distanceX
	var distanceX = 0;
	// 触摸开始
	moveUl.addEventListener('touchstart',function (event) {
		// 关闭定时器
		clearInterval(timeId);
		// 关闭过渡效果
		moveUl.style.transition = '';
		// 记录开始值
		startX = event.touches[0].clientX;
	})

	// 触摸中
	moveUl.addEventListener('touchmove',function (event) {
		// 计算移动的值
		moveX = event.touches[0].clientX - startX;
		// 移动ul
		// 默认的移动值是 index*-1*width 
		moveUl.style.transform = 'translateX('+(moveX+index*-1*width)+'px)';
	})

	// 触摸结束
	moveUl.addEventListener('touchend',function (event) {
		// 定义 最大的 偏移值
		var maxDistance = width/3;
		// 判断 是否超过
		if (Math.abs(moveX)>maxDistance) {
			// 判断 到底是 往左 还是往右移动
			if (moveX>0) {
				index--;
			}else{
				index++;
			}
			// 为了好看 将 过渡效果开启
			moveUl.style.transition = 'all .3s';
			// 吸附 一整页
			moveUl.style.transform = 'translateX('+(index*-1*width)+'px)';
		}else{
			// 如果 进到这里了 说明 没有超过 我们定义的 最大偏移值 吸附回去即可
			// 为了好看 将 过渡效果开启
			moveUl.style.transition = 'all .3s';
			// 吸附回去
			moveUl.style.transform = 'translateX('+(index*-1*width)+'px)';
		}

		// 记录结束值
		// 开启定时器
		timeId = setInterval(function () {
			// 累加
			index++;
			// 将 过渡开启 只要进来 就开启过渡 保证 过渡效果一直存在
			moveUl.style.transition = 'all .3s';
			// 修改 ul的位置
			moveUl.style.transform = 'translateX('+index*width*-1+'px)';
		},1000)
	})

}