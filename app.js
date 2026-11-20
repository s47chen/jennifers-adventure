const $=id=>document.getElementById(id);
const chickenIcon=new Image();chickenIcon.src='jollibee-chicken.png';
const rainHamster=new Image();rainHamster.src='hamster-rain.png';
const happyHamster=new Image();happyHamster.src='hamster-happy.png';
['hamster-no-crying.png','hamster-no-unimpressed.png','hamster-no-thumbsdown.png'].forEach(src=>{const image=new Image();image.src=src;});
let found=new Set(),stage='intro',cleanupRunaway=()=>{};
const names=['PIP','MOCHI','BEAN'];
const hints=['I put a bucket of Jollibee chicken right beside my tree. Very sneaky. Very hidden. Okay, you can probably smell it.','Mine is floating over the path! Collect it before I try to eat it.','There’s one near the little house. No, I will not explain the eyebrows.'];
const messages=['For all the little ways you make an ordinary day feel special.','For the way being around you makes everything a little brighter.','For the courage to tell you something I’ve been meaning to say.'];
function story(speaker,chapter,title,copy,buttons=[]){cleanupRunaway();cleanupRunaway=()=>{};$('speaker').textContent=speaker;$('chapter').textContent=chapter;$('story-title').textContent=title;$('story-copy').textContent=copy;$('actions').replaceChildren();buttons.forEach(([label,fn,secondary])=>{const b=document.createElement('button');b.textContent=label;b.className=secondary?'secondary':'primary';b.onclick=fn;$('actions').append(b)});}
function focusStory(){$('story-title').focus({preventScroll:true});$('story-title').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'nearest'});}
function start(){stage='chicken';$('scene').classList.add('playing');$('quest-status').textContent='CHICKEN: 0 / 3';$('scene-caption').textContent='TAP THE THREE CHICKEN BUCKETS';story('PIP','QUEST 1 · THE CHICKEN HUNT','A little help for our very secret plan?','We hid three buckets of Jollibee chicken around the valley. Find them all! You can tap us for a hint.');}
$('begin').onclick=start;
document.querySelectorAll('[data-chicken]').forEach(b=>b.onclick=()=>{if(stage!=='chicken')return;const n=Number(b.dataset.chicken);if(found.has(n))return;found.add(n);b.classList.add('collected');const slot=document.querySelectorAll('.slot')[n];slot.classList.add('full');slot.setAttribute('aria-label','Collected Jollibee chicken bucket');$('quest-status').textContent='CHICKEN: '+found.size+' / 3';if(found.size===3){stage='path';$('scene-caption').textContent='THE HAMSTERS SEEM VERY PLEASED WITH THEMSELVES.';story(names[n],'QUEST 1 COMPLETE · 3 / 3 BUCKETS','Excellent. The plan is working.','Three buckets of chicken, all collected. There’s something waiting for you at the cottage.',[['FOLLOW THE PATH',letter]]);}else story(names[n],'QUEST 1 · '+found.size+' / 3 BUCKETS','A little Chickenjoy, just for you.',messages[n]);});
document.querySelectorAll('[data-hamster]').forEach(b=>b.onclick=()=>{const n=Number(b.dataset.hamster);if(stage==='intro'){story(names[n],'THE HAMSTER WELCOMING COMMITTEE',['Jennifer! We’ve been expecting you.','Do we look like we’re plotting something?','The eyebrows? Completely normal.'][n],['I’m Pip, your very trustworthy guide. Ready for a tiny adventure?','I’m Mochi. I’m in charge of secrets. And snacks. Mostly snacks.','I’m Bean. I have one job: make sure you get to the end of this adventure.'][n],[['START ADVENTURE',start]]);}else if(stage==='chicken'){story(names[n],'HAMSTER HINT',found.has(n)?'You found my chicken!':'A totally subtle hint…',found.has(n)?'Keep looking for the other chicken buckets. My friends know where they are.':hints[n]);}else if(stage==='path'){letter();}else if(stage==='letter'){story(names[n],'QUEST 2 · THE SECRET LETTER','That letter has your name on it.','Tap the envelope by the cottage, or open it here. We’ll give you a little privacy.',[['OPEN THE LETTER',question]]);}});
function letter(){stage='letter';$('location').textContent='THE SECRET COTTAGE';$('quest-status').textContent='LETTER UNLOCKED';$('letter').classList.remove('hidden');$('scene-caption').textContent='A LETTER! WITH YOUR NAME ON IT!';story('BEAN','QUEST 2 · THE SECRET LETTER','Delivery for one very special human.','Jennifer, we’ve been guarding this letter all day. Someone has a little something to ask you.',[['OPEN THE LETTER',question]]);focusStory();}
$('letter').onclick=question;
function question(){stage='question';$('scene').classList.add('final');$('letter').classList.add('hidden');$('location').textContent='A BRAND NEW CHAPTER';$('quest-status').textContent='ONE BIG QUESTION';$('scene-caption').textContent='THE HAMSTERS ARE HOLDING THEIR BREATH.';$('subtitle').textContent='The hamsters helped. But this part is from my heart.';story('FOR YOU','THE FINAL QUEST · FOLLOW YOUR HEART','Jennifer, will you be my girlfriend?','I’d love more little moments, more laughs, and more adventures with you. What do you say?',[['YES! LET’S DO THIS ♥',yes],['I need a little time',()=>answer('Take all the time you need.','No rush, and no pressure. I’m happy I got to tell you how I feel.'),true],['No, thank you',no,true]]);makeNoRunAway();focusStory();}
function answer(title,copy){stage='end';$('quest-status').textContent='ADVENTURE COMPLETE';$('scene-caption').textContent='THANK YOU FOR PLAYING, JENNIFER.';story('PIP','THANK YOU FOR BEING YOU',title,copy,[['PLAY AGAIN',()=>location.reload(),true]]);focusStory();}
function yes(){stage='end';document.querySelectorAll('.hamster img, .portrait img').forEach(img=>{img.src='hamster-happy.png';if(img.alt)img.alt='An overjoyed pixel hamster laughing with its front teeth showing';});$('quest-status').textContent='NEW CHAPTER UNLOCKED';$('scene-caption').textContent='THE HAMSTERS ARE ABSOLUTELY LOSING IT.';$('subtitle').textContent='Best. Quest. Ever.';story('PIP','QUEST COMPLETE · HEART FULL','Player two? I was hoping it’d be you. ♥','Here’s to our next adventure. Come tell me your answer in person — you’ve just made my day.',[['PLAY AGAIN',()=>location.reload(),true]]);document.querySelectorAll('.speech').forEach((s,i)=>s.textContent=['SHE SAID YES!','I KNEW IT.','BEST DAY EVER.'][i]);$('scene').classList.remove('playing');if(!matchMedia('(prefers-reduced-motion: reduce)').matches){for(let i=0;i<36;i++){const p=document.createElement('img');p.src='hamster-rain.png';p.alt='';p.className='hamster-rain';p.style.left=(3+Math.random()*90)+'vw';p.style.width=(48+Math.random()*36)+'px';p.style.setProperty('--drift',(Math.random()*120-60)+'px');p.style.setProperty('--spin',(Math.random()*90-45)+'deg');p.style.animationDuration=(4+Math.random()*2.5)+'s';p.style.animationDelay=(Math.random()*3)+'s';$('confetti').append(p);p.addEventListener('animationend',()=>p.remove(),{once:true});setTimeout(()=>p.remove(),10500);}}focusStory();}
$('restart').onclick=()=>location.reload();

