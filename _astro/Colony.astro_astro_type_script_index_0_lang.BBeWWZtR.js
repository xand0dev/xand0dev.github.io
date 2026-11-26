import{Dn as e,Hn as t,Mt as n,Tn as r,Un as i,Z as a,_ as o,_r as s,a as c,d as l,gr as u,i as d,n as f,o as p,r as ee,sr as m,t as te,v as h,vt as ne}from"./UnrealBloomPass.Oq-3ypAs.js";var g={name:`OutputShader`,uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`},re=class extends c{constructor(){super(),this.isOutputPass=!0,this.uniforms=m.clone(g.uniforms),this.material=new r({name:g.name,uniforms:this.uniforms,vertexShader:g.vertexShader,fragmentShader:g.fragmentShader}),this._fsQuad=new d(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},h.getTransfer(this._outputColorSpace)===`srgb`&&(this.material.defines.SRGB_TRANSFER=``),this._toneMapping===1?this.material.defines.LINEAR_TONE_MAPPING=``:this._toneMapping===2?this.material.defines.REINHARD_TONE_MAPPING=``:this._toneMapping===3?this.material.defines.CINEON_TONE_MAPPING=``:this._toneMapping===4?this.material.defines.ACES_FILMIC_TONE_MAPPING=``:this._toneMapping===6?this.material.defines.AGX_TONE_MAPPING=``:this._toneMapping===7?this.material.defines.NEUTRAL_TONE_MAPPING=``:this._toneMapping===5&&(this.material.defines.CUSTOM_TONE_MAPPING=``),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},_=new o(2,.09,.07),ie=new o(.28,.015,.015);function ae(e){return()=>(e=e*1664525+1013904223>>>0)/4294967296}var oe=`

  varying vec3 vColor; varying vec3 vN; varying vec2 vUv; varying vec3 vW; varying vec3 vLocal;
  void main() {
    vColor = instanceColor; vUv = uv; vLocal = position;
    vec4 w = modelMatrix * instanceMatrix * vec4(position, 1.0);
    vW = w.xyz;
    vN = normalize(mat3(modelMatrix * instanceMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * w;
  }`,se=`
  uniform vec3 uEdge; uniform float uRadius; uniform vec3 uFocus; uniform float uFocusR;
  varying vec3 vColor; varying vec3 vN; varying vec2 vUv; varying vec3 vW; varying vec3 vLocal;
  void main() {
    float hot = step(1.2, max(vColor.r, max(vColor.g, vColor.b)));
    vec3 n = normalize(vN);
    float key = max(dot(n, normalize(vec3(-0.5, 1.0, 0.35))), 0.0);
    float fill = max(dot(n, normalize(vec3(0.7, 0.2, -0.6))), 0.0);
    vec3 lit = vColor * (0.22 + 0.7 * key + 0.18 * fill);
    // lit voxel edges
    float e = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
    float edge = 1.0 - smoothstep(0.015, 0.05, e);
    float lum = dot(vColor, vec3(0.33));
    float edgeK = mix(0.25, 1.0, smoothstep(0.04, 0.12, lum));
    vec3 col = mix(lit, mix(uEdge, vColor * 1.4, hot), edge * edgeK * (0.5 + 0.5 * key));
    col = mix(col, vColor, hot * 0.75);
    // red spill from the focused building onto the ground around it
    float fd = length(vW.xz - uFocus.xz);
    col += vec3(0.5, 0.03, 0.03) * (1.0 - smoothstep(0.0, uFocusR, fd)) * (1.0 - hot) * step(0.5, uFocusR);
    // fade the map edge into the void
    float r = length(vW.xz);
    col *= 1.0 - smoothstep(uRadius * 0.55, uRadius, r);
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }`;function v(r,c,d,m){let h=matchMedia(`(prefers-reduced-motion: reduce)`).matches,g=innerWidth<760,v=new p({canvas:r,antialias:!0,powerPreference:`high-performance`});v.setClearColor(0,1);let y=new t,b=new n(-1,1,1,-1,-200,400),x=new s(1,.82,1).normalize(),S=new i({vertexShader:oe,fragmentShader:se,uniforms:{uEdge:{value:new o(4869717)},uRadius:{value:21.25},uFocus:{value:new s},uFocusR:{value:0}}}),C=new l(1,1,1);C.translate(0,.5,0);let w=ae(404),T=new Set;c.forEach(e=>{for(let t=0;t<e.w;t++)for(let n=0;n<e.d;n++)T.add(`${e.x+t},${e.z+n}`)});let E=[];for(let e=-17;e<=17;e++)for(let t=-17;t<=17;t++)Math.hypot(e,t)>20.4||E.push({x:e,z:t,h:.18+w()*.14+(w()<.04&&!T.has(`${e},${t}`)?.5+w()*.6:0)});let D=new a(C,S,E.length),O=new ne,k=new o;E.forEach((e,t)=>{O.makeScale(.96,e.h,.96).setPosition(e.x,-.3,e.z),D.setMatrixAt(t,O);let n=.018+w()*.016;D.setColorAt(t,k.setRGB(n,n,n*1.08))}),y.add(D);let A=[],j=[];c.forEach((e,t)=>{let n=ae(t*97+11),r=0;for(let i=0;i<e.w;i++)for(let a=0;a<e.d;a++){let o=(i+.5)/e.w-.5,s=(a+.5)/e.d-.5,c=1-Math.min(1,Math.hypot(o,s)*1.5),l=Math.max(1,Math.round(e.h*(.35+.65*c)*(.7+n()*.5)));r=Math.max(r,l);for(let r=0;r<l;r++)r>1&&n()<.06||A.push({site:t,x:e.x+i,y:r,z:e.z+a})}j.push(new s(e.x+e.w/2-.5,r,e.z+e.d/2-.5))});let M=new a(C,S,A.length),N=A.map(e=>{let t=.07+e.y/10*.03+(e.x*7+e.z*13+e.y*3)%5*.005;return new o(t,t,t*1.06)}),P=N.map(e=>e.clone()),F=A.map(e=>6+e.y*.6+w()*4),ce=performance.now();function le(e){A.forEach((t,n)=>{let r=1-(1-(h?1:Math.min(1,Math.max(0,(e-ce-(t.site*120+t.y*60))/700))))**3;O.makeScale(.94,.94,.94).setPosition(t.x,t.y+(1-r)*F[n],t.z),M.setMatrixAt(n,O)}),M.instanceMatrix.needsUpdate=!0}A.forEach((e,t)=>M.setColorAt(t,N[t])),y.add(M);let I=g?14:26,L=new a(new l(.3,.3,.3),S,I),R=c.map(e=>new s(e.x-1,.15,e.z+Math.floor(e.d/2))),ue=Array.from({length:I},(e,t)=>({p:R[t%R.length].clone().clone(),path:[],speed:2.2+w()*1.6,wait:w()*2}));for(let e=0;e<I;e++)L.setColorAt(e,_);y.add(L);let z={slug:null,zoom:g?17:12.5,side:g?0:.5,lift:g?.45:0},B=()=>c.findIndex(e=>e.slug===z.slug);function de(e,t){return[new s(t.x,.15,e.z+(w()-.5)*.001),t.clone()]}function fe(){let e=B();if(e>=0&&w()<.75){let t=c[e],n=Math.floor(w()*4),r=w(),i=n<2?t.x-1+(n?t.w+1:0):t.x+Math.floor(r*t.w),a=n>=2?t.z-1+(n===3?t.d+1:0):t.z+Math.floor(r*t.d);return new s(i,.15,a)}return R[Math.floor(w()*R.length)].clone()}let V=new ee(v);V.addPass(new f(y,b));let pe=new te(new u(256,256),.9,.55,.9);V.addPass(pe),V.addPass(new re);let me=c.map(e=>{let t=document.createElement(`button`);return t.type=`button`,t.className=`c-label`+(e.minor?` minor`:``),t.textContent=e.name,t.addEventListener(`click`,()=>m(e.slug)),d.appendChild(t),t}),H=0,U=0,W={target:new s(0,0,0),zoom:z.zoom,side:0,lift:0};function G(){H=r.clientWidth,U=r.clientHeight;let e=Math.min(g?1.5:2,devicePixelRatio||1);v.setPixelRatio(e),v.setSize(H,U,!1),V.setPixelRatio(e),V.setSize(H,U)}G(),new ResizeObserver(G).observe(r);let K=new e,q=new u(9,9),J=-1;r.addEventListener(`pointermove`,e=>{let t=r.getBoundingClientRect();q.set((e.clientX-t.left)/t.width*2-1,-((e.clientY-t.top)/t.height)*2+1)}),r.addEventListener(`pointerleave`,()=>q.set(9,9)),r.addEventListener(`click`,()=>{J>=0&&m(c[J].slug)});let Y=new s,he=new o,X=performance.now(),Z=!0,Q=0;function $(e){let t=Math.min(.05,(e-X)/1e3);X=e,le(e);let n=B(),i=n>=0?j[n].clone().setY(j[n].y*.45):new s(0,0,0),a=h?1:1-.0015**t;W.target.lerp(i,a),W.zoom+=(z.zoom-W.zoom)*a,W.side+=(z.side-W.side)*a,W.lift+=(z.lift-W.lift)*a;let o=H/U,l=W.side*W.zoom*o*.45,u=W.lift*W.zoom*.5;b.left=-W.zoom*o-l,b.right=W.zoom*o-l,b.top=W.zoom-u,b.bottom=-W.zoom-u;let d=h?0:Math.sin(e/7e3)*.06;b.position.copy(W.target).addScaledVector(x.clone().applyAxisAngle(new s(0,1,0),d),60),b.lookAt(W.target),b.updateProjectionMatrix(),K.setFromCamera(q,b);let f=q.x<5?K.intersectObject(M)[0]:void 0;J=f?.instanceId===void 0?-1:A[f.instanceId].site,r.style.cursor=J>=0?`pointer`:``;let p=.8+.2*Math.sin(e/500);A.forEach((e,t)=>{let r=c[e.site],i=e.site===n,a=N[t];if(i){let t=e.y/Math.max(1,r.h);a=he.copy(ie).lerp(_,Math.min(1,t*1.4+.15)).multiplyScalar(p)}else e.site===J&&(a=he.setRGB(.2,.2,.22));P[t].lerp(a,h?1:.12),M.setColorAt(t,P[t])}),M.instanceColor.needsUpdate=!0,S.uniforms.uFocus.value.copy(n>=0?j[n]:Y.set(0,0,0)),S.uniforms.uFocusR.value+=((n>=0?5:0)-S.uniforms.uFocusR.value)*.08,ue.forEach((n,r)=>{if(n.wait>0)n.wait-=t;else{n.path.length||(n.path=de(n.p,fe()),n.wait=.2+w()*1.2);let e=n.path[0],r=Y.copy(e).sub(n.p),i=n.speed*t;r.length()<=i?(n.p.copy(e),n.path.shift()):n.p.addScaledVector(r.normalize(),i)}let i=h?0:Math.abs(Math.sin(e/160+r))*.12;O.makeRotationY(e/900+r).setPosition(n.p.x,n.p.y+i,n.p.z),L.setMatrixAt(r,O)}),L.instanceMatrix.needsUpdate=!0,c.forEach((e,t)=>{Y.copy(j[t]).setY(j[t].y+1.4).project(b);let r=(Y.x*.5+.5)*H,i=(-Y.y*.5+.5)*U,a=me[t],o=Y.z<1&&r>-100&&r<H+100&&i>-40&&i<U+40;a.style.transform=`translate(${r}px, ${i}px) translate(-50%, -100%)`,a.classList.toggle(`on`,t===n),a.classList.toggle(`hover`,t===J),a.style.opacity=o?n>=0&&t!==n&&!e.minor?`0.35`:e.minor&&n>=0?`0`:`1`:`0`}),V.render(),Z&&(Q=requestAnimationFrame($))}return Q=requestAnimationFrame($),new IntersectionObserver(([e])=>{e.isIntersecting&&!Z?(Z=!0,X=performance.now(),Q=requestAnimationFrame($)):e.isIntersecting||(Z=!1,cancelAnimationFrame(Q))}).observe(r),{setFocus(e,t={}){z={slug:e,zoom:t.zoom??(e?g?9:8:g?15:13.5),side:t.side??0,lift:t.lift??0}}}}var y=document.getElementById(`colony-canvas`),b=document.getElementById(`hud-where`),x=()=>innerWidth<900,S=null;try{S=v(y,window.__colonySites,document.getElementById(`colony-labels`),e=>{let t=document.getElementById(`ch-`+e);t?(t.querySelector(`.panel`)??t).scrollIntoView({behavior:`smooth`,block:`center`}):document.querySelector(`.out`)?.scrollIntoView({behavior:`smooth`,block:`start`})})}catch{y.remove()}var C=document.getElementById(`colony-veil`),w=()=>{C.style.opacity=String(Math.max(0,1-scrollY/(innerHeight*.8)))};addEventListener(`scroll`,w,{passive:!0}),w();var T=[...document.querySelectorAll(`.chap .panel, .out .panel`)],E=matchMedia(`(prefers-reduced-motion: reduce)`).matches,D=scrollY,O=!1,k=0,A=()=>{if(O){O=!1,D=scrollY;return}let e=Math.sign(scrollY-D);if(D=scrollY,x()||E||!e)return;let t=innerHeight,n=T.map(e=>e.getBoundingClientRect()),r=n.filter(e=>e.bottom>60&&e.top<t);if(!r.length){e<0&&scrollY<t&&(O=!0,scrollTo({top:0,behavior:`smooth`}));return}if(r.length===1&&r[0].top>=60&&r[0].bottom<=t)return;let i=e>0?n.findIndex(e=>e.top>61):n.map(e=>e.top<59).lastIndexOf(!0);if(i<0)return;let a=n[i];if(e>0&&a.top>t*1.15||e<0&&a.bottom<-t*.15)return;let o=scrollY+a.top-Math.max(70,(t-a.height)/2+20);Math.abs(o-scrollY)<4||(O=!0,scrollTo({top:o,behavior:`smooth`}))};addEventListener(`scroll`,()=>{clearTimeout(k),k=window.setTimeout(A,160)},{passive:!0});var j=document.getElementById(`media-zoom`),M=j.querySelector(`.mz-body`),N=null;document.querySelectorAll(`.chap .media`).forEach(e=>{let t=e.querySelector(`img, video`);t&&e.addEventListener(`click`,()=>{M.replaceChildren();let e=t.cloneNode(!0);e.removeAttribute(`style`),e instanceof HTMLVideoElement?(e.preload=`auto`,e.controls=!0,e.muted=!0,e.loop=!0,e.currentTime=t.currentTime||0,e.play().catch(()=>{}),N=t,N.pause()):e.loading=`eager`,M.append(e),j.querySelector(`.mz-cap`).textContent=t.getAttribute(`alt`)??t.getAttribute(`aria-label`)??``,j.showModal()})});var P=()=>j.close();j.querySelector(`.mz-x`).addEventListener(`click`,P),j.addEventListener(`click`,e=>{(e.target===j||e.target===M)&&P()}),j.addEventListener(`close`,()=>{M.replaceChildren(),N?.play().catch(()=>{}),N=null});var F=[...document.querySelectorAll(`[data-focus]`)];function ce(e){let t=e.dataset.focus||null,n=x()?0:Number(e.dataset.side||0),r=x()&&t?.55:0;e.dataset.zoom===`out`?S?.setFocus(null,{zoom:x()?17:15,side:0}):t?S?.setFocus(t,{side:n,lift:r}):S?.setFocus(null,{zoom:x()?17:12.5,side:x()?0:.5,lift:x()?.45:0}),b.textContent=t?`colony / ${e.querySelector(`h2`)?.textContent?.toLowerCase()}`:e.dataset.zoom?`colony / outskirts`:`colony / overview`,document.querySelectorAll(`.chap video`).forEach(t=>{e.contains(t)?(t.preload===`none`&&(t.preload=`auto`),t.play().catch(()=>{})):t.pause()});let i=F[F.indexOf(e)+1]?.querySelector(`video`);i&&i.preload===`none`&&(i.preload=`auto`,i.load())}var le=new IntersectionObserver(e=>{e.filter(e=>e.isIntersecting).forEach(e=>ce(e.target))},{rootMargin:`-45% 0px -45% 0px`});F.forEach(e=>le.observe(e));