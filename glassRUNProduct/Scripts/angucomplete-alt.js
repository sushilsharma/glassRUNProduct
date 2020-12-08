/* Copyright (c) 2014 Hidenari Nozaki and contributors | Licensed under the MIT license */
(function (b, a) { if (typeof module !== "undefined" && module.exports) { module.exports = a(require("angular")) } else { if (typeof define === "function" && define.amd) { define(["angular"], a) } else { a(b.angular) } } }(window, function (a) { a.module("angucomplete-alt", []).directive("angucompleteAlt", ["$q", "$parse", "$http", "$sce", "$timeout", "$templateCache", "$interpolate", function (e, d, b, f, h, g, c) { var j = 40; var n = 39; var p = 38; var m = 37; var l = 27; var k = 13; var o = 9; var s = 3; var r = 524288; var t = 500; var i = 200; var u = "autocomplete-required"; var x = "Searching..."; var w = "No results found"; var v = "/angucomplete-alt/index.html"; g.put(v, '<div class="angucomplete-holder" ng-class="{\'angucomplete-dropdown-visible\': showDropdown}">  <input id="{{id}}_value" name="{{inputName}}" tabindex="{{fieldTabindex}}" ng-class="{\'angucomplete-input-not-empty\': notEmpty}" ng-model="searchStr" ng-disabled="disableInput" type="{{inputType}}" placeholder="{{placeholder}}" maxlength="{{maxlength}}" ng-focus="onFocusHandler()" class="{{inputClass}}" ng-focus="resetHideResults()" ng-blur="hideResults($event)" autocapitalize="off" autocorrect="off" autocomplete="off" ng-change="inputChangeHandler(searchStr)"/>  <div id="{{id}}_dropdown" class="angucomplete-dropdown" ng-show="showDropdown">    <div class="angucomplete-searching" ng-show="searching" ng-bind="textSearching"></div>    <div class="angucomplete-searching" ng-show="!searching && (!results || results.length == 0)" ng-bind="textNoResults"></div>    <div class="angucomplete-row" ng-repeat="result in results" ng-click="selectResult(result)" ng-mouseenter="hoverRow($index)" ng-class="{\'angucomplete-selected-row\': $index == currentIndex}">      <div ng-if="imageField" class="angucomplete-image-holder">        <img ng-if="result.image && result.image != \'\'" ng-src="{{result.image}}" class="angucomplete-image"/>        <div ng-if="!result.image && result.image != \'\'" class="angucomplete-image-default"></div>      </div>      <div class="angucomplete-title" ng-if="matchClass" ng-bind-html="result.title"></div>      <div class="angucomplete-title" ng-if="!matchClass">{{ result.title }}</div>      <div ng-if="matchClass && result.description && result.description != \'\'" class="angucomplete-description" ng-bind-html="result.description"></div>      <div ng-if="!matchClass && result.description && result.description != \'\'" class="angucomplete-description">{{result.description}}</div>    </div>  </div></div>'); function q(ao, O, y, F) { var af = O.find("input"); var aj = s; var ap = null; var Z; var am = u; var an; var aw = null; var aa = null; var G = O[0].querySelector(".angucomplete-dropdown"); var ag = false; var ak = null; var au; var I; var H; O.on("mousedown", function (ax) { if (ax.target.id) { ak = ax.target.id; if (ak === ao.id + "_dropdown") { document.body.addEventListener("click", E) } } else { ak = ax.target.className } }); ao.currentIndex = ao.focusFirst ? 0 : null; ao.searching = false; au = ao.$watch("initialValue", function (ax) { if (ax) { au(); W(ax, true) } }); ao.$watch("fieldRequired", function (ax, ay) { if (ax !== ay) { if (!ax) { F[ao.inputName].$setValidity(am, true) } else { if (!aw || ao.currentIndex === -1) { Y(false) } else { Y(true) } } } }); ao.$on("angucomplete-alt:clearInput", function (ay, ax) { if (!ax || ax === ao.id) { ao.searchStr = null; A(); Y(false); D() } }); ao.$on("angucomplete-alt:changeInput", function (ay, ax, az) { if (!!ax && ax === ao.id) { W(az) } }); function W(ay, ax) { if (ay) { if (typeof ay === "object") { ao.searchStr = Q(ay); A({ originalObject: ay }) } else { if (typeof ay === "string" && ay.length > 0) { ao.searchStr = ay } else { if (console && console.error) { console.error("Tried to set " + (!!ax ? "initial" : "") + " value of angucomplete to", ay, "which is an invalid value") } } } Y(true) } } function E(ax) { ak = null; ao.hideResults(ax); document.body.removeEventListener("click", E) } function ad(ax) { return ax.which ? ax.which : ax.keyCode } function A(ax) { if (typeof ao.selectedObject === "function") { ao.selectedObject(ax) } else { ao.selectedObject = ax } if (ax) { Y(true) } else { Y(false) } } function z(ax) { return function (ay) { return ao[ax] ? ao[ax](ay) : ay } } function ar(ax) { A({ originalObject: ax }); if (ao.clearSelected) { ao.searchStr = null } D() } function Q(ax) { return ao.titleField.split(",").map(function (ay) { return R(ax, ay) }).join(" ") } function P(ax) { return ao.imageField.split(",").map(function (ay) { return R(ax, ay) }).join(" ") } function R(aA, ay) { var az, aB; if (ay) { az = ay.split("."); aB = aA; for (var ax = 0; ax < az.length; ax++) { aB = aB[az[ax]] } } else { aB = aA } return aB } function S(aB, aA) { var az, ax, ay; ay = new RegExp(aA.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"); if (!aB) { return } if (!aB.match || !aB.replace) { aB = aB.toString() } ax = aB.match(ay); if (ax) { az = aB.replace(ay, '<span class="' + ao.matchClass + '">' + ax[0] + "</span>") } else { az = aB } return f.trustAsHtml(az) } function Y(ax) { ao.notEmpty = ax; aw = ao.searchStr; if (ao.fieldRequired && F && ao.inputName) { F[ao.inputName].$setValidity(am, ax) } } function ai(ax) { var ay = ad(ax); if (ay === m || ay === n) { return } if (ay === p || ay === k) { ax.preventDefault() } else { if (ay === j) { ax.preventDefault(); if (!ao.showDropdown && ao.searchStr && ao.searchStr.length >= aj) { ae(); ao.searching = true; aq(ao.searchStr) } } else { if (ay === l) { D(); ao.$apply(function () { af.val(ao.searchStr) }) } else { if (aj === 0 && !ao.searchStr) { return } if (!ao.searchStr || ao.searchStr === "") { ao.showDropdown = false;} else { if (ao.searchStr.length >= aj) { ae(); if (ap) { h.cancel(ap) } ao.searching = true; ap = h(function () { aq(ao.searchStr) }, ao.pause) } } if (aw && aw !== ao.searchStr && !ao.clearSelected) { ao.$apply(function () { A() }) } } } } } function X(ax) { if (ao.overrideSuggestions && !(ao.selectedObject && ao.selectedObject.originalObject === ao.searchStr)) { if (ax) { ax.preventDefault() } h.cancel(ap); B(); ar(ao.searchStr) } } function L(ay) { var ax = getComputedStyle(ay); return ay.offsetHeight + parseInt(ax.marginTop, 10) + parseInt(ax.marginBottom, 10) } function J() { return G.getBoundingClientRect().top + parseInt(getComputedStyle(G).maxHeight, 10) } function K() { return O[0].querySelectorAll(".angucomplete-row")[ao.currentIndex] } function M() { return K().getBoundingClientRect().top - (G.getBoundingClientRect().top + parseInt(getComputedStyle(G).paddingTop, 10)) } function N(ax) { G.scrollTop = G.scrollTop + ax } function av() { var ax = ao.results[ao.currentIndex]; if (ao.matchClass) { af.val(Q(ax.originalObject)) } else { af.val(ax.title) } } function ah(ax) { var aA = ad(ax); var ay = null; var az = null; if (aA === k && ao.results) { if (ao.currentIndex >= 0 && ao.currentIndex < ao.results.length) { ax.preventDefault(); ao.selectResult(ao.results[ao.currentIndex]) } else { X(ax); D() } ao.$apply() } else { if (aA === j && ao.results) { ax.preventDefault(); if ((ao.currentIndex + 1) < ao.results.length && ao.showDropdown) { ao.$apply(function () { ao.currentIndex++; av() }); if (ag) { ay = K(); if (J() < ay.getBoundingClientRect().bottom) { N(L(ay)) } } } } else { if (aA === p && ao.results) { ax.preventDefault(); if (ao.currentIndex >= 1) { ao.$apply(function () { ao.currentIndex--; av() }); if (ag) { az = M(); if (az < 0) { N(az - 1) } } } else { if (ao.currentIndex === 0) { ao.$apply(function () { ao.currentIndex = -1; af.val(ao.searchStr) }) } } } else { if (aA === o) { if (ao.results && ao.results.length > 0 && ao.showDropdown) { if (ao.currentIndex === -1 && ao.overrideSuggestions) { X() } else { if (ao.currentIndex === -1) { ao.currentIndex = 0 } ao.selectResult(ao.results[ao.currentIndex]); ao.$digest() } } else { if (ao.searchStr && ao.searchStr.length > 0) { X() } } } else { if (aA === l) { ax.preventDefault() } } } } } } function ac(ax) { return function (aA, aB, az, ay) { if (!aB && !az && !ay && aA.data) { aA = aA.data } ao.searching = false; al(R(an(aA), ao.remoteUrlDataField), ax) } } function ab(ay, aA, az, ax) { if (aA === 0 || aA === -1) { return } if (!aA && !az && !ax) { aA = ay.status } if (ao.remoteUrlErrorCallback) { ao.remoteUrlErrorCallback(ay, aA, az, ax) } else { if (console && console.error) { console.error("http error") } } } function B() { if (aa) { aa.resolve() } } function U(ay) { var ax = {}, az = ao.remoteUrl + encodeURIComponent(ay); if (ao.remoteUrlRequestFormatter) { ax = { params: ao.remoteUrlRequestFormatter(ay) }; az = ao.remoteUrl } if (!!ao.remoteUrlRequestWithCredentials) { ax.withCredentials = true } B(); aa = e.defer(); ax.timeout = aa.promise; b.get(az, ax).success(ac(ay)).error(ab) } function V(ax) { B(); aa = e.defer(); ao.remoteApiHandler(ax, aa.promise).then(ac(ax)).catch(ab) } function D() { ao.showDropdown = false; ao.results = []; if (G) { G.scrollTop = 0 } } function ae() { ao.showDropdown = I; ao.currentIndex = ao.focusFirst ? 0 : -1; ao.results = [] } function T(aC) { var ax, ay, aA, aD, aB = ao.searchFields.split(","), az = []; if (typeof ao.parseInput() !== "undefined") { aC = ao.parseInput()(aC) } for (ax = 0; ax < ao.localData.length; ax++){ ay = false; for (aA = 0; aA < aB.length; aA++){ aD = R(ao.localData[ax], aB[aA]) || ""; ay = ay || (aD.toString().toLowerCase().indexOf(aC.toString().toLowerCase()) >= 0) } if (ay) { az[az.length] = ao.localData[ax] } } return az } function C(az, ay, aA) { if (!aA) { return false } for (var ax in ay) { if (ay[ax].toLowerCase() === aA.toLowerCase()) { ao.selectResult(az); return true } } return false } function aq(ax) { if (!ax || ax.length < aj) { return } if (ao.localData) { ao.$apply(function () { var ay; if (typeof ao.localSearch() !== "undefined") { ay = ao.localSearch()(ax) } else { ay = T(ax) } ao.searching = false; al(ay, ax) }) } else { if (ao.remoteApiHandler) { V(ax) } else { U(ax) } } } function al(aC, aD) { var aA, ax, aB, aE, az, ay; if (aC && aC.length > 0) { ao.results = []; for (aA = 0; aA < aC.length; aA++){ if (ao.titleField && ao.titleField !== "") { aE = az = Q(aC[aA]) } ax = ""; if (ao.descriptionField) { ax = ay = R(aC[aA], ao.descriptionField) } aB = ""; if (ao.imageField) { aB = R(aC[aA], ao.imageField) } if (ao.matchClass) { az = S(aE, aD); ay = S(ax, aD) } ao.results[ao.results.length] = { title: az, description: ay, image: aB, originalObject: aC[aA] } } } else { ao.results = [] } if (ao.autoMatch && ao.results.length === 1 && C(ao.results[0], { title: aE, desc: ax || "" }, ao.searchStr)) { ao.showDropdown = false } else { if (ao.results.length === 0 && !H) { ao.showDropdown = false } else { ao.showDropdown = true } } } function at() { if (ao.localData) { al(ao.localData, "") } else { if (ao.remoteApiHandler) { V("") } else { U("") } } } ao.onFocusHandler = function () { if (ao.focusIn) { ao.focusIn() } if (aj === 0 && (!ao.searchStr || ao.searchStr.length === 0)) { ao.currentIndex = ao.focusFirst ? 0 : ao.currentIndex; ao.showDropdown = true; at() } }; ao.hideResults = function () { if (ak && (ak === ao.id + "_dropdown" || ak.indexOf("angucomplete") >= 0)) { ak = null } else { Z = h(function () { D(); ao.$apply(function () { if (ao.searchStr && ao.searchStr.length > 0) { af.val(ao.searchStr) } }) }, i); B(); if (ao.focusOut) { ao.focusOut() } if (ao.overrideSuggestions) { if (ao.searchStr && ao.searchStr.length > 0 && ao.currentIndex === -1) { X() } } } }; ao.resetHideResults = function () { if (Z) { h.cancel(Z) } }; ao.hoverRow = function (ax) { ao.currentIndex = ax }; ao.selectResult = function (ax) { if (ao.matchClass) { ax.title = Q(ax.originalObject); ax.description = R(ax.originalObject, ao.descriptionField) } if (ao.clearSelected) { ao.searchStr = null } else { ao.searchStr = ax.title } A(ax); D() }; ao.inputChangeHandler = function (ax) { if (ax.length < aj) { B(); D() } else { if (ax.length === 0 && aj === 0) { ao.searching = false; at() } } if (ao.inputChanged) { ax = ao.inputChanged(ax) } return ax }; if (ao.fieldRequiredClass && ao.fieldRequiredClass !== "") { am = ao.fieldRequiredClass } if (ao.minlength && ao.minlength !== "") { aj = parseInt(ao.minlength, 10) } if (!ao.pause) { ao.pause = t } if (!ao.clearSelected) { ao.clearSelected = false } if (!ao.overrideSuggestions) { ao.overrideSuggestions = false } if (ao.fieldRequired && F) { if (ao.initialValue) { Y(true) } else { Y(false) } } ao.inputType = y.type ? y.type : "text"; ao.textSearching = y.textSearching ? y.textSearching : x; ao.textNoResults = y.textNoResults ? y.textNoResults : w; I = ao.textSearching === "false" ? false : true; H = ao.textNoResults === "false" ? false : true; ao.maxlength = y.maxlength ? y.maxlength : r; af.on("keydown", ah); af.on("keyup", ai); an = z("remoteUrlResponseFormatter"); h(function () { var ax = getComputedStyle(G); ag = ax.maxHeight && ax.overflowY === "auto" }) } return { restrict: "EA", require: "^?form", scope: { selectedObject: "=", disableInput: "=", initialValue: "=", localData: "=", localSearch: "&", remoteUrlRequestFormatter: "=", remoteUrlRequestWithCredentials: "@", remoteUrlResponseFormatter: "=", remoteUrlErrorCallback: "=", remoteApiHandler: "=", id: "@", type: "@", placeholder: "@", remoteUrl: "@", remoteUrlDataField: "@", titleField: "@", descriptionField: "@", imageField: "@", inputClass: "@", pause: "@", searchFields: "@", minlength: "@", matchClass: "@", clearSelected: "@", overrideSuggestions: "@", fieldRequired: "=", fieldRequiredClass: "@", inputChanged: "=", autoMatch: "@", focusOut: "&", focusIn: "&", fieldTabindex: "@", inputName: "@", focusFirst: "@", parseInput: "&" }, templateUrl: function (z, y) { return y.templateUrl || v }, compile: function (B) { var A = c.startSymbol(); var y = c.endSymbol(); if (!(A === "{{" && y === "}}")) { var z = B.html().replace(/\{\{/g, A).replace(/\}\}/g, y); B.html(z) } return q } } }]) }));