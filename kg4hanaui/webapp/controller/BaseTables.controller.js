sap.ui.define([
	"com/sap/kg4hana/kg4hanaui/controller/BaseController",
	"com/sap/kg4hana/kg4hanaui/model/formatter"
], function (BaseController,formatter) {
	"use strict";
	return BaseController.extend("com.sap.kg4hana.kg4hanaui.controller.BaseTables", {
		formatter: formatter,
		onInit: function () {
			this.oDataManager = this.getDataManager();
			//object match handler
			this.getRouter().getRoute("info").attachPatternMatched(this._onObjectMatched, this);
		},

		_onObjectMatched: function (oEvent) {
			var sURI = oEvent.getParameter("arguments").URI;
			this.sURI = sURI;
			this._intializeObjectPage(sURI);
		},

		_intializeObjectPage: function (sURI) {
			var oObjectInfoModel = this.oDataManager.onReadObjectInfoByURI(sURI);
			this.getView().setModel(oObjectInfoModel, "oObjectInfoModel");
		},
		
		onNavGraphPress: function(){
			this.getRouter().navTo("graph", {
				URI: this.sURI
			});
		},

		onNavigateBack: function () {
			this.onNavBack();
		}
	});
});