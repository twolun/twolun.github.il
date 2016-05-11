---
layout: post
title: 浅谈地理定位与测距，及地图API的使用
category: knowledge
---

在今天，几乎你的任何手持智能设备都具备定位功能，例如手机、笔记本、平板电脑。那么这些设备基于什么原理来进行定位呢？仅仅是GPS吗？传统的GPS定位需要花费数分钟的时间，但目前各种设备的平均定位时间只要几秒钟，这是如何做到的？本文将探讨这个问题。

<!--more-->

###定位手段
1. IP地址：基于IP地址的位置信息使用一个外部数据库将IP地址映射到一个物理位置。这种方法的好处是在任何地方都可以使用，定位精度在城市或者街道级别。
2. GPS：GPS利用卫星数据提供精确的位置信息，但GPS得缺点是必须在户外才能定位，而且需要花费较长的时间和耗电。
3. 蜂窝电话：通过三角定位可以根据你与一个或多个蜂窝电话几张的距离来确定你的位置，显然，基站越多定位越准确，而且在室内也能用。
4. WIFI：使用一个或多个WIFI接入点来完成三角定位。这种方法可能很精确，并且快速，在室内也可以使用。

###基础知识

维度和经度共同构成了地球表面的左边系统。纬度在南北方向指定地球上的一个点，经度则在东西方向指定了地球上的一个点。维度从赤道开始测量，经度则以英国格林威治作为起点测量。


###GPS定位
GPS依靠两个参数来计算你所处位置的经纬度：时间和空间。具体的定位原理可以参考下面的一段话：

> GPS satellites broadcast precise time signals using a built-in atomic clock along with their current location. They also broadcast the location of all other satellites in the sky, called the almanac.

> Every 30 seconds, a GPS satellite broadcasts a time stamp, its current location and some less precise location information for other GPS satellites. It takes 25 of these broadcasts (thus, 12.5 minutes) to obtain the full list of satellite locations. This information has to be decoded for a receiver to then properly interpret signals from the satellites that are within range.

> If you know the position of four satellites and the time at which each sent their position information, you—or, rather, your GPS receiver—can calculate to within 10 meters the latitude, longitude, and elevation of your current location along with the exact current time. With three satellites, you lose elevation, but a device can still track movement fairly accurately. Standalone GPS receivers can lock in simultaneously on multiple satellites, and track more than four. Other techniques can improve accuracy, too.

> But, heck, I don’t have 12.5 minutes. I’m a busy man! Give me that location faster!

显然在手机这样的手持设备中，不能单纯的使用GPS进行定位，因为它太过耗时。因此，在在手机中引入了Assisted GPS(AGPS)来辅助定位，以减少定位时间。通过手机内置芯片来辅助计算移动路线，从而避免不断从GPS卫星中下载数据。

###基站定位
在CDMA网络中，网络基础操作依赖于GPS的授时。实际上，CDMA信号塔都内置了一个GPS单元，用于与GPS的原子时间进行同步。另外蜂窝信号塔也具有非常准确的GPS位置数据，因此你可以利用蜂窝基站来进行位置定位。但是这依赖于蜂窝基站的数量，因此在偏远地区，定位精度将非常的差。

###WIFI定位

WIFI定位的定位原理与基站定位相似，因为一般AP都是固定的，可以获得较为准确的位置数据，WIFI的辐射范围有限，因此如果你在WIFI的覆盖范围内，根据信号强度，能够提供非常准确的位置信息。

> Apple, Google, and others turn to Wi-Fi positioning for that. Wi-Fi positioning, originated by Skyhook Wireless, originally required specially equipped trucks with Wi-Fi antennas and highly sensitive GPS receivers that drove around cities to capture network identifiers (the unique hardware address broadcast by Wi-Fi base stations) and relative signal strengths at billions of points. As with cell towers, if you have enough networks and enough signal strength information, you can approximate a position.

