sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"com/sap/kg4hana/kg4hanaui/model/models",
	"com/sap/kg4hana/kg4hanaui/model/DataManager"
], function (UIComponent, Device, models, DataManager) {
	"use strict";

	return UIComponent.extend("com.sap.kg4hana.kg4hanaui.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			//initialize  data manager
			this.initUtilities();

			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
		},
		initUtilities: function () {
			//fecth the resrouce bundle reference.
			var oResourceBundle = this.getModel("i18n").getResourceBundle();
			this.oDataManager = new DataManager(this, this.getModel(), oResourceBundle);
		},
		getDataManager: function () {
			return this.oDataManager;
		}
	});
});