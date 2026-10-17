(function () {
  'use strict';
  const M = window.PiModels;
  const $ = id => document.getElementById(id);
  const chapters = ['到处都有圆', '一圈有多长', '让绳子帮忙', '三个多一点', '为什么量不准', '用直线接近圆', '办法在进步', '回到生活'];
  // Each entry is one teaching stop: question, completed observation, next action.
  const scenes = [
    [
      ['说起圆，你想起什么？', '车轮转着向前走。找一找，它身上的圆。', '把盘子放上桌'],
      ['盘子上，也藏着一个圆吗？', '盘子放平后，我们从正上方看看它的边。', '看看窗外'],
      ['天上，还有什么看起来是圆的？', '满月看起来像一个圆。你还在哪里见过圆？', '找出它们的圆边'],
      ['这些东西，有什么相同的地方？', '轮子、盘子、满月，都有圆形的轮廓。', '带走这只车轮']
    ],
    [
      ['这只轮子的一圈，到底有多长？', '我们要量的是轮子外边完整的一圈。', '拿直尺量量宽度'],
      ['穿过中心的这段，容易量吗？', '直尺两端对着圆边，中间穿过圆心。', '把直尺贴到圆边'],
      ['直尺是直的，圆边却是弯的，怎么办？', '直尺只能贴住一小段，不能弯着绕一圈。', '先沿着圆边走一圈']
    ],
    [
      ['我们要量的，是哪一段？', '从这里出发，沿着外边走，回到这里：这才是一整圈。', '用绳子绕一圈'],
      ['能让绳子贴着圆边走吗？', '固定一头，把另一头贴着轮边慢慢绕回来。', '在相遇处做记号'],
      ['为什么要在这里做记号？', '记住起点和相遇处，我们只量这两个记号之间的绳子。', '把这一段慢慢展开'],
      ['绳子拉直后，长度变了吗？', '弯的变直了，两头的记号还在，绳子没有变长。', '取一根和轮子一样宽的小棒'],
      ['这根小棒，量的是哪里？', '小棒穿过圆心，刚好抵住两边。这段长度叫直径。', '摆上第一根小棒']
    ],
    [
      ['摆一根，够了吗？', '一根小棒，就是一段直径。', '再摆一根'],
      ['摆两根，够了吗？', '两根首尾相接，绳子还长出一截。', '摆上第三根'],
      ['已经摆了三根，够了吗？', '先别急着数小数。看看右边，还剩下什么？', '看看剩下的一小段'],
      ['一圈，原来是三个多一点？', '三段直径，还差一点，才能和一圈一样长。', '换一个小圆试试'],
      ['圆变小了，这个关系会变吗？', '大小不同的圆，都能看到三段直径，再多出一点。', '给这个关系起个名字'],
      ['怎样说清“一圈有几个直径长”？', '用一圈的长度除以直径，得到的数叫圆周率，写作 π。', '再量一次，看看困难']
    ],
    [
      ['绳子没有贴紧，会怎样？', '松出来的部分也算进去了，这次量出的绳子更长。', '放大看看记号'],
      ['记号这么粗，应该读哪一边？', '记号有宽度，选左边或右边，读数就可能不一样。', '再看看尺子的刻度'],
      ['两次读数不同，是圆变了吗？', '同一个圆，工具和操作会带来差别。测量只能给出近似值。', '试试用直线来算']
    ],
    [
      ['两点之间，走直线还是沿弯边更短？', '把圆里面的直边连起来，得到一条比圆周短的路。', '在外面也围一条路'],
      ['圆的一圈，被夹在哪里？', '里面的路短一点，外面的路长一点，圆周长在两者之间。', '把每一段分得更细'],
      ['边变多了，空隙有什么变化？', '两条路都更贴近圆了，夹住的范围也变小了。', '再分细一次'],
      ['不用绳子，能不能继续接近答案？', '阿基米德用内外多边形夹住圆周长。后来人们继续改进计算。', '继续增加边数'],
      ['一直增加边数，计算会怎样？', '边越来越多，要做的计算也越来越多。祖冲之把圆周率算得更精确。', '看看有没有别的办法']
    ],
    [
      ['除了画更多边，还能换个办法吗？', '人们发现了有规律的算式。可以照着规则，一步一步算。', '照规则算一步'],
      ['每次都按同一个规则，接着算呢？', '这里演示沃利斯的方法：接着乘下一项，就得到新的近似值。', '看看后来的新方法'],
      ['能不能让每次计算更有效？', '微积分带来了新的计算方法。这里用一个后来的例子，观察修正过程。', '算出第一个近似值'],
      ['先算出一个数，再怎样改进？', '这是第一轮的结果。下一轮会按规则加上一个修正量。', '再修正一次'],
      ['这一次，数字怎样变化了？', '按同一规则继续修正，可以得到更准确的近似值。', '让计算机接着做'],
      ['重复的计算，能交给谁？', '计算机按规则完成后面几轮。它跑得快，但仍然需要人找到方法。', '带着这些办法回到生活']
    ],
    [
      ['轮子转一圈，向前走了多远？', '没有打滑时，轮子转一圈，前进的距离就是它的一圈长。', '看看钟表里的圆'],
      ['钟表里，也有转动的圆吗？', '指针转动，齿轮配合，设计机械时会遇到圆的计算。', '再把目光移向天空'],
      ['把目光放远，哪里还会用到它？', '天体运动和导航也用到与圆有关的数学。这里是应用场景示意。', '回到车轮，量一次路程'],
      ['每圈只差一点，真的没关系吗？', '直径 1 米，转 1 圈：用 3.14 计算，路程少算了一点。', '让它连续转十圈'],
      ['转了很多圈，小差距会怎样？', '每圈少算的距离累积起来了。需要多准确，要看用它做什么。', '把 3.14 换成 3.1416'],
      ['换一个更准确的数，结果怎样？', '同样转十圈，计算的位置更接近实际位置。更合适的工具，帮助我们把事情做好。', '回到故事开头']
    ]
  ];
  const offsets = scenes.map((_, c) => scenes.slice(0, c).reduce((n, s) => n + s.length, 0));
  const stops = scenes.flatMap((list, c) => list.map((content, s) => ({ c, s, content })));
  let index = 0, animation = 0, busy = false;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const mix = (a,b,t) => a + (b-a)*t;
  const ease = t => t*t*(3-2*t);
  const attr = (id, name, value) => $(id).setAttribute(name, value);
  const show = (id, visible) => { const el=$(id);el.setAttribute('aria-hidden',String(!visible));if (visible) el.removeAttribute('hidden'); else el.setAttribute('hidden',''); };
  const text = (id, value) => { $(id).textContent = value; };
  const line = (x1,y1,x2,y2,cls='context') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}"/>`;
  function wheel(id, radius=108) {
    return `<g id="${id}"><circle r="${radius}" fill="#e5ebe7" stroke="#172126" stroke-width="4"/><circle r="${radius-9}" fill="#f1f4f2" stroke="#a1b2a7" stroke-width="2"/><g id="${id}-spokes">${Array.from({length:12},(_,i)=>{const a=i*Math.PI/6;return line(0,0,Math.cos(a)*(radius-11),Math.sin(a)*(radius-11),'context');}).join('')}<circle cx="0" cy="${radius}" r="5" fill="#b34620"/></g><circle r="7" fill="#172126"/></g>`;
  }
  function rod(id) { return `<g id="${id}"><line x1="0" y1="0" x2="216" y2="0" class="rod"/><line x1="1" y1="-9" x2="1" y2="9" class="blue"/><line x1="215" y1="-9" x2="215" y2="9" class="blue"/></g>`; }
  function label(id,x,y,cls='label',anchor='middle') { return `<text id="${id}" x="${x}" y="${y}" class="${cls}" text-anchor="${anchor}"></text>`; }
  $('life-art').innerHTML = `
    <path d="M60 368H1060 M625 324H1005 M650 325V366 M980 325V366" class="context"/>
    <g id="bike" role="button" tabindex="0" aria-label="找自行车上的圆"><g transform="translate(0 300)">${wheel('bike-rear',64)}</g><g transform="translate(230 300)">${wheel('bike-front',64)}</g><path d="M0 300L76 205L133 300H0L59 226H183L133 300 M183 226L230 300 M173 190L192 190L183 226 M55 205H90" class="blue"/><path d="M73 205L64 185H96 M172 190L169 173H201" class="outline"/><circle cx="133" cy="300" r="12" fill="#f1f4f2" stroke="#172126" stroke-width="3"/><path d="M133 300L150 313H166" class="outline"/><circle cx="230" cy="300" r="72" class="touch-ring"/></g>
    <g id="plate" role="button" tabindex="0" aria-label="找盘子上的圆"><circle cx="805" cy="247" r="71" fill="#fafbf8" stroke="#52645e" stroke-width="3"/><circle cx="805" cy="247" r="56" fill="#e0e8f9" stroke="#254dc2" stroke-width="2"/><path d="M776 216Q789 204 803 204" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="805" cy="247" r="79" class="touch-ring"/></g>
    <g id="moon" role="button" tabindex="0" aria-label="找满月的圆形轮廓"><path d="M700 35H1040V161H700Z M870 35V161" class="context"/><circle cx="952" cy="96" r="43" fill="#e9dfbe" stroke="#9c906b" stroke-width="2"/><circle cx="940" cy="83" r="10" fill="#ded2ac"/><circle cx="965" cy="111" r="7" fill="#ded2ac"/><circle cx="952" cy="96" r="50" class="touch-ring"/></g>
    <g id="round-outlines"><circle id="bike-round" cx="590" cy="300" r="64" class="orange"/><circle cx="805" cy="247" r="71" class="orange"/><circle cx="952" cy="96" r="43" class="orange"/></g>
    ${label('life-label',365,421,'label')}
    <text x="805" y="400" text-anchor="middle" class="small">点点物件，找找圆</text>`;
  $('measure-art').innerHTML = `
    <path d="M100 414H1030 M100 425H1030" class="context"/>
    <g id="measuring-wheel-position">${wheel('measuring-wheel')}</g>
    <g id="ruler-tool"><rect x="0" y="-17" width="216" height="34" rx="3" fill="#e1d4ae" stroke="#8e7946" stroke-width="2"/>${Array.from({length:21},(_,i)=>line(i*10.8,-16,i*10.8,i%5===0?1:-6,'outline')).join('')}</g>
    <path id="trace" class="orange" stroke-dasharray="2 11"/>
    <path id="rope" class="rope"/>
    <circle id="moving-tip" r="10" class="knob"/>
    <g id="marks"><path id="start-mark" d="M253 303L267 327 M253 327L267 303" class="outline"/><g id="end-mark"><circle r="10" fill="#f1f4f2" stroke="#b34620" stroke-width="3"/><circle r="3" fill="#b34620"/></g></g>
    ${rod('diameter-rod')}${rod('rod-1')}${rod('rod-2')}${rod('rod-3')}
    ${label('rod-word',260,68,'label blue-text')}
    ${label('count-1',368,400,'label blue-text')}${label('count-2',584,400,'label blue-text')}${label('count-3',800,400,'label blue-text')}
    <g id="remaining"><path d="M908 347V339H938.584V347" class="orange"/><path d="M929 325L979 261" class="leader"/><text x="978" y="245" class="label orange-text" text-anchor="middle">还多一点</text></g>
    ${label('rope-word',632,291,'label orange-text')}
    <g id="small-example"><circle cx="681" cy="127" r="44" class="outline"/><path d="M637 127H725" class="blue"/><path d="M600 214H876.46" class="orange"/>${[0,1,2].map(i=>`${line(600+i*88,240,688+i*88,240,'blue')}${line(600+i*88,233,600+i*88,247,'blue')}<text x="${644+i*88}" y="269" text-anchor="middle" class="small blue-text">${i+1}</text>`).join('')}${line(864,233,864,247,'blue')}<path d="M864 208V201H876.46V208" class="orange"/><text x="856" y="144" class="small" text-anchor="middle">小圆也试试</text></g>
    <g id="ratio"><text x="690" y="91" class="number" text-anchor="middle">一圈的长度 ÷ 直径</text><text x="690" y="143" class="label" text-anchor="middle">这个固定的数，叫圆周率 π</text><text x="690" y="186" class="small" text-anchor="middle">测几个圆能发现线索，还不能代替证明。</text></g>
    <g id="error-art"><circle cx="851" cy="191" r="104" fill="#fafbf8" stroke="#a1b2a7" stroke-width="2"/><g clip-path="url(#zoom-clip)" id="error-lens"></g>${label('error-label',851,330,'label')}${label('error-reading',560,386,'label')}
    <path d="M365 222L729 191" class="leader"/></g>`;
  $('geometry-art').innerHTML = `
    <rect x="138" y="33" width="427" height="393" rx="4" fill="#fafbf8"/>
    <circle cx="350" cy="219" r="150" class="outline"/>
    <polygon id="inner-polygon" fill="#e0e8f9" fill-opacity=".4" stroke="#254dc2" stroke-width="4"/>
    <polygon id="outer-polygon" fill="none" stroke="#b34620" stroke-width="4"/>
    <path id="arc-focus" class="orange"/>
    ${label('geometry-inside',850,80,'label blue-text')}${label('geometry-outside',850,117,'label orange-text')}${label('geometry-count',350,417,'number')}${label('geometry-note',850,419,'small')}
    <g id="geometry-zoom"><defs><clipPath id="geometry-zoom-clip"><circle cx="850" cy="245" r="90"/></clipPath></defs><circle cx="850" cy="245" r="90" fill="#fafbf8" stroke="#a1b2a7" stroke-width="2"/><g clip-path="url(#geometry-zoom-clip)"><g id="geometry-lens"><circle id="lens-circle" cx="350" cy="219" r="150" fill="none" stroke="#172126"/><polygon id="lens-inner" fill="none" stroke="#254dc2"/><polygon id="lens-outer" fill="none" stroke="#b34620"/></g></g>${label('geometry-zoom-label',850,370,'small')}</g>`;
  $('methods-art').innerHTML = `
    <path d="M100 404H1030" class="context"/>
    <g id="scribe"><circle cx="179" cy="195" r="29" fill="#e9ded2" stroke="#52645e" stroke-width="2"/><path d="M150 190Q144 151 178 156Q213 157 207 185" fill="#52645e"/><path d="M146 226Q178 212 214 234L239 315H127Z" fill="#dce5df" stroke="#52645e" stroke-width="3"/><path d="M194 249L237 279L290 278" class="outline"/><g id="writing-hand"><path d="M279 278L300 268" class="outline"/><path d="M295 279L309 253" class="orange"/></g><path d="M156 315L145 396 M199 315L220 396" class="outline"/></g>
    <g id="notebook"><rect x="283" y="101" width="320" height="231" rx="3" class="paper"/><path d="M314 103V330" class="context"/><text x="442" y="146" text-anchor="middle" class="small">按规律，接着算</text><g id="calculation-lines"></g></g>
    <g id="method-result"><text x="815" y="126" class="small" text-anchor="middle" id="method-title"></text><text x="815" y="196" class="big-number" text-anchor="middle" id="method-number"></text><text x="815" y="245" class="small" text-anchor="middle" id="method-note"></text><path d="M668 285H965" class="context"/><text x="815" y="320" class="label" text-anchor="middle" id="method-change"></text></g>
    <g id="computer"><rect x="642" y="54" width="376" height="295" rx="12" fill="none" stroke="#52645e" stroke-width="4"/><path d="M794 350V379H729H929H864V350" class="outline"/><circle cx="830" cy="333" r="4" fill="#52645e"/></g>
    <text x="442" y="374" class="small" text-anchor="middle" id="method-source"></text>`;
  $('return-art').innerHTML = `
    <path id="road-base" d="M100 300H1020" class="context"/><g id="road-ticks">${Array.from({length:7},(_,i)=>`${line(130+i*120,300,130+i*120,315)}<text x="${130+i*120}" y="340" class="small" text-anchor="middle">${i*5} m</text>`).join('')}</g>
    <g id="rolling-wheel-position">${wheel('rolling-wheel',60)}</g>
    <path id="rolled-path" class="orange"/><g id="predicted"><path d="M0 303V365" class="blue"/><path d="M-7 360L0 368L7 360" class="blue"/></g>
    ${label('turn-counter',560,75,'label')}${label('distance-label',560,403,'label')}
    <g id="error-inset"><path d="M753 108H970 M753 128H970" class="context"/><path id="inset-actual" class="orange"/><path id="inset-predicted" class="blue"/><text x="996" y="114" class="small orange-text">实际</text><text x="996" y="140" class="small blue-text">算出</text><text x="861" y="173" class="small" text-anchor="middle">差距放大 ×200</text><text x="861" y="212" class="label orange-text" text-anchor="middle" id="rolling-error"></text></g>
    <g id="clock-art"><circle cx="341" cy="184" r="123" fill="#fafbf8" stroke="#52645e" stroke-width="4"/>${Array.from({length:12},(_,i)=>{const a=i*Math.PI/6;return line(341+Math.sin(a)*108,184-Math.cos(a)*108,341+Math.sin(a)*117,184-Math.cos(a)*117,'outline');}).join('')}<g id="clock-hands"><path d="M341 184V98 M341 184L392 217" class="blue"/></g><circle cx="341" cy="184" r="7" fill="#172126"/><g id="gears"></g><text x="772" y="311" text-anchor="middle" class="label">大轮转，小轮也跟着转</text></g>
    <g id="sky-art"><ellipse cx="340" cy="180" rx="182" ry="103" class="context"/><circle cx="340" cy="180" r="38" fill="#e9dfbe" stroke="#9c906b" stroke-width="2"/><circle id="planet" r="18" fill="#d8e4ef" stroke="#254dc2" stroke-width="3"/><rect x="719" y="83" width="184" height="219" rx="18" class="paper"/><path d="M742 119H883 M742 258H883 M778 108V272 M856 108V272 M747 235L808 174L868 209" class="context"/><path id="map-route" d="M747 235L808 174L868 209" class="blue"/><circle cx="868" cy="209" r="8" fill="#b34620"/><text x="340" y="359" text-anchor="middle" class="label">观察天空</text><text x="811" y="359" text-anchor="middle" class="label">寻找位置</text><text x="560" y="432" text-anchor="middle" class="small">应用场景示意，并非 GPS 计算模型</text></g>`;

  function renderLife(s,t) {
    const drive = s===0?t:1;
    attr('bike','transform',`translate(${mix(70,360,drive)} 0)`);
    ['bike-front-spokes','bike-rear-spokes'].forEach(id=>attr(id,'transform',`rotate(${drive*290/64*180/Math.PI})`));
    show('plate',s>=1);attr('plate','transform',`translate(0 ${s===1?mix(-90,0,t):0})`);
    show('moon',s>=2);attr('moon','opacity',s===2?t:1);
    show('round-outlines',s>=3);attr('round-outlines','stroke-dasharray',s===3?`${t*500} 500`:'none');
    text('life-label',s===0?'车轮一边转，一边走':'从生活里，认出圆');
  }
  function drawRope(progress, fraction=1, radius=108) {
    attr('rope','d',M.ropePath(radius,progress,fraction));
    const end=M.ropePoint(radius,progress,fraction);
    attr('moving-tip','cx',260+end.x);attr('moving-tip','cy',315+end.y);
    attr('end-mark','transform',`translate(${260+end.x} ${315+end.y})`);
  }
  function renderMeasure(c,s,t) {
    const normal = c!==4;
    attr('measuring-wheel-position','transform',c===1&&s===0?`translate(${mix(590,260,t)} ${mix(300,207,t)}) scale(${mix(64/108,1,t)})`:'translate(260 207)');
    show('ruler-tool',c===1&&s>=1);
    const tangent = c===1&&s===2?t:0;
    attr('ruler-tool','transform',`translate(${152} ${mix(207,92,tangent)})`);
    attr('ruler-tool','opacity',c===1&&s===1?t:1);
    show('trace',c===2&&s===0);attr('trace','d',M.ropePath(108,0,t));
    show('rope',(c===2&&s>=1)||c===3||c===4);
    let unfold=c===3?1:c===2&&s>=3?(s===3?t:1):0;
    drawRope(unfold,c===2&&s===1?t:1);
    show('moving-tip',c===2&&s<=1);
    if(c===2&&s===0){const p=M.ropePoint(108,0,t);attr('moving-tip','cx',260+p.x);attr('moving-tip','cy',315+p.y);}
    show('marks',(c===2&&s>=2)||c===3);
    attr('marks','opacity',c===2&&s===2?t:1);
    const rodVisible=(c===2&&s===4)||c===3;
    show('diameter-rod',rodVisible);attr('diameter-rod','transform','translate(152 207)');
    attr('diameter-rod','opacity',c===2&&s===4?t:1);
    show('rod-word',rodVisible);text('rod-word',c===2?'直径':'一根小棒 = 一段直径');
    for(let n=1;n<=3;n++){
      const visible=c===3&&s>=n-1;show(`rod-${n}`,visible);show(`count-${n}`,visible&&(s!==n-1||t===1));
      const p=c===3&&s===n-1?t:1;
      attr(`rod-${n}`,'transform',`translate(${mix(152,260+(n-1)*216,p)} ${mix(207,363,p)})`);
      text(`count-${n}`,`${n}`);
    }
    show('remaining',c===3&&s>=3);attr('remaining','opacity',c===3&&s===3?t:1);
    show('rope-word',(c===2&&s===3)||(c===3&&s<4));text('rope-word','绕一圈的绳子');
    show('small-example',c===3&&s===4);attr('small-example','transform',c===3&&s===4?`translate(${mix(60,0,t)} 0)`:'');
    show('ratio',c===3&&s===5);attr('ratio','opacity',t);
    show('error-art',!normal);
    if(c===4) renderError(s,t);
  }
  function renderError(s,t) {
    const lens=$('error-lens');
    if(s===0){
      const slack=4*t;drawRope(0,1,108+slack);attr('rope','transform',`translate(0 ${slack})`);
      lens.innerHTML=`<path d="M739 211Q851 70 963 211" class="outline"/><path d="M739 205Q851 ${mix(68,12,t)} 963 205" class="rope"/><path d="M851 109V143" stroke="#52645e" stroke-width="2" stroke-dasharray="4 3"/>`;
      text('error-label','绳子没有贴紧');text('error-reading',`直径 10 cm：贴紧约 ${(Math.PI*10).toFixed(1)} cm，松开约 ${(Math.PI*10*(108+slack)/108).toFixed(1)} cm`);
    } else {
      attr('rope','transform','');
      const ticks=Array.from({length:21},(_,i)=>line(756+i*10,230,756+i*10,i%5===0?198:214,'outline')).join('');
      lens.innerHTML=`<path d="M746 176H960" class="rope"/><rect x="840" y="154" width="${s===1?mix(2,22,t):22}" height="44" fill="#172126" opacity=".7"/><g transform="translate(0 ${s===2?mix(48,0,t):48})">${ticks}</g>${s===2&&t===1?'<path d="M840 198V252 M862 198V252" class="blue"/><text x="831" y="271" text-anchor="end" class="small">31.4</text><text x="869" y="271" class="small">31.5</text>':''}`;
      text('error-label',s===1?'放大看：记号也有宽度':'读数示意：厘米');text('error-reading',s===1?'量到记号的哪一边？':'31.4 ÷ 10 = 3.14　　31.5 ÷ 10 = 3.15');
    }
  }
  function polygonPoints(n,r,rotation=-Math.PI/2) {return Array.from({length:n},(_,i)=>{const a=rotation+i*2*Math.PI/n;return [350+r*Math.cos(a),219+r*Math.sin(a)];});}
  function renderGeometry(s,t) {
    const edges=[6,6,12,24,96][s], previous=s===4?24:s===3?12:6;
    const targetIn=polygonPoints(edges,150), targetOut=polygonPoints(edges,150/Math.cos(Math.PI/edges),-Math.PI/2+Math.PI/edges);
    // Introduce new vertices on the old straight segments, then move them onto the refined paths.
    function refine(points,oldN,outer){
      const old=polygonPoints(oldN,outer?150/Math.cos(Math.PI/oldN):150,outer?-Math.PI/2+Math.PI/oldN:-Math.PI/2);
      return points.map((p,i)=>{const f=i*oldN/edges, a=Math.floor(f),q=f-a;const start=[mix(old[a%oldN][0],old[(a+1)%oldN][0],q),mix(old[a%oldN][1],old[(a+1)%oldN][1],q)];return `${mix(start[0],p[0],t)},${mix(start[1],p[1],t)}`;}).join(' ');
    }
    attr('inner-polygon','points',s>=2?refine(targetIn,previous,false):targetIn.map(p=>p.join(',')).join(' '));
    attr('inner-polygon','stroke-dasharray',s===0?`${t*920} 1000`:'none');
    show('outer-polygon',s>=1);attr('outer-polygon','points',s>=2?M.refiningOuter(previous,edges,150,t).map(p=>`${350+p.x},${219+p.y}`).join(' '):targetOut.map(p=>p.join(',')).join(' '));attr('outer-polygon','opacity',s===1?t:1);
    show('arc-focus',s===0);attr('arc-focus','d','M350 69A150 150 0 0 1 479.904 144');
    text('geometry-inside','里面：用直线抄近路');text('geometry-outside',s>=1?'外面：绕着圆围一圈':'');
    text('geometry-count',`${edges} 条边`);text('geometry-note',s===0?'直线把弯路截短了一点。':s===4?'更多边，也意味着更多计算。':'边越多，两条路越贴近圆。');
    show('geometry-zoom',s>=1);
    const zoom=s>=4?60:6,angle=-Math.PI/2+Math.PI/edges;
    attr('geometry-lens','transform',`translate(850 245) scale(${zoom}) translate(${-350-150*Math.cos(angle)} ${-219-150*Math.sin(angle)})`);
    attr('lens-inner','points',$('inner-polygon').getAttribute('points'));attr('lens-outer','points',$('outer-polygon').getAttribute('points'));
    ['lens-inner','lens-outer','lens-circle'].forEach(id=>attr(id,'stroke-width',2/zoom));
    text('geometry-zoom-label',`同一处放大 ×${zoom} · 黑线是圆边`);
  }
  function renderMethods(s,t) {
    show('computer',s===5);attr('computer','opacity',s===5?Math.min(t*3,1):0);
    attr('writing-hand','transform',`translate(${s===1?Math.sin(t*Math.PI*4)*6:0} 0)`);
    let rows=[],value='',note='',change='',title='有规律的算式';
    if(s<=1){const terms=s===0||t<1?0:1;value=M.wallis(terms).toFixed(5);rows=['从 2 开始',...(s===1&&t>.35?['× 4/3']:[])];note=`已接着乘了 ${terms} 项`;change=terms?'这是近似值，还可以接着算':'下一项，是 4/3';}
    else {
      title='后来的一种计算方法';
      const round=s===2?0:s===3?1:s===4?2:Math.min(7,2+Math.floor(t*5));
      value=round?M.machin(round).toFixed(round>2?9:6):'先算，再修正';
      note=round?`第 ${round} 轮 · 近似值`:'从一个初步结果开始';
      change=round>1?`本轮${M.machinStep(round)<0?'减去':'加上'} ${Math.abs(M.machinStep(round)).toFixed(round>3?9:6)}`:'按规则，算下一轮';
      rows=round?Array.from({length:Math.min(round,4)},(_,i)=>`第 ${i+1} 轮　${M.machin(i+1).toFixed(5)}`):['初步计算','↓','按规则修正'];
    }
    text('method-title',title);text('method-number',value);attr('method-number','font-size',s===2?32:46);text('method-note',note);text('method-change',change);
    $('calculation-lines').innerHTML=rows.map((row,i)=>`<text x="341" y="${185+i*36}" class="${i?'small':'label'}">${row}</text>`).join('');
    text('method-source',s<=1?'沃利斯的乘积规则':'补充例子：马青公式');
  }
  function gear(cx,cy,r,id){
    const count=r>50?96:48;
    const points=Array.from({length:count},(_,i)=>{const a=i*2*Math.PI/count,rr=r*(i%4<2?1:.9);return `${rr*Math.cos(a)},${rr*Math.sin(a)}`;}).join(' ');
    return `<g transform="translate(${cx} ${cy})"><g id="${id}"><polygon points="${points}" fill="#e0e8f9" stroke="#254dc2" stroke-width="2"/><path d="M0 0H${r-10}" class="blue"/></g><circle r="8" fill="#52645e"/></g>`;
  }
  $('gears').innerHTML=gear(720,181,71,'gear-large')+gear(820,181,35,'gear-small');
  function renderReturn(s,t) {
    const rolling=s===0||s>=3;
    show('rolling-wheel-position',rolling);show('rolled-path',rolling);show('predicted',s>=3);show('turn-counter',rolling);show('distance-label',rolling);show('error-inset',s>=3);show('road-ticks',s>=3);show('road-base',rolling);
    show('clock-art',s===1);show('sky-art',s===2);
    if(s===1){attr('clock-hands','transform',`rotate(${t*90} 341 184)`);attr('gear-large','transform',`rotate(${t*90})`);attr('gear-small','transform',`rotate(${-t*180})`);}
    if(s===2){const a=t*Math.PI*1.7;attr('planet','cx',340+182*Math.cos(a));attr('planet','cy',180+103*Math.sin(a));attr('map-route','stroke-dasharray',`${t*160} 180`);}
    if(!rolling)return;
    const turns=s===0?t:s===3?t:s===4?mix(1,10,t):10;
    const approximate=s===5?mix(3.14,3.1416,t):3.14;
    const scale=s===0?120:24;
    const data=M.rolling(turns,1,approximate),x=130+data.actual*scale;
    attr('rolling-wheel-position','transform',`translate(${x} 240)`);attr('rolling-wheel-spokes','transform',`rotate(${data.angle*180/Math.PI})`);
    // The wheel drawn at radius 60 uses a camera scale for long journeys. Show the explicit road scale.
    if(s>=3)attr('rolling-wheel-position','transform',`translate(${x} 288) scale(.2)`);
    attr('rolled-path','d',`M130 300H${x}`);
    if(s===0){ // For the close view, displacement / radius is the rotation angle.
      attr('rolling-wheel-position','transform',`translate(${130+data.actual*120} 240)`);attr('rolling-wheel-spokes','transform',`rotate(${data.actual*120/60*180/Math.PI})`);
      text('turn-counter','观察轮边上的橙色记号');text('distance-label','一圈的轮边，铺成一段前进的路');
    } else {
      attr('predicted','transform',`translate(${130+data.estimated*scale} 0)`);
      text('turn-counter',`直径 1 米　·　转 ${turns.toFixed(turns===Math.round(turns)?0:1)} 圈　·　用 ${s===5?approximate.toFixed(4):'3.14'} 计算`);
      text('distance-label',`实际前进约 ${data.actual.toFixed(4)} m　　算出 ${data.estimated.toFixed(4)} m`);
      const base=850,errorPixels=data.error*scale*200;
      attr('inset-actual','d',`M${base} 93V117`);attr('inset-predicted','d',`M${base-errorPixels} 119V143`);
      text('rolling-error',`${data.error>=0?'少算':'多算'} ${Math.abs(data.error*1000).toFixed(3)} 毫米`);
    }
  }
  function draw(c,s,t){
    const group=c===0?'life-art':c<=4?'measure-art':c===5?'geometry-art':c===6?'methods-art':'return-art';
    ['life-art','measure-art','geometry-art','methods-art','return-art'].forEach(id=>show(id,id===group));
    attr('rope','transform','');
    if(c===0)renderLife(s,t);else if(c<=4)renderMeasure(c,s,t);else if(c===5)renderGeometry(s,t);else if(c===6)renderMethods(s,t);else renderReturn(s,t);
  }
  function complete(){cancelAnimationFrame(animation);busy=false;const stop=stops[index];draw(stop.c,stop.s,1);text('story',stop.content[1]);text('motion-status','停下来，说说你的发现');$('next').disabled=false;$('replay').disabled=false;$('previous').disabled=index===0;attr('experience','aria-busy','false');}
  function go(next,animate=true){
    cancelAnimationFrame(animation);index=Math.max(0,Math.min(stops.length-1,next));const {c,s,content}=stops[index];
    text('chapter-number',String(c+1).padStart(2,'0'));text('chapter-label',chapters[c]);text('headline',content[0]);text('figure-description',content[1]);text('beat',`这一幕 ${s+1} / ${scenes[c].length}`);text('progress',`${index+1} / ${stops.length}`);text('next',`${content[2]} →`);
    text('scene-note',c===2||c===3||c===4?'我们来试试 · 动手演示':c===5?'历史中的办法 · 几何示意':c===6?'观察方法，不必记住公式':c===7&&s>=3?'理想圆轮 · 无打滑 · 距离按比例缩小':'');
    show('detail',c===6);document.querySelectorAll('[data-chapter]').forEach(el=>{if(Number(el.dataset.chapter)===c)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');});
    if(!animate||reduced.matches){complete();return;}
    busy=true;$('next').disabled=true;$('replay').disabled=true;$('previous').disabled=index===0;attr('experience','aria-busy','true');text('story','');text('motion-status','正在演示…');
    const duration=c===2?(s===0||s===1?2200:s===3?2400:1000):c===7&&s===4?4000:c===6&&s===5?3500:c===0?1700:1400;
    const start=performance.now();draw(c,s,0);
    function frame(now){const t=Math.min(1,(now-start)/duration);draw(c,s,ease(t));if(t<1)animation=requestAnimationFrame(frame);else complete();}
    animation=requestAnimationFrame(frame);
  }
  function advance(){if(!busy)go(index===stops.length-1?0:index+1);}
  $('chapters').innerHTML=chapters.map((name,c)=>`<button class="chapter" data-chapter="${c}"><b>${String(c+1).padStart(2,'0')}</b>${name}</button>`).join('');
  $('chapters').addEventListener('click',event=>{const button=event.target.closest('[data-chapter]');if(button)go(offsets[Number(button.dataset.chapter)]);});
  $('next').addEventListener('click',advance);$('previous').addEventListener('click',()=>go(index-1,false));$('replay').addEventListener('click',()=>go(index));
  $('canvas').addEventListener('click',event=>{const target=event.target.closest('[role=button]');if(target){target.querySelector('.touch-ring').style.opacity=1;text('story',target.id==='moon'?'满月的外轮廓，看起来是圆的。':target.id==='plate'?'从正上方看盘子，它的边是一圈圆。':'沿着轮子的外边看，这里藏着一个圆。');}else advance();});
  $('canvas').addEventListener('keydown',event=>{if((event.key==='Enter'||event.key===' ')&&event.target.matches('[role=button]')){event.preventDefault();event.target.dispatchEvent(new MouseEvent('click',{bubbles:true}));}});
  document.addEventListener('keydown',event=>{if(document.querySelector('dialog[open]')||event.target.closest('input,select,textarea')||event.ctrlKey||event.metaKey||event.altKey)return;if(event.key==='ArrowRight'){event.preventDefault();advance();}if(event.key==='ArrowLeft'){event.preventDefault();if(index>0)go(index-1,false);}});
  $('sources-button').addEventListener('click',()=>{if(busy)complete();$('information').showModal();});$('detail').addEventListener('click',()=>{if(busy)complete();$('formula-dialog').showModal();});
  $('fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{text('motion-status','浏览器未开启全屏，可继续观看。');}});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&busy)complete();});reduced.addEventListener('change',()=>{if(busy)complete();});
  go(0);
})();
