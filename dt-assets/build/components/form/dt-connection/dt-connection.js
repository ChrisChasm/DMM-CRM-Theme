import{i as t,y as e}from"../../lit-element-2409d5fe.js";import{D as i}from"../dt-tags/dt-tags.js";import"../dt-multi-select/dt-multi-select.js";import"../../style-map-ac85d91b.js";import"../../directive-de55b00a.js";import"../../lit-localize-763e4978.js";import"../dt-form-base.js";import"../../dt-base.js";import"../dt-label/dt-label.js";import"../mixins/hasOptionsList.js";import"../../icons/dt-spinner.js";import"../../icons/dt-checkmark.js";window.customElements.define("dt-connection",class extends i{static get styles(){return[...super.styles,t`.selected-option a{border-inline-start:solid 3px transparent}li button *{pointer-events:none}li{border-inline-start:solid 5px transparent}li button .status{font-style:italic;opacity:.6}li button .status:before{content:'[';font-style:normal}li button .status:after{content:']';font-style:normal}li button svg{width:20px;height:auto;margin-bottom:-4px}li button svg use{fill:var(--dt-connection-icon-fill,var(--primary-color))}`]}_clickOption(t){if(t.target&&t.target.value){const e=parseInt(t.target.value,10),i=this.filteredOptions.reduce(((t,i)=>t||i.id!=e?t:i),null);i&&this._select(i),this._clearSearch()}}_clickAddNew(t){if(t.target){this._select({id:t.target.dataset?.label,label:t.target.dataset?.label,isNew:!0});const e=this.shadowRoot.querySelector("input");e&&(e.value="")}}_keyboardSelectOption(){this.activeIndex>-1&&(this.activeIndex+1>this.filteredOptions.length?this._select({id:this.query,label:this.query,isNew:!0}):this._select(this.filteredOptions[this.activeIndex]),this._clearSearch())}_remove(t){if(t.target&&t.target.dataset&&t.target.dataset.value){const e=new CustomEvent("change",{detail:{field:this.name,oldValue:this.value}});this.value=(this.value||[]).map((e=>{const i={...e};return e.id===t.target.dataset.value&&(i.delete=!0),i})),e.detail.newValue=this.value,this.dispatchEvent(e),this.open&&this.shadowRoot.querySelector("input").focus()}}_filterOptions(){const t=(this.value||[]).filter((t=>!t.delete)).map((t=>t?.id));if(this.options?.length)this.filteredOptions=(this.options||[]).filter((e=>!t.includes(e.id)&&(!this.query||e.label.toLocaleLowerCase().includes(this.query.toLocaleLowerCase()))));else if(this.open||this.canUpdate){this.loading=!0,this.filteredOptions=[];const e=this,i=new CustomEvent("dt:get-data",{bubbles:!0,detail:{field:this.name,postType:this.postType,query:this.query,onSuccess:i=>{e.loading=!1,e.filteredOptions=i.filter((e=>!t.includes(e.id)))},onError:t=>{console.warn(t),e.loading=!1,this.canUpdate=!1}}});this.dispatchEvent(i)}return this.filteredOptions}_renderSelectedOptions(){return(this.value||[]).filter((t=>!t.delete)).map((t=>e`<div class="selected-option"><a href="${t.link}" style="border-inline-start-color:${t.status?t.status.color:""}" ?disabled="${this.disabled}" title="${t.status?t.status.label:t.label}">${t.label}</a> <button @click="${this._remove}" ?disabled="${this.disabled}" data-value="${t.id}">x</button></div>`))}_renderOption(t,i){const s=e`<svg width="24" height="24" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>circle-08 2</title><desc>Created using Figma</desc><g id="Canvas" transform="translate(1457 4940)"><g id="circle-08 2"><g id="Group"><g id="Vector"><use xlink:href="#path0_fill" transform="translate(-1457 -4940)" fill="#000000"/></g></g></g></g><defs><path id="path0_fill" d="M 12 0C 5.383 0 0 5.383 0 12C 0 18.617 5.383 24 12 24C 18.617 24 24 18.617 24 12C 24 5.383 18.617 0 12 0ZM 8 10C 8 7.791 9.844 6 12 6C 14.156 6 16 7.791 16 10L 16 11C 16 13.209 14.156 15 12 15C 9.844 15 8 13.209 8 11L 8 10ZM 12 22C 9.567 22 7.335 21.124 5.599 19.674C 6.438 18.091 8.083 17 10 17L 14 17C 15.917 17 17.562 18.091 18.401 19.674C 16.665 21.124 14.433 22 12 22Z"/></defs></svg>`,l=t.status||{key:"",label:"",color:""};return e`<li tabindex="-1" style="border-inline-start-color:${l.color}"><button value="${t.id}" type="button" data-label="${t.label}" @click="${this._clickOption}" @touchstart="${this._touchStart}" @blur="${this._inputFocusOut}" @touchmove="${this._touchMove}" @touchend="${this._touchEnd}" tabindex="-1" class="${this.activeIndex>-1&&this.activeIndex===i?"active":""}"><span class="label">${t.label}</span> <span class="connection-id">(#${t.id})</span> ${l.label?e`<span class="status">${l.label}</span>`:null} ${t.user?s:null}</button></li>`}});
//# sourceMappingURL=dt-connection.js.map
