/*! @maps4html/web-map-custom-element 19-05-2023 */

class MapFeature extends HTMLElement{static get observedAttributes(){return["zoom","min","max"]}get zoom(){return+(this.hasAttribute("zoom")?this.getAttribute("zoom"):0)}set zoom(e){e=parseInt(e,10);!isNaN(e)&&e>=this.min&&e<=this.max&&this.setAttribute("zoom",e)}get min(){return+(this.hasAttribute("min")?this.getAttribute("min"):this._layer._layerEl.extent.zoom.minZoom)}set min(e){e=parseInt(e,10);isNaN(e)||(e>=this._layer._layerEl.extent.zoom.minZoom&&e<=this._layer._layerEl.extent.zoom.maxZoom?this.setAttribute("min",e):this.setAttribute("min",this._layer._layerEl.extent.zoom.minZoom))}get max(){return+(this.hasAttribute("max")?this.getAttribute("max"):this._layer._layerEl.extent.zoom.maxZoom)}set max(e){e=parseInt(e,10);isNaN(e)||(e>=this._layer._layerEl.extent.zoom.minZoom&&e<=this._layer._layerEl.extent.zoom.maxZoom?this.setAttribute("max",e):this.setAttribute("max",this._layer._layerEl.extent.zoom.maxZoom))}get extent(){if(this.isConnected)return this._getFeatureExtent||(this._getFeatureExtent=this._memoizeExtent()),this._getFeatureExtent()}attributeChangedCallback(e,r,t){if("zoom"===e)if(r!==t&&this._layer){let e=this._layer,t=e._layerEl,o=e._mapmlvectors;o?._staticFeature&&(this._removeInFeatureList(r),r=this._getNativeZoomAndCS(e._content),o.zoomBounds=o._getZoomBounds(t.shadowRoot||t,r.zoom)),this._removeFeature(),this._updateFeature()}}constructor(){super()}connectedCallback(){this.parentNode.nodeType!==document.DOCUMENT_FRAGMENT_NODE&&"layer-"!==this.parentNode.nodeName.toLowerCase()||this.parentNode.nodeType===document.DOCUMENT_FRAGMENT_NODE&&this.parentNode.host.hasAttribute("data-moving")||"layer-"===this.parentNode.nodeName.toLowerCase()&&this.parentNode.hasAttribute("data-moving")||(this._addFeature(),this._observer=new MutationObserver(e=>{for(var t of e){if("attributes"===t.type&&t.target===this)return;this._removeFeature(),this._updateFeature()}}),this._observer.observe(this,{childList:!0,subtree:!0,attributes:!0,attributeOldValue:!0,characterData:!0}))}disconnectedCallback(){this._layer._layerEl.hasAttribute("data-moving")||(this._removeFeature(),this._observer.disconnect())}_removeFeature(){if(this._groupEl?.isConnected&&this._groupEl.remove(),this._featureGroup?._map){this._featureGroup._map.removeLayer(this._featureGroup);let e=this._layer._mapmlvectors;var t;e&&(e._staticFeature&&(e._features[this.zoom]&&this._removeInFeatureList(this.zoom),t=this._layer.shadowRoot||this._layer._layerEl,e.zoomBounds=e._getZoomBounds(t,this._getNativeZoomAndCS(this._layer._content).zoom)),e.options.properties=null,delete e._layers[this._featureGroup._leaflet_id])}delete this._featureGroup,delete this._groupEl,this._getFeatureExtent&&delete this._getFeatureExtent}_addFeature(){this._parentEl="LAYER-"===this.parentNode.nodeName.toUpperCase()||"MAP-EXTENT"===this.parentNode.nodeName.toUpperCase()?this.parentNode:this.parentNode.host;var o=e=>{if(this._parentEl._layer._map?this._map=this._layer._map:this._layer.once("attached",function(){this._map=this._layer._map},this),this.querySelector("map-geometry"))if(this._layer._mapmlvectors)this._featureGroup?this._setUpEvents():this._updateFeature();else{let e=this._layer._layerEl;this._layer.once("add",this._setUpEvents,this),e.querySelector("map-extent, map-tile")||e.hasAttribute("src")||1!==e.querySelectorAll("map-feature").length||(this._layer._initialize(e),this._layer.fire("extentload"))}};if(this._parentEl._layer)this._layer=this._parentEl._layer,o();else{let t="LAYER-"===this._parentEl.nodeName.toUpperCase()?this._parentEl:this._parentEl.parentElement||this._parentEl.parentNode.host;t.parentNode.addEventListener("createmap",e=>{this._layer=t._layer,o()})}}_updateFeature(){let e=this._layer._mapmlvectors;var t;e&&(t=this._getNativeZoomAndCS(this._layer._content),this._featureGroup=e.addData(this,t.cs,t.zoom),e._layers[this._featureGroup._leaflet_id]=this._featureGroup,this._groupEl=this._featureGroup.options.group,e._staticFeature&&(t=this._layer.shadowRoot||this._layer._layerEl,e.zoomBounds=e._getZoomBounds(t,this._getNativeZoomAndCS(this._layer._content).zoom),e._resetFeatures(),this._map._addZoomLimit(e),L.extend(e.options,e.zoomBounds)),this._setUpEvents())}_setUpEvents(){["click","focus","blur","keyup","keydown"].forEach(o=>{this._groupEl.addEventListener(o,t=>{if("click"===o){let e=new PointerEvent(o,{cancelable:!0});e.originalEvent=t,this.dispatchEvent(e)}else if("keyup"===o||"keydown"===o){let e=new KeyboardEvent(o,{cancelable:!0});e.originalEvent=t,this.dispatchEvent(e)}else{let e=new FocusEvent(o,{cancelable:!0});e.originalEvent=t,this.dispatchEvent(e)}})})}_getNativeZoomAndCS(e){let i,a;if(this._extentEl)return this._extentEl.querySelector("map-link[rel=query]")?(i=this._map.getZoom(),a="pcrs"):this._extentEl.querySelector("map-link[rel=features]")&&(i=this._extentEl._nativeZoom,a=this._extentEl._nativeCS),{zoom:i,cs:a};if(e.nodeType===Node.DOCUMENT_NODE)return this._layer._mapmlvectors._getNativeVariables(e);if("LAYER-"===e.nodeName.toUpperCase()){let e=this._parentEl.querySelectorAll("map-meta[name=zoom]"),t=e?.length;i=t?+e[t-1].getAttribute("content")?.split(",").find(e=>e.includes("value"))?.split("=")[1]:0;let o=this._parentEl.querySelectorAll("map-meta[name=cs]"),r=o?.length;return a=r?o[r-1].getAttribute("content"):"pcrs",{zoom:i,cs:a}}}_memoizeExtent(){let u;return function(){if(u&&this._getFeatureExtent)return u;{let i=this._map,e=this.querySelector("map-geometry"),t=this._getNativeZoomAndCS(this._layer._content),o=e.getAttribute("cs")||t.cs,r=this.zoom||t.zoom,a=e.querySelectorAll("map-point, map-linestring, map-polygon, map-multipoint, map-multilinestring"),s=[1/0,1/0,Number.NEGATIVE_INFINITY,Number.NEGATIVE_INFINITY];for(var l of a){var p=l.querySelectorAll("map-coordinates");for(let e=0;e<p.length;++e)s=function(e,t,o){var r=t.innerHTML.trim().replace(/<[^>]+>/g,"").replace(/\s+/g," ").split(/[<>\ ]/g);switch(e.tagName){case"MAP-POINT":o=M._updateExtent(o,+r[0],+r[1]);break;case"MAP-LINESTRING":case"MAP-POLYGON":case"MAP-MULTIPOINT":case"MAP-MULTILINESTRING":for(let e=0;e<r.length;e+=2)o=M._updateExtent(o,+r[e],+r[e+1])}return o}(l,p[e],s)}var m=L.point(s[0],s[1]),h=L.point(s[2],s[3]);let n=M.boundsToPCRSBounds(L.bounds(m,h),r,i.options.projection,o);if(1===a.length&&"MAP-POINT"===a[0].tagName.toUpperCase()){let e=i.options.projection,t=this.hasAttribute("max")?+this.getAttribute("max"):M[e].options.resolutions.length-1,o=M[e].options.crs.tile.bounds.getCenter(),r=M[e].transformation.transform(n.min,M[e].scale(+this.zoom||t));n=M.pixelToPCRSBounds(L.bounds(r.subtract(o),r.add(o)),this.zoom||t,e)}h=M._convertAndFormatPCRS(n,i);return u=h}}}_removeInFeatureList(t){let o=this._layer._mapmlvectors;for(let e=0;e<o._features[t].length;++e)if(o._features[t][e]._leaflet_id===this._featureGroup._leaflet_id){o._features[t].splice(e,1);break}}getMaxZoom(){var e=this.extent.topLeft.pcrs,t=this.extent.bottomRight.pcrs,o=L.bounds(L.point(e.horizontal,e.vertical),L.point(t.horizontal,t.vertical)),r=this._map.options.projection,e=this._layer._layerEl.extent.zoom,t=e.minZoom||0,r=e.maxZoom||M[r].options.resolutions.length-1;let i;return this.hasAttribute("zoom")?i=this.zoom:(i=M.getMaxZoom(o,this._map,t,r),this.max<i?i=this.max:this.min>i&&(i=this.min)),i<t?i=t:i>r&&(i=r),i}mapml2geojson(e){e=Object.assign({},{propertyFunction:null,transform:!0},e);let t={type:"Feature",properties:{},geometry:{}},o=this.querySelector("map-properties");o?"function"==typeof e.propertyFunction?t.properties=e.propertyFunction(o):o.querySelector("table")?(s=o.querySelector("table").cloneNode(!0),t.properties=M._table2properties(s)):t.properties={prop0:o.innerHTML.replace(/(<([^>]+)>)/gi,"").replace(/\s/g,"")}:t.properties=null;let r=null,i=null;e.transform&&(r=new proj4.Proj(this._map.options.crs.code),i=new proj4.Proj("EPSG:4326"),"EPSG:3857"!==this._map.options.crs.code&&"EPSG:4326"!==this._map.options.crs.code||(e.transform=!1));var a=this.querySelector("map-geometry").querySelector("map-geometrycollection"),s=this.querySelector("map-geometry").querySelectorAll("map-point, map-polygon, map-linestring, map-multipoint, map-multipolygon, map-multilinestring");if(a){t.geometry.type="GeometryCollection",t.geometry.geometries=[];for(var n of s)t.geometry.geometries.push(M._geometry2geojson(n,r,i,e.transform))}else t.geometry=M._geometry2geojson(s[0],r,i,e.transform);return t}click(){let e=this._groupEl,t=e.getBoundingClientRect();var o=new MouseEvent("click",{clientX:t.x+t.width/2,clientY:t.y+t.height/2,button:0}),r=this.querySelector("map-properties");if("link"===e.getAttribute("role"))for(var i of e.children)i.mousedown.call(this._featureGroup,o),i.mouseup.call(this._featureGroup,o);let a=new PointerEvent("click",{cancelable:!0});if(a.originalEvent=o,this.dispatchEvent(a),r&&this.isConnected){let e=this._featureGroup,t=e._layers;for(var s in t)t[s].isPopupOpen()&&t[s].closePopup();e.isPopupOpen()?e.closePopup():a.originalEvent.cancelBubble||e.openPopup()}}focus(e){this._groupEl.focus(e)}blur(){document.activeElement.shadowRoot?.activeElement!==this._groupEl&&document.activeElement.shadowRoot?.activeElement.parentNode!==this._groupEl||(this._groupEl.blur(),this._map._container.focus())}zoomTo(){let e=this.extent,t=this._map,o=e.topLeft.pcrs,r=e.bottomRight.pcrs,i=L.bounds(L.point(o.horizontal,o.vertical),L.point(r.horizontal,r.vertical)),a=t.options.crs.unproject(i.getCenter(!0));t.setView(a,this.getMaxZoom(),{animate:!1})}}export{MapFeature};
//# sourceMappingURL=map-feature.js.map