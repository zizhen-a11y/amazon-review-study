const fs=require('fs'),vm=require('vm'),assert=require('assert');
const path=require('path'),root=path.resolve(__dirname,'..');
class Element{
 constructor(tag){this.tagName=tag;this.children=[];this.attributes={};this.dataset={};this.className='';this._text='';}
 set textContent(v){this._text=String(v);this.children=[];} get textContent(){return this._text+this.children.map(x=>x.textContent).join('');}
 append(...xs){this.children.push(...xs);} replaceChildren(...xs){this.children=xs;this._text='';}
 setAttribute(k,v){this.attributes[k]=String(v);} getAttribute(k){return this.attributes[k]??null;} scrollIntoView(){this.scrolled=true;} focus(){this.focused=true;}
}
const all=(n)=>[n,...n.children.flatMap(all)],find=(n,c)=>all(n).find(x=>x.className===c);
let shared=[];
for(const condition of ['control','treatment']){
 const app=new Element('main');const document={createElement:t=>new Element(t),createTextNode:t=>{let n=new Element('#text');n.textContent=t;return n;},getElementById:()=>app};
 const ctx=vm.createContext({document,window:{},location:{pathname:`/${condition}.html`}});
 for(const file of ['product.js','materials.js','app.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),ctx);
 const data=ctx.window.STUDY_MATERIALS;
 assert.equal(all(app).filter(x=>x.className==='summary').length,condition==='treatment'?1:0);
 if(condition==='treatment')assert.equal(find(app,'summary-text').textContent,data.summary);
 const snapshots=[];
 function check(page){const cards=all(app).filter(x=>x.className==='review');assert.equal(cards.length,10);assert.deepEqual(cards.map(x=>x.dataset.reviewId),Array.from({length:10},(_,i)=>(page-1)*10+i+1));cards.forEach((card,i)=>{const r=data.reviews[(page-1)*10+i];assert.equal(find(card,'reviewer-name').textContent,r.reviewerName);assert.equal(find(card,'date').textContent,r.dateText);assert.deepEqual(find(card,'review-body').children.map(x=>x.textContent),Array.from(r.body));assert.equal(find(card,'review-title').children[1].textContent,r.title);assert.equal(find(card,'stars').getAttribute('aria-label'),`${r.rating} out of 5 stars`);assert.equal(find(card,'helpful-count')?.textContent??null,r.helpfulText);});const nav=find(app,'pagination');assert.equal(nav.children[0].disabled,page===1);assert.equal(nav.children[5].disabled,page===4);assert.equal(nav.children[page].getAttribute('aria-current'),'page');snapshots.push(cards.map(x=>x.textContent));}
 check(1);for(let page=2;page<=4;page++){find(app,'pagination').children[page].onclick();check(page);assert(find(app,'list-heading').scrolled);assert(find(app,'list-heading').focused);}
 find(app,'pagination').children[0].onclick();check(3);find(app,'pagination').children[5].onclick();check(4);
 shared.push(snapshots);
}
assert.deepEqual(shared[0],shared[1]);
console.log('PASS: executed app.js for both conditions; exact rendered reviews and paragraphs; all four pages; Previous/Next boundaries; scroll/focus; summary only in treatment; identical common rendered content.');
