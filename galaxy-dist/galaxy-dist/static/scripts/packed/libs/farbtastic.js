(function(b){var a=false;b.fn.farbtastic=function(c){b.farbtastic(this,c);return this};b.farbtastic=function(c,d){var c=b(c)[0];return c.farbtastic||(c.farbtastic=new b._farbtastic(c,d))};b._farbtastic=function(c,d){var e=this;e.linkTo=function(f){if(typeof e.callback=="object"){b(e.callback).unbind("keyup",e.updateValue)}e.color=null;if(typeof f=="function"){e.callback=f}else{if(typeof f=="object"||typeof f=="string"){e.callback=b(f);e.callback.bind("keyup",e.updateValue);if(e.callback[0].value){e.setColor(e.callback[0].value)}}}return this};e.updateValue=function(f){if(this.value&&this.value!=e.color){e.setColor(this.value)}};e.setColor=function(f){var g=e.unpack(f);if(e.color!=f&&g){e.color=f;e.rgb=g;e.hsl=e.RGBToHSL(e.rgb);e.updateDisplay()}return this};e.setHSL=function(f){e.hsl=f;e.rgb=e.HSLToRGB(f);e.color=e.pack(e.rgb);e.updateDisplay();return this};e.initWidget=function(){var f={width:d.width,height:d.width};b(c).html('<div class="farbtastic" style="position: relative"><div class="farbtastic-solid"></div><canvas class="farbtastic-mask"></canvas><canvas class="farbtastic-overlay"></canvas></div>').find("*").attr(f).css(f).end().find("div>*").css("position","absolute");b.browser.msie&&b("canvas",c).each(function(){var g={"class":b(this).attr("class"),style:this.getAttribute("style")},h=document.createElement("canvas");b(this).before(b(h).attr(g)).remove();G_vmlCanvasManager&&G_vmlCanvasManager.initElement(h);b(h).attr(f).css(f).css("position","absolute").find("*").attr(f).css(f)});e.radius=(d.width-d.wheelWidth)/2-1;e.square=Math.floor((e.radius-d.wheelWidth/2)*0.7)-1;e.mid=Math.floor(d.width/2);e.markerSize=d.wheelWidth*0.3;e.solidFill=b(".farbtastic-solid",c).css({width:e.square*2-1,height:e.square*2-1,left:e.mid-e.square,top:e.mid-e.square});e.cnvMask=b(".farbtastic-mask",c);e.ctxMask=e.cnvMask[0].getContext("2d");e.cnvOverlay=b(".farbtastic-overlay",c);e.ctxOverlay=e.cnvOverlay[0].getContext("2d");e.ctxMask.translate(e.mid,e.mid);e.ctxOverlay.translate(e.mid,e.mid);e.drawCircle();e.drawMask()};e.drawCircle=function(){var j=+(new Date());var s=24,q=e.radius,l=d.wheelWidth,p=8/q/s*Math.PI,t=e.ctxMask,g=0,z,B;t.save();t.lineWidth=l/q;t.scale(q,q);for(var v=0;v<=s;++v){var A=v/s,f=A*Math.PI*2,y=Math.sin(g),h=-Math.cos(g);x2=Math.sin(f),y2=-Math.cos(f),am=(g+f)/2,tan=1/Math.cos((f-g)/2),xm=Math.sin(am)*tan,ym=-Math.cos(am)*tan,color2=e.pack(e.HSLToRGB([A,1,0.5]));if(v>0){if(b.browser.msie){var o=(1+Math.min(Math.abs(Math.tan(g)),Math.abs(Math.tan(Math.PI/2-g))))/s;z=e.pack(e.HSLToRGB([B-0.15*o,1,0.5]));color2=e.pack(e.HSLToRGB([A+0.15*o,1,0.5]));var k=t.createLinearGradient(y,h,x2,y2);k.addColorStop(0,z);k.addColorStop(1,color2);t.fillStyle=k;var x=(q+l/2)/q,u=(q-l/2)/q;t.beginPath();t.moveTo(y*x,h*x);t.quadraticCurveTo(xm*x,ym*x,x2*x,y2*x);t.lineTo(x2*u,y2*u);t.quadraticCurveTo(xm*u,ym*u,y*u,h*u);t.fill()}else{var k=t.createLinearGradient(y,h,x2,y2);k.addColorStop(0,z);k.addColorStop(1,color2);t.strokeStyle=k;t.beginPath();t.moveTo(y,h);t.quadraticCurveTo(xm,ym,x2,y2);t.stroke()}}g=f-p;z=color2;B=A}t.restore();a&&b("body").append("<div>drawCircle "+(+(new Date())-j)+"ms")};e.drawMask=function(){var p=+(new Date());var s=e.square*2,h=e.square;function g(D,B,t){var w=1/D,v=1/B;for(var A=0;A<=B;++A){var u=1-A*v;for(var E=0;E<=D;++E){var F=1-E*w;var C=1-2*Math.min(u*F,(1-u)*F);var z=(C>0)?((2*u-1+C)*0.5/C):0;t(E,A,z,C)}}}if(e.ctxMask.getImageData){var m=Math.floor(s/2);var k=document.createElement("canvas");k.width=k.height=m+1;var q=k.getContext("2d");var j=q.getImageData(0,0,m+1,m+1);var l=0;g(m,m,function(t,w,v,u){j.data[l++]=j.data[l++]=j.data[l++]=v*255;j.data[l++]=u*255});q.putImageData(j,0,0);e.ctxMask.drawImage(k,0,0,m+1,m+1,-h,-h,h*2,h*2)}else{if(!b.browser.msie){var m=Math.floor(s/2);g(m,m,function(t,w,v,u){v=Math.round(v*255);e.ctxMask.fillStyle="rgba("+v+", "+v+", "+v+", "+u+")";e.ctxMask.fillRect(t*2-h-1,w*2-h-1,2,2)})}else{var r,f,o=6;var n=Math.floor(s/o);g(n,6,function(B,w,u,A){if(B==0){r=f;f=[]}u=Math.round(u*255);A=Math.round(A*255);if(w>0){var E=r[B][0],t=r[B][1],D=e.packDX(E,t),C=e.packDX(u,A),z=Math.round(e.mid+((w-1)*0.333-1)*h),v=Math.round(e.mid+(w*0.333-1)*h);b("<div>").css({position:"absolute",filter:"progid:DXImageTransform.Microsoft.Gradient(StartColorStr="+D+", EndColorStr="+C+", GradientType=0)",top:z,height:v-z,left:e.mid+(B*o-h-1),width:o-(B==n?Math.round(o/2):0)}).appendTo(e.cnvMask)}f.push([u,A])})}}a&&b("body").append("<div>drawMask "+(+(new Date())-p)+"ms")};e.drawMarkers=function(){var p=d.width,j=Math.ceil(e.markerSize/4),f=e.markerSize-j+1;var k=e.hsl[0]*6.28,h=Math.sin(k)*e.radius,s=-Math.cos(k)*e.radius,g=2*e.square*(0.5-e.hsl[1]),q=2*e.square*(0.5-e.hsl[2]),m=e.invert?"#fff":"#000",l=e.invert?"#000":"#fff";var n=[{x:h,y:s,r:f,c:"#000",lw:j+1},{x:h,y:s,r:e.markerSize,c:"#fff",lw:j},{x:g,y:q,r:f,c:l,lw:j+1},{x:g,y:q,r:e.markerSize,c:m,lw:j},];e.ctxOverlay.clearRect(-e.mid,-e.mid,p,p);for(i in n){var o=n[i];e.ctxOverlay.lineWidth=o.lw;e.ctxOverlay.strokeStyle=o.c;e.ctxOverlay.beginPath();e.ctxOverlay.arc(o.x,o.y,o.r,0,Math.PI*2,true);e.ctxOverlay.stroke()}};e.updateDisplay=function(){e.invert=(e.rgb[0]*0.3+e.rgb[1]*0.59+e.rgb[2]*0.11)<=0.6;e.solidFill.css("backgroundColor",e.pack(e.HSLToRGB([e.hsl[0],1,0.5])));e.drawMarkers();if(typeof e.callback=="object"){b(e.callback).css({backgroundColor:e.color,color:e.invert?"#fff":"#000"});b(e.callback).each(function(){if((typeof this.value=="string")&&this.value!=e.color){this.value=e.color}})}else{if(typeof e.callback=="function"){e.callback.call(e,e.color)}}};e.widgetCoords=function(f){return{x:f.pageX-e.offset.left-e.mid,y:f.pageY-e.offset.top-e.mid}};e.mousedown=function(f){if(!b._farbtastic.dragging){b(document).bind("mousemove",e.mousemove).bind("mouseup",e.mouseup);b._farbtastic.dragging=true}e.offset=b(c).offset();var g=e.widgetCoords(f);e.circleDrag=Math.max(Math.abs(g.x),Math.abs(g.y))>(e.square+2);e.mousemove(f);return false};e.mousemove=function(j){var k=e.widgetCoords(j);if(e.circleDrag){var h=Math.atan2(k.x,-k.y)/6.28;e.setHSL([(h+1)%1,e.hsl[1],e.hsl[2]])}else{var g=Math.max(0,Math.min(1,-(k.x/e.square/2)+0.5));var f=Math.max(0,Math.min(1,-(k.y/e.square/2)+0.5));e.setHSL([e.hsl[0],g,f])}return false};e.mouseup=function(){b(document).unbind("mousemove",e.mousemove);b(document).unbind("mouseup",e.mouseup);b._farbtastic.dragging=false};e.dec2hex=function(f){return(f<16?"0":"")+f.toString(16)};e.packDX=function(g,f){return"#"+e.dec2hex(f)+e.dec2hex(g)+e.dec2hex(g)+e.dec2hex(g)};e.pack=function(h){var k=Math.round(h[0]*255);var j=Math.round(h[1]*255);var f=Math.round(h[2]*255);return"#"+e.dec2hex(k)+e.dec2hex(j)+e.dec2hex(f)};e.unpack=function(g){if(g.length==7){function f(h){return parseInt(g.substring(h,h+2),16)/255}return[f(1),f(3),f(5)]}else{if(g.length==4){function f(h){return parseInt(g.substring(h,h+1),16)/15}return[f(1),f(2),f(3)]}}};e.HSLToRGB=function(o){var q,p,f,m,n;var k=o[0],t=o[1],j=o[2];p=(j<=0.5)?j*(t+1):j+t-j*t;q=j*2-p;return[this.hueToRGB(q,p,k+0.33333),this.hueToRGB(q,p,k),this.hueToRGB(q,p,k-0.33333)]};e.hueToRGB=function(g,f,j){j=(j+1)%1;if(j*6<1){return g+(f-g)*j*6}if(j*2<1){return f}if(j*3<2){return g+(f-g)*(0.66666-j)*6}return g};e.RGBToHSL=function(o){var f=o[0],n=o[1],p=o[2],k=Math.min(f,n,p),q=Math.max(f,n,p),t=q-k,m=0,u=0,j=(k+q)/2;if(j>0&&j<1){u=t/(j<0.5?(2*j):(2-2*j))}if(t>0){if(q==f&&q!=n){m+=(n-p)/t}if(q==n&&q!=p){m+=(2+(p-f)/t)}if(q==p&&q!=f){m+=(4+(f-n)/t)}m/=6}return[m,u,j]};if(!d.callback){d={callback:d}}d=b.extend({width:300,wheelWidth:(d.width||300)/10,callback:null,color:"#808080"},d);e.initWidget();b("canvas.farbtastic-overlay",c).mousedown(e.mousedown);if(d.callback){e.linkTo(d.callback)}e.setColor("#808080");e.setColor(d.color)}})(jQuery);