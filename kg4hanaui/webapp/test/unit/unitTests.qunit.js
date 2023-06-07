/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"comsapkg4hana/kg4hanaui/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
