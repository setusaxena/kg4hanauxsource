/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"com/sap/kg4hana/kg4hanaui/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});