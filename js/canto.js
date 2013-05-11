var canto=(function(){var sin=Math.sin,cos=Math.cos,tan=Math.tan;var acos=Math.acos,sqrt=Math.sqrt,abs=Math.abs;var pi=Math.PI,twopi=2*Math.PI;function wrap(methodname){return function(){return this._[methodname].apply(this._,arguments);};}
function wrapAndReturn(methodname){return function(){this._[methodname].apply(this._,arguments);return this;};}
function ensure(c,x,y){if(c._pathIsEmpty)c.moveTo(x,y);}
function setcurrent(c,x,y){c.currentX=x;c.currentY=y;c._lastCCP=null;c._lastQCP=null;c._pathIsEmpty=false;}
function checkcurrent(c){if(c.currentX===undefined)
throw new Error("No current point; can't use relative coordinates");}
function getImage(img){if(typeof img!=="string")return img;var image=null;if(img.charAt(0)==='#')
image=document.getElementById(img.substring(1));if(!image){image=new Image();image.src=img;}
return image;}
function slice(arraylike,from,to){if(to===undefined)to=arraylike.length;return Array.prototype.slice.call(arraylike,from,to);}
function addColorStops(gradient,args){if(args.length%2!==0)
throw new Error("wrong number of arguments");for(var i=0;i<args.length;i+=2)
gradient.addColorStop(args[i],args[i+1]);}
function check(args,n,m,min){if(n!==(m?args.length%m:args.length)||args.length<min)
throw new Error("wrong number of arguments");}
function convertAngle(c,x){return c._useDegrees?(x*pi/180):x;}
function angleBetweenVectors(x1,y1,x2,y2){var dotproduct=x1*x2+ y1*y2;var d1=sqrt(x1*x1+ y1*y1);var d2=sqrt(x2*x2+ y2*y2);var x=dotproduct/(d1*d2);if(x>1)x=1;if(x<-1)x=-1;var angle=abs(acos(x));var sign=x1*y2- y1*x2;if(sign===abs(sign))return angle;else return-angle;}
function rotatePoint(x,y,angle){return[x*cos(angle)- y*sin(angle),y*cos(angle)+ x*sin(angle)];}
function resetCantoState(c){c.currentX=c.currentY=undefined;c.startSubpathX=c.startSubpathY=undefined;c._useDegrees=false;c._angleUnitStack=[];c._penup=true;c._orientation=-pi/2;c._lastCCP=undefined;c._lastQCP=undefined;}
var svgnumber=/[+\-]?(\.\d+|\d+\.\d*|\d+)([Ee][+\-]?\d+)?/g;var svgpathelt=/[MmLlZzHhVvCcQqSsTtAa]\s*(([+\-]?(\d+|\d+\.\d*|\.\d+)([Ee][+\-]?\d+)?)(,\s*|\s+,?\s*)?)*/g;function svgpath(text){var elements=text.match(svgpathelt);if(!elements)throw new Error("Bad path: "+ text);for(var i=0;i<elements.length;i++){var element=elements[i];var cmd=element.charAt(0);var args=element.match(svgnumber);var numbers=[];if(args){for(var j=0;j<args.length;j++)
numbers[j]=Number(args[j]);}
this[cmd].apply(this,numbers);}
return this;}
function L(x,y){check(arguments,0,2,2);ensure(this,x,y);this._.lineTo(x,y);for(var i=2;i<arguments.length;i+=2)
this._.lineTo(x=arguments[i],y=arguments[i+1]);setcurrent(this,x,y);return this;}
function l(x,y){check(arguments,0,2,2);checkcurrent(this);var cx=this.currentX,cy=this.currentY;for(var i=0;i<arguments.length;i+=2)
this._.lineTo(cx+=arguments[i],cy+=arguments[i+1]);setcurrent(this,cx,cy);return this;}
function M(x,y){this._.moveTo(x,y);setcurrent(this,x,y);this.startSubpathX=x;this.startSubpathY=y;if(arguments.length>2)L.apply(this,slice(arguments,2));return this;}
function m(x,y){if(this._pathIsEmpty){this.currentX=0;this.currentY=0;}
checkcurrent(this);x+=this.currentX;y+=this.currentY;this._.moveTo(x,y);setcurrent(this,x,y);this.startSubpathX=x;this.startSubpathY=y;if(arguments.length>2)l.apply(this,slice(arguments,2));return this;}
function z(){this._.closePath();setcurrent(this,this.startSubpathX,this.startSubpathY);return this;}
function H(x){checkcurrent(this);for(var i=0;i<arguments.length;i++)
L.call(this,arguments[i],this.currentY);return this;}
function h(x){for(var i=0;i<arguments.length;i++)
l.call(this,arguments[i],0);return this;}
function V(y){checkcurrent(this);for(var i=0;i<arguments.length;i++)
L.call(this,this.currentX,arguments[i]);return this;}
function v(y){for(var i=0;i<arguments.length;i++)
l.call(this,0,arguments[i]);return this;}
function C(cx1,cy1,cx2,cy2,x,y){check(arguments,0,6,6);ensure(this,cx1,cx2);this._.bezierCurveTo(cx1,cy1,cx2,cy2,x,y);for(var i=6;i<arguments.length;i+=6)
this._.bezierCurveTo(arguments[i],arguments[i+1],cx2=arguments[i+2],cy2=arguments[i+3],x=arguments[i+4],y=arguments[i+5]);setcurrent(this,x,y);this._lastCCP=[cx2,cy2];return this;}
function c(cx1,cy1,cx2,cy2,x,y){check(arguments,0,6,6);checkcurrent(this);var x0=this.currentX,y0=this.currentY;for(var i=0;i<arguments.length;i+=6)
this._.bezierCurveTo(x0+ arguments[i],y0+ arguments[i+1],cx2=x0+ arguments[i+2],cy2=y0+ arguments[i+3],x0+=arguments[i+4],y0+=arguments[i+5]);setcurrent(this,x0,y0);this._lastCCP=[cx2,cy2];return this;}
function Q(cx,cy,x,y){check(arguments,0,4,4);ensure(this,cx,cy);this._.quadraticCurveTo(cx,cy,x,y);for(var i=4;i<arguments.length;i+=4)
this._.quadraticCurveTo(cx=arguments[i],cy=arguments[i+1],x=arguments[i+2],y=arguments[i+3]);setcurrent(this,x,y);this._lastQCP=[cx,cy];return this;}
function q(cx,cy,x,y){check(arguments,0,4,4);checkcurrent(this);var x0=this.currentX,y0=this.currentY;for(var i=0;i<arguments.length;i+=4)
this._.quadraticCurveTo(cx=x0+ arguments[i],cy=y0+ arguments[i+1],x0+=arguments[i+2],y0+=arguments[i+3]);setcurrent(this,x0,y0);this._lastQCP=[cx,cy];return this;}
function S(){check(arguments,0,4,4);if(!this._lastCCP)
throw new Error("Last command was not a cubic bezier");checkcurrent(this);var x0=this.currentX,y0=this.currentY;var cx0=this._lastCCP[0],cy0=this._lastCCP[1];for(var i=0;i<arguments.length;i+=4){var cx1=x0+(x0-cx0),cy1=y0+(y0-cy0);var cx2=arguments[i],cy2=arguments[i+1];var x=arguments[i+2],y=arguments[i+3];this._.bezierCurveTo(cx1,cy1,cx2,cy2,x,y);x0=x;y0=y;cx0=cx2;cy0=cy2;}
setcurrent(this,x0,y0);this._lastCCP=[cx0,cy0];return this;}
function s(){check(arguments,0,4,4);if(!this._lastCCP)
throw new Error("Last command was not a cubic bezier");checkcurrent(this);var x0=this.currentX,y0=this.currentY;var cx0=this._lastCCP[0],cy0=this._lastCCP[1];for(var i=0;i<arguments.length;i+=4){var cx1=x0+(x0-cx0),cy1=y0+(y0-cy0);var cx2=x0+arguments[i],cy2=y0+arguments[i+1];var x=x0+arguments[i+2],y=y0+arguments[i+3];this._.bezierCurveTo(cx1,cy1,cx2,cy2,x,y);x0=x;y0=y;cx0=cx2;cy0=cy2;}
setcurrent(this,x0,y0);this._lastCCP=[cx0,cy0];return this;}
function T(){check(arguments,0,2,2);if(!this._lastQCP)
throw new Error("Last command was not a cubic bezier");checkcurrent(this);var x0=this.currentX,y0=this.currentY;var cx0=this._lastQCP[0],cy0=this._lastQCP[1];for(var i=0;i<arguments.length;i+=2){var cx=x0+(x0-cx0),cy=y0+(y0-cy0);var x=arguments[i],y=arguments[i+1];this._.quadraticCurveTo(cx,cy,x,y);x0=x;y0=y;cx0=cx;cy0=cy;}
setcurrent(this,x0,y0);this._lastQCP=[cx0,cy0];return this;}
function t(){check(arguments,0,2,2);if(!this._lastQCP)
throw new Error("Last command was not a cubic bezier");checkcurrent(this);var x0=this.currentX,y0=this.currentY;var cx0=this._lastQCP[0],cy0=this._lastQCP[1];for(var i=0;i<arguments.length;i+=2){var cx=x0+(x0-cx0),cy=y0+(y0-cy0);var x=x0+ arguments[i],y=y0+ arguments[i+1];this._.quadraticCurveTo(cx,cy,x,y);x0=x;y0=y;cx0=cx;cy0=cy;}
setcurrent(this,x0,y0);this._lastQCP=[cx0,cy0];return this;}
function A(rx,ry,rotation,big,clockwise,x,y){if(rx===0||ry===0){L.call(this,x,y);return this;}
big=Boolean(big);clockwise=Boolean(clockwise);checkcurrent(this);var x1=this.currentX,y1=this.currentY;var x2=x,y2=y;var phi=rotation*pi/180;var sinphi=sin(phi);var cosphi=cos(phi);var tx=(x1- x2)/2,ty=(y1-y2)/2;var x1$=cosphi*tx+ sinphi*ty;var y1$=-sinphi*tx+ cosphi*ty;rx=abs(rx);ry=abs(ry);var lambda=x1$*x1$/(rx*rx)+ y1$*y1$/(ry*ry);var cx$,cy$;if(lambda>1){rx*=sqrt(lambda);ry*=sqrt(lambda);cx$=cy$=0;}
else{var rxrx=rx*rx;var ryry=ry*ry;var x1x1$=x1$*x1$;var y1y1$=y1$*y1$;var t=rxrx*y1y1$+ ryry*x1x1$;t=sqrt(rxrx*ryry/t-1);if(big===clockwise)t=-t;cx$=t*rx*y1$/ry;cy$=-t*ry*x1$/rx;}
var cx=cosphi*cx$- sinphi*cy$+(x1+x2)/2;var cy=sinphi*cx$+ cosphi*cy$+(y1+y2)/2;tx=(x1$-cx$)/rx;ty=(y1$-cy$)/ry;var theta1=angleBetweenVectors(1,0,tx,ty);var dtheta=angleBetweenVectors(tx,ty,(-x1$-cx$)/rx,(-y1$-cy$)/ry);if(clockwise&&dtheta<0)dtheta+=twopi;else if(!clockwise&&dtheta>0)dtheta-=twopi;var theta2=theta1+ dtheta;var olddegrees=this._useDegrees;this._useDegrees=false;this.ellipse(cx,cy,rx,ry,phi,theta1,theta2,!clockwise);this._useDegrees=olddegrees;return this;}
function a(rx,ry,rotation,big,clockwise,x,y){checkcurrent(this);A.call(this,rx,ry,rotation,big,clockwise,x+ this.currentX,y+ this.currentY);return this;}
function beginPath(){this._.beginPath();setcurrent(this,undefined,undefined);this.startSubpathX=this.startSubpathY=undefined;this._pathIsEmpty=true;return this;}
function arcTo(x1,y1,x2,y2,r){ensure(this,x1,y1);checkcurrent(this);this._.arcTo(x1,y1,x2,y2,r);var x0=this.currentX,y0=this.currentY;var dx1=x0-x1,dy1=y0-y1;var dx2=x2-x1,dy2=y2-y1;var theta=abs(angleBetweenVectors(dx1,dy1,dx2,dy2));var d=r*tan((pi-theta)/2);var ratio=d/sqrt(dx2*dx2+ dy2*dy2);setcurrent(this,x1+ ratio*dx2,y1+ ratio*dy2);return this;}
function arc(x,y,r,sa,ea,anticlockwise){if(anticlockwise===undefined)anticlockwise=false;if(sa===undefined)sa=0;else sa=convertAngle(this,sa);if(ea===undefined)ea=twopi;else ea=convertAngle(this,ea);var sx=x+ r*cos(sa),sy=y+ r*sin(sa);var ex=x+ r*cos(ea),ey=y+ r*sin(ea);ensure(this,sx,sy);this._.arc(x,y,r,sa,ea,anticlockwise);setcurrent(this,ex,ey);return this;}
function ellipse(cx,cy,rx,ry,rotation,sa,ea,anticlockwise){if(rotation===undefined)rotation=0;else rotation=convertAngle(this,rotation);if(sa===undefined)sa=0;else sa=convertAngle(this,sa);if(ea===undefined)ea=twopi;else ea=convertAngle(this,ea);if(anticlockwise===undefined)anticlockwise=false;var sp=rotatePoint(rx*cos(sa),ry*sin(sa),rotation);var sx=cx+ sp[0],sy=cy+ sp[1];var ep=rotatePoint(rx*cos(ea),ry*sin(ea),rotation);var ex=cx+ ep[0],ey=cy+ ep[1];ensure(this,sx,sy);this._.translate(cx,cy);this._.rotate(rotation);this._.scale(rx/ry,1);this._.arc(0,0,ry,sa,ea,anticlockwise);this._.scale(ry/rx,1);this._.rotate(-rotation);this._.translate(-cx,-cy);setcurrent(this,ex,ey);return this;}
function polygon(){if(arguments.length<6)throw new Error("not enough arguments");if(arguments.length%2===0){this.moveTo(arguments[0],arguments[1]);for(var i=2;i<arguments.length;i+=2)
this.lineTo(arguments[i],arguments[i+1]);}
else{var radius=arguments[arguments.length-1];var n=(arguments.length-1)/2;var x0=(arguments[n*2-2]+ arguments[0])/2;var y0=(arguments[n*2-1]+ arguments[1])/2;this.moveTo(x0,y0);for(var i=0;i<n-1;i++){this._.arcTo(arguments[i*2],arguments[i*2+1],arguments[i*2+2],arguments[i*2+3],radius);}
this._.arcTo(arguments[n*2-2],arguments[n*2-1],arguments[0],arguments[1],radius);}
this.closePath();this.moveTo(arguments[0],arguments[1]);return this;}
function rect(x,y,w,h,radius,rotation){if(arguments.length===4){this._.rect(x,y,w,h);setcurrent(this,x,y);this.startSubpathX=x;this.startSubpathY=y;}
else{if(!rotation){polygon.call(this,x,y,x+w,y,x+w,y+h,x,y+h,radius);}
else{rotation=convertAngle(this,rotation);var points=[x,y];var p=rotatePoint(w,0,rotation);points.push(x+p[0],y+p[1]);p=rotatePoint(w,h,rotation);points.push(x+p[0],y+p[1]);p=rotatePoint(0,h,rotation);points.push(x+p[0],y+p[1]);if(radius)points.push(radius);polygon.apply(this,points);}}
return this;}
function stroke(){if(arguments.length>0){this._.save();this.set.apply(this,arguments);}
this._.stroke();if(arguments.length>0)
this._.restore();return this;}
function fill(){if(arguments.length>0){this._.save();this.set.apply(this,arguments);}
this._.fill();if(arguments.length>0)
this._.restore();return this;}
function paint(){if(arguments.length>0){this._.save();this.set.apply(this,arguments);}
this._.fill();this._.stroke();if(arguments.length>0)
this._.restore();return this;}
function fillRect(x,y,w,h){if(arguments.length>4){this._.save();this.set.apply(this,slice(arguments,4));}
this._.fillRect(x,y,w,h);if(arguments.length>4)this._.restore();return this;}
function strokeRect(x,y,w,h){if(arguments.length>4){this._.save();this.set.apply(this,slice(arguments,4));}
this._.strokeRect(x,y,w,h);if(arguments.length>4)this._.restore();return this;}
function paintRect(x,y,w,h){if(arguments.length>4){this._.save();this.set.apply(this,slice(arguments,4));}
this._.fillRect(x,y,w,h);this._.strokeRect(x,y,w,h);if(arguments.length>4)this._.restore();return this;}
function save(){this._.save();this._angleUnitStack.push(this._useDegrees);return this;}
function restore(){this._.restore();this._useDegrees=this._angleUnitStack.pop();return this;}
function revert(){this._.restore();this._.save();this._useDegrees=this._angleUnitStack[this._angleUnitStack.length-1];return this;}
function set(attributes){for(var i=0;i<arguments.length;i++){var arg=arguments[i];if(typeof arg==="string"){i++;if(i>=arguments.length)
throw new Error("missing attribute value");this[arg]=arguments[i];}
else{for(var attr in arg)this[attr]=arg[attr];}}
return this;}
function pu(){this._penup=true;return this;}
function pd(){this._penup=false;return this;}
function fd(d){var dx=d*cos(this._orientation);var dy=d*sin(this._orientation);if(this._penup)this.m(dx,dy);else this.l(dx,dy);return this;}
function bk(d){var dx=-d*cos(this._orientation);var dy=-d*sin(this._orientation);if(this._penup)this.m(dx,dy);else this.l(dx,dy);return this;}
function rt(angle){this._orientation+=convertAngle(this,angle);this._orientation%=twopi;return this;}
function lt(angle){this._orientation+=convertAngle(this,angle);this._orientation%=twopi;return this;}
function translate(dx,dy){this._.translate(dx,dy);this.currentX=this.currentY=undefined;this.startSubpathX=this.startSubpathY=undefined;return this;}
function scale(x,y){this._.scale(x,y);this.currentX=this.currentY=undefined;this.startSubpathX=this.startSubpathY=undefined;return this;}
function rotate(angle){angle=convertAngle(this,angle);this._.rotate(angle);this.currentX=this.currentY=undefined;this.startSubpathX=this.startSubpathY=undefined;return this;}
function transform(){this._.transform.apply(this._,arguments);this.currentX=this.currentY=undefined;this.startSubpathX=this.startSubpathY=undefined;return this;}
function setTransform(){this._.setTransform.apply(this._,arguments);this.currentX=this.currentY=undefined;this.startSubpathX=this.startSubpathY=undefined;return this;}
function createPattern(image,repeat){return this._.createPattern(getImage(image),repeat);}
function createLinearGradient(x1,y1,x2,y2){var gradient=this._.createLinearGradient(x1,y1,x2,y2);addColorStops(gradient,slice(arguments,4));return gradient;}
function createRadialGradient(x1,y1,r1,x2,y2,r2){var gradient=this._.createRadialGradient(x1,y1,r1,x2,y2,r2);addColorStops(gradient,slice(arguments,6));return gradient;}
function textWidth(text){return this._.measureText(text).width;}
function fillText(text,x,y,maxWidth){var attrs=null,hasMaxWidth=true;if(typeof maxWidth!=="number"){hasMaxWidth=false;if(arguments.length>3)attrs=slice(arguments,3);}
else if(arguments.length>4)attrs=slice(arguments,4);if(attrs){this._.save();this.set.apply(this,attrs);}
if(hasMaxWidth)this._.fillText(text,x,y,maxWidth);else this._.fillText(text,x,y);if(attrs)this._.restore();return this;}
function strokeText(text,x,y,maxWidth){var attrs=null,hasMaxWidth=true;if(typeof maxWidth!=="number"){hasMaxWidth=false;if(arguments.length>3)attrs=slice(arguments,3);}
else if(arguments.length>4)attrs=slice(arguments,4);if(attrs){this._.save();this.set.apply(this,attrs);}
if(hasMaxWidth)this._.strokeText(text,x,y,maxWidth);else this._.strokeText(text,x,y);if(attrs)this._.restore();return this;}
function drawImage(image){var args=[getImage(image)],attrs=null;for(var i=1;i<arguments.length;i++){if(typeof arguments[i]==="number")
args.push(arguments[i]);else break;}
if(i<arguments.length)attrs=slice(arguments,i);if(attrs){this._.save();this.set.apply(this,attrs);}
this._.drawImage.apply(this._,args);if(attrs)this._.restore();}
function reset(){this._.canvas.width=this._.canvas.width;resetCantoState(this);}
function toDataURL(){return this._.canvas.toDataURL.apply(this._.canvas,arguments);}
function Canto(canvas){if(!canvas.getContext)
throw new Error("canto() requires a canvas element or id");this._=canvas.getContext("2d");resetCantoState(this);}
Canto.prototype={constructor:canto,beginPath:beginPath,endPath:beginPath,closePath:z,moveTo:M,rmoveTo:m,lineTo:L,rlineTo:l,quadraticCurveTo:Q,rquadraticCurveTo:q,bezierCurveTo:C,rbezierCurveTo:c,arcTo:arcTo,arc:arc,ellipse:ellipse,rect:rect,polygon:polygon,svgpath:svgpath,M:M,m:m,L:L,l:l,H:H,h:h,V:V,v:v,C:C,c:c,S:S,s:s,Q:Q,q:q,T:T,t:t,A:A,a:a,Z:z,z:z,penUp:pu,pu:pu,penDown:pd,pd:pd,forward:fd,fd:fd,back:bk,bk:bk,right:rt,rt:rt,left:lt,lt:lt,save:save,restore:restore,revert:revert,set:set,stroke:stroke,fill:fill,paint:paint,clip:wrapAndReturn("clip"),clearRect:wrapAndReturn("clearRect"),fillRect:fillRect,strokeRect:strokeRect,paintRect:paintRect,translate:translate,scale:scale,rotate:rotate,transform:transform,setTransform:setTransform,createPattern:createPattern,createLinearGradient:createLinearGradient,createRadialGradient:createRadialGradient,measureText:wrap("measureText"),textWidth:textWidth,fillText:fillText,strokeText:strokeText,drawImage:drawImage,createImageData:wrap("createImageData"),getImageData:wrap("getImageData"),putImageData:wrapAndReturn("putImageData"),reset:reset,toDataURL:toDataURL,isPointInPath:wrap("isPointInPath"),drawFocusRing:wrap("drawFocusRing"),get canvas(){return this._.canvas;},get width(){return this._.canvas.width;},set width(x){this._.canvas.width=x;},get height(){return this._.canvas.height;},set height(x){this._.canvas.height=x;},get angleUnit(){if(this._useDegrees)return"degrees";else return"radians"},set angleUnit(x){if(x==="radians")this._useDegrees=false;else if(x==="degrees")this._useDegrees=true;else throw new Error("Unsupported angle unit: "+ x);},get fillStyle(){return this._.fillStyle;},set fillStyle(x){this._.fillStyle=x;},get font(){return this._.font;},set font(x){this._.font=x;},get globalAlpha(){return this._.globalAlpha;},set globalAlpha(x){this._.globalAlpha=x;},get globalCompositeOperation(){return this._.globalCompositeOperation;},set globalCompositeOperation(x){this._.globalCompositeOperation=x;},get lineCap(){return this._.lineCap;},set lineCap(x){this._.lineCap=x;},get lineJoin(){return this._.lineJoin;},set lineJoin(x){this._.lineJoin=x;},get lineWidth(){return this._.lineWidth;},set lineWidth(x){this._.lineWidth=x;},get miterLimit(){return this._.miterLimit;},set miterLimit(x){this._.miterLimit=x;},get shadowBlur(){return this._.shadowBlur;},set shadowBlur(x){this._.shadowBlur=x;},get shadowColor(){return this._.shadowColor;},set shadowColor(x){this._.shadowColor=x;},get shadowOffsetX(){return this._.shadowOffsetX;},set shadowOffsetX(x){this._.shadowOffsetX=x;},get shadowOffsetY(){return this._.shadowOffsetY;},set shadowOffsetY(x){this._.shadowOffsetY=x;},get strokeStyle(){return this._.strokeStyle;},set strokeStyle(x){this._.strokeStyle=x;},get textAlign(){return this._.textAlign;},set textAlign(x){this._.textAlign=x;},get textBaseline(){return this._.textBaseline;},set textBaseline(x){this._.textBaseline=x;}};return function canto(canvas){if(typeof canvas==="string")
canvas=document.getElementById(canvas);if(!canvas._$canto)
canvas._$canto=new Canto(canvas);return canvas._$canto;};}());
