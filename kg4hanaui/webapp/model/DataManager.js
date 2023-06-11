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
		onSearchArtifactsByName: function (sQuery, successCallback, errorCallback) {
			return this._fetchSearchArtifactsByName(sQuery, successCallback, errorCallback);
		},

		_fetchSearchArtifactsByName: function (sQuery, successCallback, errorCallback) {
			debugger;

			if (sQuery) {
				$.ajax({
					type: "GET",
					url: "/entities/?searchObject=" + sQuery,
					dataType: 'json',
					async: true,
					success: function (data) {
						debugger;
						if (Array.isArray(data) && data.length === 0) {
							errorCallback("NoRecordsFound");
						}
						else {
							var transformedData = this._adapterFetchSearchArtifactsByName(data);
							successCallback(transformedData);
						}
					}.bind(this),
					error: function (e) {
						debugger;
						errorCallback("UnableToReadquery"); //Implement i18n later Please DO NOT put text hrere
					}
				});
			} else {
				errorCallback("NoInput");//Implement i18n later Please DO NOT put text hrere
			}

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

		_adapterFetchSearchArtifactsByName: function (inputArraRows) {
			var outputArrayRows = [];
			inputArraRows.forEach(function (row) {
				if (row && row.semanticKeys && Array.isArray(row.semanticKeys)) {
					var semanticKeysCollection = [];
					row.semanticKeys.forEach(function (semanticKeyObj) {
						semanticKeysCollection.push(semanticKeyObj.name);
					});
					row.semanticKeys = semanticKeysCollection.join(" , ");
					outputArrayRows.push(row)
				}
			});
			return outputArrayRows;
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
		},
		onReadBaseTablesByURI : function(sURI,successCallback, errorCallback)
		{
			return this._fetchBaseTablesByURI(sURI, successCallback, errorCallback);
		},
		_fetchBaseTablesByURI : function(sURI,successCallback,errorCallback)
		{
			debugger;

			if (sURI) {
				$.ajax({
					type: "GET",
					//url: "/apiEndPoint/entities?searchObject=" + sQuery,
					url: "/apiEndPoint/cdsView/baseTable?selectedObject="+ sURI,					
					dataType: 'json',
					async: true,
					success: function (data) {
						debugger;
						if (Array.isArray(data) && data.length === 0) {
							errorCallback("NoRecordsFound");
						}
						else {
							var transformedData = this._adapterFetchSearchArtifactsByName(data);
							successCallback(transformedData);
						}
					}.bind(this),
					error: function (e) {
						debugger;
						errorCallback("UnableToReadquery"); //Implement i18n later Please DO NOT put text hrere
					}
				});
			} else {
				errorCallback("NoInput");//Implement i18n later Please DO NOT put text hrere
			}
		}
	});
	return DataManager;
});