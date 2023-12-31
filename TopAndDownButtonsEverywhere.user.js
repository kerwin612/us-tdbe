/**

// Source code can be found at https://github.com/kerwin612/us-tdbe

## 上下滚动工具
**提供统一的操作入口支持鼠标悬浮触发页面的自动上下滚动，并支持单击快速的滚动到页面顶部或底部**

支持如下的配置项：

// 单击快速滚动到页面顶部或底部的速率
k_cs.speed_by_click = 500;

// 悬浮触发页面自动上下滚动的速率
k_cs.speed_by_over = 100;

// 按钮在页面的z-index
k_cs.zIindex = 1001;

// 需要忽略的站点url
k_cs.ignores = [];

*/

// ==UserScript==
// @name TopAndDownButtonsEverywhere
// @namespace github.com/kerwin612
// @description 提供统一的上下自动滚动快捷入口，并支持单击滚动到顶部或底部
// @version 0.1
// @author kerwin612
// @license MIT
// @include *
// @require https://openuserjs.org/src/libs/kerwin612/Kerwin612.js
// @run-at document-start
// @grant GM.getValue
// @grant GM.setValue
// @grant GM_getValue
// @grant GM_setValue
// @noframes
// ==/UserScript==


// speed by
k_cs.speed_by_click = 500; // edit this value
k_cs.speed_by_over = 100;  // edit this value
// z-index
k_cs.zIindex = 1001;       // edit this value
// ignore url
k_cs.ignores = [];       // edit this value

//t = current time
//b = start value
//c = change in value
//d = duration
Math.easeInOutQuad = function (t, b, c, d) {
    t /= d/2;
    if (t < 1) return c/2*t*t + b;
    t--;
    return -c/2 * (t*(t-2) - 1) + b;
};

