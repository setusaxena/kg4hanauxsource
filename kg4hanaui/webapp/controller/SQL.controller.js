sap.ui.define([
	"com/sap/kg4hana/kg4hanaui/controller/BaseController",
	"com/sap/kg4hana/kg4hanaui/model/formatter"
], function (BaseController, formatter) {
	"use strict";
	return BaseController.extend("com.sap.kg4hana.kg4hanaui.controller.SQL", {
		formatter: formatter,
		onInit: function () {
			this.oDataManager = this.getDataManager();
			//object match handler
			this.getRouter().getRoute("sql").attachPatternMatched(this._onObjectMatched, this);
		},

		_onObjectMatched: function (oEvent) {
			var sURI = oEvent.getParameter("arguments").URI;
			this._intializeObjectPage(sURI);
		},
		_intializeObjectPage: function (sURI) {
			var oObjectSqlModel = this.oDataManager.onReadObjectSQLByURI(sURI);
			this.getView().setModel(oObjectSqlModel, "oObjectSqlModel");
		},
		onNavigateBack: function () {
			debugger;
			this.onNavBack();
		}
	});
});