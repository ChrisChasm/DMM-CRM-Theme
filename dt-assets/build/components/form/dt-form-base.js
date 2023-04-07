import{i as e,y as t}from"../lit-element-2409d5fe.js";import{D as i}from"../dt-base.js";import"./dt-label/dt-label.js";import"../lit-localize-763e4978.js";class r extends i{static get formAssociated(){return!0}static get styles(){return[e`.input-group{position:relative}.input-group.disabled{background-color:var(--disabled-color)}.icon-overlay{position:absolute;inset-inline-end:1rem;top:0;height:100%;display:flex;justify-content:center;align-items:center}.icon-overlay.alert{color:var(--alert-color)}.icon-overlay.success{color:var(--success-color)}`]}static get properties(){return{...super.properties,label:{type:String},icon:{type:String},iconAltText:{type:String},private:{type:Boolean},privateLabel:{type:String},disabled:{type:Boolean},required:{type:Boolean},requiredMessage:{type:String},touched:{type:Boolean,state:!0},invalid:{type:Boolean,state:!0},error:{type:Boolean},loading:{type:Boolean},saved:{type:Boolean}}}get _field(){return this.shadowRoot.querySelector("input, textarea, select")}get _focusTarget(){return this._field}constructor(){super(),this.touched=!1,this.invalid=!1,this.internals=this.attachInternals(),this.addEventListener("invalid",(()=>{this.touched=!0,this._validateRequired()}))}firstUpdated(...e){super.firstUpdated(...e),this.internals.setFormValue(this.value),this._validateRequired()}_setFormValue(e){this.internals.setFormValue(e),this._validateRequired(),this.touched=!0}_validateRequired(){}labelTemplate(){return this.label?t`<dt-label ?private="${this.private}" privateLabel="${this.privateLabel}" iconAltText="${this.iconAltText}" icon="${this.icon}">${this.icon?null:t`<slot name="icon-start" slot="icon-start"></slot>`} ${this.label}</dt-label>`:""}render(){return t`${this.labelTemplate()}<slot></slot>`}}export{r as D};
