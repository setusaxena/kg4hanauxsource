sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], function (Controller, History) {
	"use strict";
	return Controller.extend("com.sap.kg4hana.kg4hanaui.controller.BaseController", {
		
		getModel : function (sName) {
			return this.getView().getModel(sName);
		},

		setModel : function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		getResourceBundle : function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},
		
		getDataManager: function () {
			return this.getOwnerComponent().getDataManager();
		},
		
		getRouter: function () { //return the router instance
			return sap.ui.core.UIComponent.getRouterFor(this);
		},
		
		onNavBack: function (oEvent) { //load the previous has URL from browser
			var oHistory, sPreviousHash; //get the history instance
			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash(); //read the last hash value

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
				//take the application to last items in the history hash
			} else {
				this.getRouter().navTo("appHome", {}, true /*no history*/ );
				//loadthe default view if there is no hash info
			}
		}
	});
});