kStart(kFunc => {
    kFunc(
        //startup: url匹配上时就会执行的方法，无须返回值，仅执行一次
        (ctx) => {

            let url = window.location.href;
            for (let i = 0, j = k_cs.ignores.length; i < j; i++) {
                if ((window.location.host === k_cs.ignores[i] || url === k_cs.ignores[i] || url.startsWith(k_cs.ignores[i]) || new RegExp(k_cs.ignores[i]).test(url))) {
                    ctx.skip = true;
                    break;
                }
            }
            if (ctx.skip) return;

            // create element
            ctx.ce = function (n) { return document.createElement(n); } // end of function

            // add style
            ctx.addStyle = function (css) {
                var head = document.head || document.getElementsByTagName('head')[0];
                if (head) {
                    var style = ctx.ce("style");
                    style.type = "text/css";
                    style.appendChild(document.createTextNode(css));
                    head.appendChild(style);
                } // end if
            } // end of function

            // add css
            ctx.shareCSS = function (){
                // variables
                var s='', img_up, img_dn;

                // img vs button
                img_up = 'data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAUCAYAAACAl21KAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAB+SURBVDhPY1i1atV/amAGahgCMoNhaIGlS5cKAp19BoRBbLJcj2QILDJINwzoAmMgfoclIkBixkS5DI8hMJcRNgxoSBoOl6CnNZBhaVhdBjWE1MSJahjQkA4KEmYH2GUrV66cSYEhYB+AzKBtFiHkQqKiH6Ro1CDCQTWgYQQAs81DU0G/83sAAAAASUVORK5CYII=';
                img_dn = 'data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAUCAYAAACAl21KAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACPSURBVDhPY2DAAlatWvUfH8amB6vYqEGEg2pgw4iQ7cTKM6xcuXImsYpxqQOZAQ4woIIOCgzrQAl1oEFpZBiWhitFgwx7R4SBIDXYDYGZDFRgTMAwkCHGhBMRJMxwGUa8ITCbli5dKgg08AySN8+AxIhyCboiJMPIN4Qsm6miiYioxltawvSDYogohYTUAQC80UNTOht/YwAAAABJRU5ErkJggg==';
                //menuimg='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAACdUlEQVQ4T72UTUhUURTHf+e+mbHGhhIyNcrUXKSVqWnoQARBH4Lkxp3UIsQscFlIRFBERIs2hR9ULoIgok0QFAatagoUK4ksGC00TEmw8gOcN+/eGAdr9Dljbbq7e855P/7nnP99QsLxhjo6ESrs6ubdifHFNe19ID12sPnEcjXie9VR7GhT4Ohon1d5HgCVtk+ttSJ6P5YyOFo82qioEu341DNvRP8AemwdrbeUp9xSMhSpan6/ABdvqG0aJB3DMRTHQSrFSIVBDyxVIKgiI6YXTA+aLoQ7YGbs4Kk1CcB2E7sYeKRQZ7XlrFNRDhqRcy6gMZe0h27lWN81+rJAbazGDp4UF3A+IIxgmAaKks0QGDAQENi0UJMcmIKSKvWfgcIto004mSJRUoihMTG/ksIWg7g2/HvolinC4fq/AJOOa0tagNMbSzmckUu218+YPcuTyWGasrfni8jn+b16Q3HbJJyPiIwupdZl5OV1FVTlByauweRdsEfAuxkyGiDrzBQqvV5Eut1Aj1Vm72l6kwg0xuShZ/oJHwgw+9Ldgb8aCp/GoCVuoKABJ/GrtoJ9qtG5ZzF+MR725MC2fvhQAtGv8VjWeci50Llcyy4F4fIGcgfLIDIYh/kroeAhDNXBbE8c6tsKxeFhF9AYCUY3RPoWtVzY8pO3aT5MBHZ8A8/6P+noBLzLBPHBrrnIcgpfG5EvicDh8qOHcsIlPrfCIzDbm1rhcp65kb+XJnOfv5qhJ9QxKpicVG815r++nbUEPtWw4pZ5fjuwysxlrvRfeFFaX1nu999k/GrA7cPWKdTquA9XArn8CK1ADZANjAGPgSsLL+UX17ELOiBGjOsAAAAASUVORK5CYII='
                // button id
                s+='#__tadbe__container { position:fixed; right:0; top:40%;z-index:'+k_cs.zIindex+'; }';

                s+='#play_btn_meau { height:40px; width:5px!important; margin:0px!improtant;background:rgba(0, 0, 0, 0.7);position:relative;top:15px;}';
                s+='#play_btn_up { background:url('+img_up+') no-repeat scroll 50% 50% rgba(0, 0, 0, 0.7); }';
                s+='#play_btn_dn { background:url('+img_dn+') no-repeat scroll 50% 50% rgba(0, 0, 0, 0.7); }';
                s+='#play_btn_cl { line-height:36px; font-weight:bold; font-size:24px; text-align:center;display:none; }';


                // button class
                s+='.play_btn { display:block; height:36px; width:36px; margin:5px 0px; cursor:pointer; border-radius:5px 0 0 5px; -webkit-transition-duration:0.5s linear; -o-transition-duration:0.5s linear; -moz-transition-duration:0.5s linear; transition-duration:0.5s linear; opacity:0.65; }';
                s+='.play_btn:hover { opacity:1; }';
                s+='.hidex{display:none;}';
                // append
                ctx.addStyle(''+s);
            } // end of function

            //menu move up
            ctx.move_enter_=function(){
                document.getElementById('play_btn_meau').className = "play_btn hidex";
                document.getElementById('play_btn_up').className = "play_btn ";
                document.getElementById('play_btn_dn').className = "play_btn ";
                document.getElementById('play_btn_cl').className = "play_btn ";

            }
            ctx.move_out_=function(){
                document.getElementById('play_btn_meau').className = "play_btn ";
                document.getElementById('play_btn_up').className = "play_btn hidex";
                document.getElementById('play_btn_dn').className = "play_btn hidex";
                document.getElementById('play_btn_cl').className = "play_btn hidex";

            }

            // move up
            ctx.move_up = function () {
                ctx.position = document.documentElement.scrollTop || document.body.scrollTop;
                window.scrollTo(0, ctx.position-1);
                ctx.t1 = setTimeout(ctx.move_up, k_cs.speed_by_over);

            } // end of function

            // move downn
            ctx.move_dn = function () {
                ctx.position = document.documentElement.scrollTop || document.body.scrollTop;
                window.scrollTo(0, ctx.position+1);
                ctx.t2 = setTimeout(ctx.move_dn, k_cs.speed_by_over);

            } // end of function

            // document height
            ctx.getDocumentHeight = function () {
                return (document.body.scrollHeight > document.body.offsetHeight)?document.body.scrollHeight:document.body.offsetHeight;
            } // end of function

            // document scroll
            ctx.get_scroll = function (a) {
                var d = document,
                    b = d.body,
                    e = d.documentElement,
                    c = "client" + a,
                    a = "scroll" + a;
                return /CSS/.test(d.compatMode)? (e[c]< e[a]) : (b[c]< b[a])
            } // end of function

            // calk
            ctx.scrollTo = function (element, to, duration) {
                var start = element.scrollTop,
                    change = to - start,
                    currentTime = 0,
                    increment = 20,
                    newDuration = (typeof(duration) === 'undefined') ? 500 : duration;

                var animateScroll = function(){
                    currentTime += increment;
                    window.scrollTo(start, (start = Math.easeInOutQuad(currentTime, start, change, newDuration)));
                    if(currentTime < newDuration) { setTimeout(animateScroll, increment); }
                };
                animateScroll();
            } // end of function

        },
        //ready: url匹配上时就会执行的方法，返回bool类型的值，每30ms执行一次，直至此方法返回true后就不再执行
        (ctx) => {
            // figure out if this is moz || IE because they use documentElement
            return ctx.skip || (ctx.el = (navigator.userAgent.indexOf('Firefox') != -1 || navigator.userAgent.indexOf('MSIE') != -1) ? document.documentElement : document.body);
        },
        //run: url匹配上且以上的ready方法返回true后执行的方法，无须返回值，仅执行一次
        (ctx) => {
            if (ctx.skip) return;
            // get scroll
            var ct, menu,up, dn, cl,
                scrolled,
                website = window.location.host,
                h = ctx.get_scroll('Height');

            // add css
            ctx.shareCSS();

            // create DOM element
            ct = ctx.ce('div');
            menu = ctx.ce('span');
            up = ctx.ce('span');
            dn = ctx.ce('span');
            cl = ctx.ce('span');
            cl.innerHTML = 'X';
            // set attribute
            ct.setAttribute('id','__tadbe__container');
            menu.setAttribute('id','play_btn_meau');
            up.setAttribute('id','play_btn_up');
            dn.setAttribute('id','play_btn_dn');
            cl.setAttribute('id','play_btn_cl');
            cl.setAttribute('title','Ignore [TopAndDownButtonsEverywhere] on this site['+website+']');
            // set class
            menu.className = "play_btn ";
            up.className = "play_btn hidex";
            dn.className = "play_btn hidex";
            cl.className = "play_btn hidex";
            // append element
            document.body.appendChild(ct);
            ct.appendChild(menu);
            ct.appendChild(up);
            ct.appendChild(cl);
            ct.appendChild(dn);

            // scroll
            //scrolled = window.pageYOffset || document.documentElement.scrollTop;
            // if scroll
            //up.style.visibility = (scrolled > 0)  ? "" : "hidden";
            //meanu  event over
            ct.addEventListener('mouseover', ctx.move_enter_, false);
            ct.addEventListener('mouseout', ctx.move_out_, false);
            // add event over
            up.addEventListener('mouseover', ctx.move_up, false);
            dn.addEventListener('mouseover', ctx.move_dn, false);
            // add event out
            up.addEventListener('mouseout', function(){clearTimeout(ctx.t1);},false);
            dn.addEventListener('mouseout', function(){clearTimeout(ctx.t2);},false);
            // add event click
            up.addEventListener('click', function(){ ctx.scrollTo(ctx.el, 0, k_cs.speed_by_click); }, false);
            dn.addEventListener('click', function(){ ctx.scrollTo(ctx.el, ctx.getDocumentHeight(), k_cs.speed_by_click); }, false);
            cl.addEventListener('click', function(){ k_cs.ignores.push(website); GM_setValue('ignores', k_cs.ignores); document.body.removeChild(ct); }, false);

            // add event scroll
            // window.onscroll = function() {
            //     var scrolled = window.pageYOffset || document.documentElement.scrollTop, diffHeight = document.body.scrollHeight - window.innerHeight;
            //     // if scroll up
            //     up.style.visibility = (scrolled > 0)  ? "" : "hidden";
            //     // if scroll dn
            //     dn.style.visibility = (diffHeight > scrolled)  ? "" : "hidden";
            // }; // end of function
        }
    );
});