另外，根据Apple，Goolge的说法，当你使用wifi定位的时候，你的位置信息会被发送回他们的服务器，用于丰富位置信息数据库，从而改进定位信息，这利用了众包的思路，但同时，他们也都否认会跟踪用户的位置信息。

###HTML5与定理定位

既然我们知道了定位的基本原理，下面我们利用简单的代码来获得当前的位置信息。利用HTML5以及基于javascript的地理定位API，可以很容易的在页面中访问位置信息。目前，地理定位得到了浏览器很好的支持，几乎每个现代浏览器都支持地理定位，包括桌面和移动浏览器。因此，最好将你的浏览器升级到最新版本。

	function getMyLocation() {
	    if(navigator.geolocation) {
	        navigator.geolocation.getCurrentPosition(displayLocation);
	    } else {
	        alert("Oops, no geolocation support!")
	    }
	}
	
	function displayLocation(position) {
	    var latitude = position.coords.latitude;
	    var longitude = position.coords.longitude;
	
	    var div = document.getElementById("location");
	    div.innerHTML = "you are at Latitude: " + latitude + ", Longitude: " + longitude;
	}

当浏览器支持地理定位时，它的navigation对象中有一个geolocation属性。通过geolocation可以获得当前的位置信息。

###计算地球上两点间的距离

既然获得了地理位置信息，我们想更进一步的测量地球上两点间的距离。想想我们在使用导航的时候，导航是如何计算距离的？要计算两个坐标之间的距离，通常我们使用半正矢(Haversine)公式。其详细解释见[2]

![Haversine Formula](/img/posts/141006-haversine.PNG)

我们将公式转换为javascript代码，如下：

	function computeDistance(startCoords, destCoords) {
	    var startLatRads = degreesToRadians(startCoords.latitude);
	    var startLongRads = degreesToRadians(startCoords.longitude);
	    var destLatRads = degreesToRadians(destCoords.latitude);
	    var destLongRads = degreesToRadians(destCoords.longitude);
	
	    var Radius = 6371; //radius of the Earth in km
	    var distance = Math.acos(Math.sin(startLatRads) * Math.sin(destLatRads) +
	                            Math.cos(startLatRads) * Math.cos(destLatRads) *
	                            Math.cos(startLongRads - destLongRads)) * Radius;
	
	    return distance;
	}
	
	function degreesToRadians(degree){
	    var radians = (degree * Math.PI)/180;
	    return radians;
	}

事实上，各个地图API几乎都实现了测距功能，通过调用简单的函数，即可得到两点间的距离。这里，我们只是为了介绍其原理，在实际使用时，我们无需自己手动实现该算法。以百度地图为例，获得两点间的距离，我们可以调用：
	
	map.getDistance(pointA,pointB))

###可视化地理信息

我们获得了当前位置的经纬度，通过地图API我们可以将地址位置信息更加形象的表现出来。这里，我们使用百度地图用于可视化当前的位置信息。关于百度地图的详细API文档请参考[3],[4]。这里我们只是做简单的演示。

1.引入百度地图的JS库

	<script src="http://api.map.baidu.com/api?v=2.0&ak=APIKEY"></script>

2.利用得到的经纬度信息，将其在地图中显示出来

	function showMap(longitude, latitude){
	    var map = new BMap.Map("container");
	    var point = new BMap.Point(longitude,latitude);
	    var marker = new BMap.Marker(point);
	    map.centerAndZoom(point, 15);
	    map.addOverlay(marker);//add marker
	}

3.得到的效果如下	

![Baidu map api](/img/posts/141006-map.PNG)

关于地图API的更多实例，请参考各种地图的API文档。

###References:
1. http://www.macworld.com/article/1159528/how_iphone_location_works.html
2. http://en.wikipedia.org/wiki/Haversine_formula
3. http://developer.baidu.com/map/index.php
4. http://developer.baidu.com/map/jsdemo.htm