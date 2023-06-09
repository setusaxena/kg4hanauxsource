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
			this.getRouter().getRoute("childTables").attachPatternMatched(this._onObjectMatched, this);
		},

		_onObjectMatched: function (oEvent) {
			var sURI = oEvent.getParameter("arguments").URI;
			this.sURI = sURI;
			this._intializeObjectPage(sURI);
		},

		_intializeObjectPage: function (sURI) {
			var oTable = this.getView().byId("baseTable");
			var oObjPageSection = this.getView().byId("baseTableObjPageSection");

			var onQueryLookupSuccess = function (data) {
				debugger;
			/*	if (Array.isArray(data) && data.length !== 0) {
					debugger;
					oObjPageSection.setTitle(this.getResourceBundle().getText("SearchResultsLabel", [data.length.toString(), oSearchInput]));
				} */
				var oChildTablesModel = new sap.ui.model.json.JSONModel(data);
				//set the dynamic JSON model to this table.
				this.getView().setModel(oChildTablesModel, "oChildTablesModel");
				oTable.setEnableBusyIndicator(false);
			}.bind(this);

			var onQueryLookupError = function (errorText) {
				MessageToast.show(errorText);
				oTable.setEnableBusyIndicator(false);
				//oObjPageSection.setTitle(this.getResourceBundle().getText("SearchResultNotFound"));
			}.bind(this);

			oTable.setEnableBusyIndicator(true);
			oObjPageSection.setTitle("");

			var oChildTablesModel = this.oDataManager.onReadBaseTablesByURI(sURI,onQueryLookupSuccess, onQueryLookupError);
			this.getView().setModel(oChildTablesModel, "oChildTablesModel");
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