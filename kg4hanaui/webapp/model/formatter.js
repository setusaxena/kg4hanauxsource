sap.ui.define([], function () {
	"use strict";

	return {
		formatGraphNodeColor: function (entityType) {
			switch (entityType) {
			case "CDSView":
				return "Warning";
				break;
			case "ABAPTable":
				return "CustomTable";
				break;
			default:
				return "Error";
			}
		},
		formatGraphNodeIcon: function (entityType) {
			switch (entityType) {
			case "CDSView":
				return "sap-icon://chart-table-view";
				break;
			case "ABAPTable":
				return "sap-icon://database";
				break;
			case "SQLTable":
				return "sap-icon://database";
				break;
			default:
				return "";
			}
		},
		formatGraphLineColor: function (connectionToParent) {
			switch (connectionToParent) {
			case "association":
				return "Standard";
				break;
			case "join":
				return "CustomJoin";
				break;
			default:
				return "Error";
			}
		},
		formatAvatarColor: function (entityType) {
			switch (entityType) {
			case "CDSView":
				return "Accent1";
				break;
			case "ABAPTable":
				return "Accent8";
				break;
			case "SQLTable":
				return "Accent6";
				break;
			default:
				return "Accent2";
			}
		},
		
		formatButtonColorForEntity: function (entityType) {
			switch (entityType) {
			case "CDSView":
				return "Attention";
				break;
			case "ABAPTable":
				return "Accept";
				break;
			case "SQLTable":
				return "Accept";
				break;
			default:
				return "Emphasized";
			}
		},
		
		shortenURI: function (longURI) {
			var shortURI = "";
			var _baseURIPrefix = "http://schema.sap.com/"; //22 char long
			var cdsURIPrefix = _baseURIPrefix + "CDSView/"; //8char long 
			var tableURIPrefix = _baseURIPrefix + "ABAPTable/"; //10char long
			if (longURI.indexOf(cdsURIPrefix) > -1) {
				return longURI.substring(longURI.indexOf(cdsURIPrefix) + 30);
			} else if (longURI.indexOf(tableURIPrefix) > -1) {
				return longURI.substring(longURI.indexOf(tableURIPrefix) + 32);
			} else {
				return longURI;
			}

		}
	};
});