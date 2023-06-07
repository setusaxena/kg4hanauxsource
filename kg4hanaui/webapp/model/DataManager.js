sap.ui.define([
	"sap/ui/base/Object",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Object, Filter, FilterOperator) {
	"use strict";
	var DataManager = Object.extend("com.sap.kg4hana.kg4hanaui.model.DataManager", {
		constructor: function (oComponent, oDataModel, oResourceBundle) {
			this._oComponent = oComponent;
			this._oDataModel = oDataModel;
			this._oResourceBundle = oResourceBundle;
		},

		/**
		 *	Start of Search CDS Arctefacts by Query / Name
		 **/
		onSearchArtifactsByName: function (sQuery) {
			return this._fetchSearchArtifactsByName(sQuery);
		},

		_fetchSearchArtifactsByName: function (sQuery) {

			if (sQuery === "I_OPERATIONALACCTGDOCITEM") {

				var jsonCDSModel = new sap.ui.model.json.JSONModel(sap.ui.require.toUrl(
					"com/sap/kg4hana/kg4hanaui/model/OUTPUT_search_business_entities_4.json"));
				return jsonCDSModel;
			} else if (sQuery == "BankAccountApplication") {
				var jsonCDSModel = new sap.ui.model.json.JSONModel(sap.ui.require.toUrl(
					"com/sap/kg4hana/kg4hanaui/model/OUTPUT_search_business_entities_2.json"));
				return jsonCDSModel;
			} else if (sQuery == "PurchaseOrder") {
				var jsonCDSModel = new sap.ui.model.json.JSONModel(sap.ui.require.toUrl(
					"com/sap/kg4hana/kg4hanaui/model/OUTPUT_search_business_entities_3.json"));
				return jsonCDSModel;
			} else {
				var jsonCDSModel = new sap.ui.model.json.JSONModel(sap.ui.require.toUrl("com/sap/kg4hana/kg4hanaui/model/CDSModel.json"));

				//TODO API Call to perform search via business entities or entity name goes here
				//Hardcoded model for testing via some stub data

				return jsonCDSModel;
			}
		},
		/**
		 *	End of Search CDS Arctefacts by Query / Name
		 **/

		/**
		 *	Start of Search CDS Arctefacts by Query / Name
		 **/
		onReadCDSStackByURI: function (sURI, iMaxDepth, bWithAssociation) {
			return this._fetchCDSGraphByURI(sURI, iMaxDepth, bWithAssociation);
		},

		_fetchCDSGraphByURI: function (sURI, iMaxDepth, bWithAssociation) {
			//TODO API Call to fetch graphInfo relatedto CDS/ABAP by URI goes here
			//Hardcoded model for testing via some stub data
			var jsonGraphModel = new sap.ui.model.json.JSONModel();
			jsonGraphModel.setSizeLimit(655360);
			//	jsonGraphModel.loadData(sap.ui.require.toUrl("com/sap/kg4hana/kg4hanaui/model/OUTPUT_cds_view_hierarchy.json"));
			//	jsonGraphModel.loadData(sap.ui.require.toUrl("com/sap/kg4hana/kg4hanaui/model/GraphModel.json"));
			jsonGraphModel.loadData(sap.ui.require.toUrl("com/sap/kg4hana/kg4hanaui/model/ComplexGraphModel.json"));
			//jsonGraphModel.loadData(sap.ui.require.toUrl("com/sap/kg4hana/kg4hanaui/model/DemoGraphModel.json"));	
			//var jsonGraphModel = new sap.ui.model.json.JSONModel(sap.ui.require.toUrl("com/sap/kg4hana/kg4hanaui/model/ComplexGraphModel.json"));
			return jsonGraphModel;
		},
		/**
		 *	End of Search CDS Arctefacts by Query / Name
		 **/

		/**
		 *	Start of Search CDS Arctefacts by Query / Name
		 **/
		onReadObjectInfoByURI: function (sURI) {
			return this._fetchObjectInfoByURI(sURI);
		},

		_fetchObjectInfoByURI: function (sURI) {
			//TODO API Call to fetch graphInfo relatedto CDS/ABAP by URI goes here
			//Hardcoded model for testing via some stub data
			//	var jsonObjectInfoModel = new sap.ui.model.json.JSONModel(sap.ui.require.toUrl("com/sap/kg4hana/kg4hanaui/model/InfoModel.json"));
			var jsonObjectInfoModel = new sap.ui.model.json.JSONModel(sap.ui.require.toUrl(
				"com/sap/kg4hana/kg4hanaui/model/OUTPUT_cds_view_abap_table_properties.json"));
			return jsonObjectInfoModel;
		},
		/**
		 *	Start of Search SQL Artifacts by Query / Name 
		 **/
		onReadObjectSQLByURI: function (sURI) {
			return this._fetchObjectSQLByURI(sURI);
		},
		_fetchObjectSQLByURI: function (sURI) {
			//TODO API Call to fetch graphInfo relatedto CDS/ABAP by URI goes here
			//Hardcoded model for testing via some stub data
			var jsonObjectSQLModel = new sap.ui.model.json.JSONModel(sap.ui.require.toUrl("com/sap/kg4hana/kg4hanaui/model/SQLModel.json"));
			return jsonObjectSQLModel;
		}

	});
	return DataManager;
});