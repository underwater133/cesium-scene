import{u as v}from"./chunks/useCesium.BCs2SxZ6.js";import{a as w,P as M,g as m,h as f,i as p,G as u,j as d,k as x,l as L,m as z,c as _}from"./chunks/Viewer.BOTzFsmJ.js";import{v as F,x as C,c as g,o as y,G as E}from"./chunks/framework.CeAxlD3m.js";const D=(i,e,t,a)=>{const o=(a-e)*Math.PI/180,s=(t-i)*Math.PI/180,r=Math.sin(o/2)*Math.sin(o/2)+Math.cos(e*Math.PI/180)*Math.cos(a*Math.PI/180)*Math.sin(s/2)*Math.sin(s/2);return 6371e3*(2*Math.atan2(Math.sqrt(r),Math.sqrt(1-r)))},I=i=>i*.3,S=(i,e)=>{let t=[];for(let a=0;a<e;a++){let n=R(i,a/(e-1));t.push([n.x,n.y])}return t},O=(i,e,t)=>{let a=[{x:i[0],y:i[1]},{x:e[0],y:e[1]},{x:t[0],y:t[1]}];return S(a,100)},R=(i,e)=>{let t=i.length,a=0,n=0,o=function(s,r){let c=1,l=1;for(;r>0;)c*=s,l*=r,s--,r--;return c/l};for(let s=0;s<t;s++){let r=i[s];a+=r.x*Math.pow(1-e,t-1-s)*Math.pow(e,s)*o(t-1,s),n+=r.y*Math.pow(1-e,t-1-s)*Math.pow(e,s)*o(t-1,s)}return{x:a,y:n}},A=(i,e,t,a,n)=>{let o=[i,0],s=[(t+i)/2,n],c=O(o,s,[t,0]),l=[];for(let h=0;h<c.length;h++){let P=(a-e)*(c[h][0]-i)/(t-i)+e;l.push([c[h][0],P,c[h][1]])}return l},T=(i,e,t,a,n)=>{let o=A(i,e,t,a,n),s=[];for(let r of o)s.push(r[0]),s.push(r[1]),s.push(r[2]);return w.fromDegreesArrayHeights(s)},B=(i,e,t)=>{let a=t;if(a===void 0){const o=D(i[0],i[1],e[0],e[1]);a=I(o),console.log("finalHeight",o,a)}return T(i[0],i[1],e[0],e[1],a)};let b=`float SPEED_STEP = 0.01; 
vec4 drawLight(float xPos, vec2 st, float headOffset, float tailOffset, float widthOffset){ 
float lineLength = smoothstep(xPos + headOffset, xPos, st.x) - smoothstep(xPos, xPos - tailOffset, st.x); 
float lineWidth = smoothstep(widthOffset, 0.5, st.y) - smoothstep(0.5, 1.0 - widthOffset, st.y); 
return vec4(lineLength * lineWidth); 
}
czm_material czm_getMaterial(czm_materialInput materialInput) 
{ 
czm_material m = czm_getDefaultMaterial(materialInput);
float sinTime = sin(czm_frameNumber * SPEED_STEP * speed); 
vec4 v4_core;
vec4 v4_color;
float xPos = 0.0; 
if (sinTime < 0.0){ 
xPos = cos(czm_frameNumber * SPEED_STEP * speed)+ 1.0 - tailsize; 
}else{ 
xPos = -cos(czm_frameNumber * SPEED_STEP * speed)+ 1.0 - tailsize; 
} 
v4_color = drawLight(xPos, materialInput.st, headsize, tailsize, widthoffset);
v4_core = drawLight(xPos, materialInput.st, coresize, coresize*2.0, widthoffset*2.0);
m.diffuse = color.xyz + v4_core.xyz*v4_core.w*0.8; 
m.alpha = pow(v4_color.w, 3.0); 
return m; 
} 
`;class G{constructor(e){this.viewer=e,this.flyLines=new M,this.viewer.scene.primitives.add(this.flyLines)}addLine(e,t,a){const n=B(e,t);let o=[],s=n.length;for(let l=0;l<s;++l){let h=0;l<s/2?h=l/s*2*.6+.2:h=(s-l)/s*2*.6+.2,o.push(m.fromCssColorString(a).withAlpha(h))}this.flyLines.add(new f({geometryInstances:new u({geometry:new d({positions:n,width:2,vertexFormat:p.VERTEX_FORMAT,colors:o,colorsPerVertex:!0})}),appearance:new p}));let r=new x({fabric:{type:"FlyLineMaterial",uniforms:{color:m.fromCssColorString(a),speed:1.5,headsize:.05,tailsize:.5,widthoffset:.1,coresize:.05},source:b}}),c=new f({geometryInstances:new u({geometry:new d({positions:n,width:20,vertexFormat:z.ALL})}),appearance:new L({material:r})});this.flyLines.add(c)}clear(){this.flyLines.removeAll(),this.viewer.scene.primitives.remove(this.flyLines),console.log(this.flyLines,this.viewer.scene.primitives)}}const N={id:"cesiumContainer",style:{width:"100vw",height:"100vh"}},V={__name:"FlyLine",setup(i){let e=null,t=null;const a=[[[114.404,30.535],[112.404,22.535],"#FF0000"],[[110.978,28.343],[112.404,22.535],"#00FF00"],[[112.404,22.535],[115.926,23.191],"#0000FF"],[[112.404,22.535],[119.584,26.864],"#FF00FF"]];return F(()=>{e=v("cesiumContainer"),t=new G(e),a.forEach(n=>{t.addLine(n[0],n[1],n[2])}),e.camera.setView({destination:w.fromDegrees(108.404,19.535,7e5),orientation:{heading:_.toRadians(45),pitch:_.toRadians(-40),roll:0}})}),C(()=>{t==null||t.clear()}),(n,o)=>(y(),g("div",N))}},W=JSON.parse('{"title":"飞线效果","description":"","frontmatter":{"layout":false,"title":"飞线效果"},"headers":[],"relativePath":"scene/飞线效果.md","filePath":"scene/飞线效果.md"}'),j={name:"scene/飞线效果.md"},J=Object.assign(j,{setup(i){return(e,t)=>(y(),g("div",null,[E(V)]))}});export{W as __pageData,J as default};