function no(){answer('Thank you for being honest.','Your answer matters, and I respect it. Thank you for sharing this little adventure with me.');const reactions=[['hamster-no-crying.png','A pixel hamster crying dramatically'],['hamster-no-unimpressed.png','An unimpressed pixel hamster raising its middle finger'],['hamster-no-thumbsdown.png','A pouting pixel hamster giving a thumbs down']];document.querySelectorAll('.hamster img').forEach((img,i)=>{img.src=reactions[i][0];img.alt=reactions[i][1];});document.querySelector('.portrait img').src=reactions[0][0];}

function makeNoRunAway(){
  const button=$('actions').lastElementChild;
  const controller=new AbortController();
  let placeholder=null;
  function reset(){button.classList.remove('runaway-no');button.style.removeProperty('left');button.style.removeProperty('top');placeholder?.remove();placeholder=null;}
  function dodge(event){
    if(stage!=='question'||matchMedia('(prefers-reduced-motion: reduce)').matches)return false;
    const rect=button.getBoundingClientRect();
    const viewport=window.visualViewport;
    const width=viewport?.width||innerWidth,height=viewport?.height||innerHeight;
    const offsetX=viewport?.offsetLeft||0,offsetY=viewport?.offsetTop||0;
    const maxX=width-rect.width-16,maxY=height-rect.height-16;
    if(maxX<16||maxY<16)return false;
    const others=[...$('actions').children].filter(el=>el!==button&&el!==placeholder).map(el=>el.getBoundingClientRect());
    const candidates=[];
    for(let row=0;row<5;row++)for(let col=0;col<5;col++){
      const x=offsetX+16+(maxX-16)*col/4,y=offsetY+16+(maxY-16)*row/4;
      if(others.some(r=>x<r.right+12&&x+rect.width>r.left-12&&y<r.bottom+12&&y+rect.height>r.top-12))continue;
      const distance=Math.hypot(x+rect.width/2-event.clientX,y+rect.height/2-event.clientY);
      candidates.push({x,y,distance});
    }
    candidates.sort((a,b)=>b.distance-a.distance);
    if(!candidates.length)return false;
    const target=candidates[Math.floor(Math.random()*Math.min(3,candidates.length))];
    if(!placeholder){placeholder=document.createElement('span');placeholder.setAttribute('aria-hidden','true');placeholder.style.cssText='display:inline-block;width:'+rect.width+'px;height:'+rect.height+'px;';button.before(placeholder);}
    button.classList.add('runaway-no');button.style.left=target.x+'px';button.style.top=target.y+'px';
    return true;
  }
  button.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')dodge(e);},{signal:controller.signal});
  button.addEventListener('pointerdown',e=>{if(dodge(e)){e.preventDefault();e.stopPropagation();}},{signal:controller.signal});
  button.onclick=e=>{if(e.detail===0||!dodge(e))no();};
  button.addEventListener('keydown',e=>{if(e.key==='Tab')reset();},{signal:controller.signal});
  window.addEventListener('resize',reset,{signal:controller.signal});
  window.visualViewport?.addEventListener('resize',reset,{signal:controller.signal});
  cleanupRunaway=()=>{controller.abort();reset();};
}
