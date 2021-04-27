//by하하캔디, 최종수정 2021/04/26 23:43
//able drag
(function () {
    if (window.subvaAllowRightClick === undefined) {
        // https://greasyfork.org/en/scripts/23772-absolute-enable-right-click-copy/code
        window.subvaAllowRightClick = function (dom) {
            (function GetSelection() {
                var Style = dom.createElement('style');
                Style.type = 'text/css';
                var TextNode = '*{user-select:text!important;-webkit-user-select:text!important;}';
                if (Style.styleSheet) {
                    Style.styleSheet.cssText = TextNode;
                }
                else {
                    Style.appendChild(dom.createTextNode(TextNode));
                }
                dom.getElementsByTagName('head')[0].appendChild(Style);
            })();

        };
        function runAll(w) {
            try {
                window.subvaAllowRightClick(w.document);
            } catch (e) {
            }
            for (var i = 0; i < w.frames.length; i++) {
                runAll(w.frames[i]);
            }
        }
    }	
    runAll(window);
})();

// set video(save volume, click video pause)
var setCookie = function(name, value, exp) {
	var date = new Date();
	date.setTime(date.getTime() + exp*24*60*60*1000);
	document.cookie = name + '=' + value + ';expires=' + date.toUTCString() + ';path=/';
};
var getCookie = function(name) {
	var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
	return value? value[2] : null;
};
document.getElementByXPath = 
	function(sValue) {
		var a = this.evaluate(sValue, this, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		if (a.snapshotLength > 0){
			return a.snapshotItem(0); 
		} 
};
var vid = null;
var subT = null;
var clickSO = null;
var clickSOOri = null;
var videoFound = false;
var vid_volume_cookie = null;
var vid_mute_cookie = null;
var menuList = null;
var menuClicked = false;
var menuWindow = null;
var animeList = null;
var latestVideo = null;
var videoEnd = false;
var aniListViewed = false;
var nextVideo = null;
var nextBtn = null;
var nextBtnFlag = false;
var nextBtnDealy = 0;
var playBtn = null;
var playBtnDealy = 0;
var continueBtn = null;
var continueBtnDealy = 0;
function controlPlayer(e){
	if(e.path.length == 14 || clickSO == vid){
		if (!vid.paused) {
			vid.pause();
		} else {
			vid.play();
		}
	}
}
function pushContinueCancelBtn(){
	if(videoEnd){
		continueBtn = document.getElementByXPath("/html/body/div[7]/div[7]/div[3]/div[2]/div/div/div/div[1]/table/tbody/tr/td[2]/table/tbody/tr/td[1]/table/tbody/tr/td[4]/span/em/button");
		if(continueBtn){
			if(playBtn !== null && Date.now()-continueBtnDealy > 1500){
				continueBtn.click();
			}

		}	
	}
}
function setVideo(){
	vid = document.getElementsByClassName("video");
	if (vid.length === 0) {
		console.log("finding player...");
		subT = null;
		videoFound = false;
		menuList = null;
		menuClicked = false;
		clickSO = null;
		clickSOOri = null;
		//auto next play
		if(videoEnd){
			aniListViewed = !document.getElementByXPath("/html/body/div[7]/div[2]/div[3]/div[1]/div/div/div[2]/div/div/div/div[2]/div[1]/div/div[1]/div[2]/div[2]/div[4]").getAttribute("class").includes("x-hide-display");
			if(aniListViewed){
				nextVideo = document.getElementByXPath("/html/body/div[7]/div[2]/div[3]/div[1]/div/div/div[2]/div/div/div/div[2]/div[1]/div/div[1]/div[2]/div[2]/div[4]/div/div/div/div[1]/div/div[1]/div/div/div[2]/div/div/div/div/div/div[1]");
				nextVideo = nextVideo.textContent;
				if(latestVideo === nextVideo || !nextBtnFlag){
					nextBtnFlag = true;
					nextBtn = document.getElementsByClassName("x-btn next syno-ux-button syno-ux-button-default syno-vs2-action-button x-btn-noicon x-border-panel")[0];
					
					if(!nextBtn.getAttribute("class").includes("x-item-disabled")){
						nextBtn.click();
						playBtnDealy = Date.now();
					}else{
						videoEnd = false;
					}
				}
				if(videoEnd && nextBtnFlag){
					playBtn = document.getElementByXPath("/html/body/div[7]/div[2]/div[3]/div[1]/div/div/div[2]/div/div/div/div[2]/div[1]/div/div[1]/div[2]/div[2]/div[4]/div/div/div/div[1]/div/div[1]/div/div/div[1]/div/div/div[1]/span[1]/em/button");
					if(playBtn !== null && Date.now()-playBtnDealy > 1500){
						playBtn.click();
						continueBtnDealy = Date.now();
					}
				}
			}else{
				animeList = document.getElementsByClassName("title sds-ellipsis");
				if(animeList){
					for (var i=0; i<animeList.length; i++) {
						animeList[i].textContent = animeList[i].textContent.replace(/_|-/gi, " ");
					  if(animeList[i].textContent.includes(latestVideo)){
					     animeList[i].click();
					  }
					}
				}
			}
		}
	}else{
		vid = vid[0].getElementsByTagName("video");
		if(vid.length === 0){
			return;
		}
		videoEnd = false;
		nextVideo = null;
		nextBtn = null;
		playBtn = null;
		continueBtn = null;
		nextBtnFlag = false;
		vid = vid[0];
		subT = document.getElementsByClassName("subtitle");
		subT = subT[subT.length-1]
		if(subT.getAttribute("class").include("x-hide-display")){
			clickSO = vid;
		}else{
			clickSO = subT;
		}
		if(!videoFound){
			videoFound = true;
			console.log("player find!");
			vid_volume_cookie = getCookie("vvc");
			if(vid_volume_cookie !== null){
				vid.volume = vid_volume_cookie;
			}
			vid_mute_cookie = getCookie("vmc");
			if(vid_mute_cookie !== null && vid_mute_cookie === "true"){
				vid.muted = true;
			}
			//clickScreen playerControl
			clickSOOri = clickSO;
			clickSO.addEventListener("mousedown", controlPlayer, true);
			//auto next play
			latestVideo = document.getElementsByClassName("xtb-text title")[0].textContent;
		}else{
			if(clickSOOri != clickSO){
				//clickScreen playerControl
				vid.removeEventListener("mousedown", controlPlayer, true);
				subT.removeEventListener("mousedown", controlPlayer, true);
				
				clickSOOri = clickSO;
				clickSO.addEventListener("mousedown", controlPlayer, true);
			}
		}
		setCookie("vvc", vid.volume, 999);
		setCookie("vmc", vid.muted.toString(), 999);
		//load external subtitle
		if(!menuClicked){
			document.getElementByXPath("/html/body/div[7]/div[5]/div[3]/div[1]/div/div/div/div[6]/div[2]/div[3]/span[7]/em/button").click();
			menuList = document.getElementsByClassName("item sds-ellipsis");
			if(menuList.length > 0){
				for (var i=0; i<menuList.length; i++) {
				  if(menuList[i].textContent.includes("외부 자막")){
				     menuList[i].click();
				  }
				  menuClicked = true;
				}
				menuWindow = document.getElementsByClassName("syno-ux-button-menu");
				menuWindow = menuWindow[menuWindow.length-1]
				menuWindow.style.visibility = "hidden";
			}
		}
		//auto next play
		videoEnd = vid.duration-vid.currentTime < 3;
	}
}
setInterval(setVideo, 1000);
setInterval(pushContinueCancelBtn, 1000);