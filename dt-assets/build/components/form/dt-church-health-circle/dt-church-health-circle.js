import{i as t,y as e}from"../../lit-element-2409d5fe.js";import{o as r}from"../../class-map-8d921948.js";import{D as i}from"../../dt-base.js";import"./dt-church-health-circle-icon.js";import"../../directive-de55b00a.js";import"../../lit-localize-763e4978.js";window.customElements.define("dt-church-health-circle",class extends i{static get styles(){return t`.health-circle__container{--d:50px;--rel:0.5;--r:calc(1 * var(--d) / var(--tan));--s:calc(3 * var(--r));margin:1rem auto;display:flex;justify-content:center;align-items:baseline}@media (max-width:519px){.health-circle{max-width:300px;min-width:300px}.health-circle__container{--r:calc(0.8 * var(--d) / var(--tan))}}@media (min-width:520px){.health-circle__container{--r:calc(1.1 * var(--d) / var(--tan))}}.health-circle--committed{border:3px #4caf50 solid!important}dt-church-health-icon{margin:auto;position:absolute;height:50px;width:50px;border-radius:100%;font-size:16px;color:#000;text-align:center;font-style:italic;cursor:pointer;position:absolute;top:50%;left:50%;margin:calc(-.5 * var(--d));width:var(--d);height:var(--d);--az:calc(var(--i) * 1turn / var(--m));transform:rotate(var(--az)) translate(var(--r)) rotate(calc(-1 * var(--az)))}`}static get properties(){return{groupId:{type:Number},group:{type:Object,reflect:!1},settings:{type:Object,reflect:!1},errorMessage:{type:String,attribute:!1},missingIcon:{type:String}}}get metrics(){const t=this.settings||[];if(!Object.values(t).length)return[];return Object.entries(t).filter((([t,e])=>"church_commitment"!==t))}get isCommited(){return!!this.group&&(!!this.group.health_metrics&&this.group.health_metrics.includes("church_commitment"))}connectedCallback(){super.connectedCallback(),this.fetch()}adoptedCallback(){this.distributeItems()}updated(){this.distributeItems()}async fetch(){try{const t=[this.fetchSettings(),this.fetchGroup()];let[e,r]=await Promise.all(t);this.settings=e,this.post=r,e||(this.errorMessage="Error loading settings"),r||(this.errorMessage="Error loading group")}catch(t){console.error(t)}}fetchGroup(){if(this.group)return Promise.resolve(this.group);fetch(`/wp-json/dt-posts/v2/groups/${this.groupId}`).then((t=>t.json()))}fetchSettings(){return this.settings?Promise.resolve(this.settings):fetch("/wp-json/dt-posts/v2/groups/settings").then((t=>t.json()))}findMetric(t){const e=this.metrics.find((e=>e.key===t));return e?e.value:null}render(){if(!this.group||!this.metrics.length)return e`<dt-spinner></dt-spinner>`;const t=this.group.health_metrics||[];return this.errorMessage&&e`<dt-alert type="error">${this.errorMessage}</dt-alert>`,e`<div class="health-circle__wrapper"><div class="health-circle__container"><div class="${r({"health-circle":!0,"health-circle--committed":this.isCommited})}"><div class="health-circle__grid">${this.metrics.map((([r,i],s)=>e`<dt-church-health-icon key="${r}" .group="${this.group}" .metric="${i}" .active="${-1!==t.indexOf(r)}" .style="--i: ${s+1}" .missingIcon="${this.missingIcon}"></dt-church-health-icon>`))}</div></div></div><dt-toggle name="church-commitment" label="${this.settings.church_commitment.label}" requiredmessage="" icon="https://cdn-icons-png.flaticon.com/512/1077/1077114.png" iconalttext="Icon Alt Text" privatelabel="" @click="${this.toggleClick}" ?checked="${this.isCommited}"></dt-toggle></div>`}distributeItems(){const t=this.renderRoot.querySelector(".health-circle__container");let e=t.querySelectorAll("dt-church-health-icon").length,r=Math.tan(Math.PI/e);t.style.setProperty("--m",e),t.style.setProperty("--tan",+r.toFixed(2))}toggleClick(t){let e=this.renderRoot.querySelector("dt-toggle").toggleAttribute("checked");const r={health_metrics:{values:[{value:"church_commitment",delete:!e}]}};try{API.update_post("groups",this.group.ID,r),this.group.health_metrics||(this.group.health_metrics=[]),e?this.group.health_metrics.push("church_commitment"):this.group.health_metrics.pop("church_commitment")}catch(t){console.log(t)}this.requestUpdate()}_isChecked(){return Object.hasOwn(this.group,"health_metrics")&&this.group.health_metrics.includes("church_commitment")?this.isChurch=!0:this.isChurch=!1}});
