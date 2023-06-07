sap.ui.define([
	"com/sap/kg4hana/kg4hanaui/controller/BaseController",
	"sap/ui/core/BusyIndicator",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageToast",
	"com/sap/kg4hana/kg4hanaui/model/formatter"
], function (BaseController, BusyIndicator, JSONModel, Filter, FilterOperator, MessageToast, formatter) {
	"use strict";
	return BaseController.extend("com.sap.kg4hana.kg4hanaui.controller.Main", {
		onInit: function () {
			this.oDataManager = this.getDataManager();
			this._oGlobalFilter = null;
			this._associationFilter = null;
			this.globalSelectedTokens = [];
			this.oVisiblityModel = new JSONModel({
				selectedEntity: false,
				noEntity: true
			});
			this.getView().setModel(this.oVisiblityModel, "VisiblityModel");
		},

		onNavGraphPress: function (oEvent) {
			//getRouter as defined in BaseController and then navTo route;
			var objRow = oEvent.getSource().getParent().getParent().getRowBindingContext().getObject();
			var objRowURI = formatter.shortenURI(objRow.URI);
			this.getRouter().navTo("graph", {
				URI: objRowURI
			});
		},

		onNavInfoPress: function (oEvent) {
			//getRouter as defined in BaseController and then navTo route;
			var objRow = oEvent.getSource().getParent().getParent().getRowBindingContext().getObject();
			var objRowURI = formatter.shortenURI(objRow.URI);
			this.getRouter().navTo("info", {
				URI: objRowURI
			});
		},

		onNavSQLPress: function (oEvent) {
			//getRouter as defined in BaseController and then navTo route;
			//	var objRow = oEvent.getSource().getParent().getParent().getRowBindingContext().getObject();
			//	var objRowURI = formatter.shortenURI(URI);

			this.getRouter().navTo("sql", {
				URI: URI
			});
		},

		onSearchPress: function (sQuery) {

			var oSearchInput = this.getView().byId("inpSearchByName").getValue();
			if (oSearchInput) {
				this.oVisiblityModel.setProperty("/selectedEntity", true);
				this.oVisiblityModel.setProperty("/noEntity", false);

				//Fetch JSON from the Data Manager Class.
				var oEntityDataModel = this.oDataManager.onSearchArtifactsByName(oSearchInput);

				//get the table reference
				var oTable = this.getView().byId("table");
				//set the dynamic JSON model to this table.
				this.getView().setModel(oEntityDataModel, "EntityModel");

				/*		this.getView().byId("inpSearchByName").setValue(oSearchInput);

						var aFilters = [];
						var filter = new Filter("name", FilterOperator.Contains, oSearchInput);
						aFilters.push(filter);*/

				// update list binding
				//	var oList = this.getView().byId("table");
				/*		var oBinding = oTable.getBinding("items");
						oBinding.filter(aFilters, "Application");*/

			} else {
				this.oVisiblityModel.setProperty("/selectedEntity", false);
				this.oVisiblityModel.setProperty("/noEntity", true);
			}
		},

		onEntityRowSelectionChange: function (oEvent) {
			debugger;
			var oTable = oEvent.getSource();
			var bindedEntityList = oTable.getBinding().oList;
			var clickedRowIndex = oEvent.getParameters().rowIndex;
			var selectedName = bindedEntityList[clickedRowIndex].name;
			var selectedURI = bindedEntityList[clickedRowIndex].URI;
			this._addToSeletedEntityArray(selectedURI, selectedName);
			oTable.setSelectedIndex(-1);
			this._renderTokensToMultiInput();
		},

		_renderTokensToMultiInput: function () {
			var tokenArray = [];
			var tokenKeys = Object.keys(this.globalSelectedTokens);
			var oMultuInputEntity = this.getView().byId("multiInputEntity");
			tokenKeys.forEach(function (selectedTokenKey) {
				tokenArray.push(new sap.m.Token({
					text: this.globalSelectedTokens[selectedTokenKey],
					key: selectedTokenKey,
					delete: function (oEvent) {
						this.onEntityTokenDeletePress(oEvent);
					}.bind(this)
				}));
			}.bind(this));
			oMultuInputEntity.setTokens(tokenArray);

			this.getView().byId("generateSQL").setEnabled((tokenKeys.length > 0));
		},

		_addToSeletedEntityArray: function (URI, name) {
			if (this.globalSelectedTokens.hasOwnProperty(URI)) {
				//MessageToast.show(this.getResourceBundle().getText("EntityAlreadyExist"));
			}
			this.globalSelectedTokens[URI] = name;
		},

		_removeFromSeletedEntityArray: function (URI) {
			if (this.globalSelectedTokens.hasOwnProperty(URI)) {
				delete this.globalSelectedTokens[URI];
			}
		},

		onEntityTokenDeletePress: function (oEvent) {
			var oToken = oEvent.getSource();
			var selectedURI = oToken.getKey();
			this._removeFromSeletedEntityArray(selectedURI);
			this._renderTokensToMultiInput();
		},

		showBusyIndicator: function (delay) {
			setTimeout(function () {
				BusyIndicator.show(0);
				setTimeout(function () {
					BusyIndicator.hide();
				}, delay);
			}, delay);
		},
		_filter: function () {
			var oFilter = null;

			if (this._oGlobalFilter && this._associationFilter) {
				oFilter = new Filter([this._oGlobalFilter, this._associationFilter], true);
			} else if (this._oGlobalFilter) {
				oFilter = this._oGlobalFilter;
			} else if (this._associationFilter) {
				oFilter = this._associationFilter;
			}
			this.byId("table").getBinding().filter(oFilter, "Application");
		},
		pressIncludeAssociation: function (oEvent) {
			var checkBox = oEvent.getSource();
			if (checkBox && checkBox.getSelected && (checkBox.getSelected() !== true)) {
				this._associationFilter = new Filter("isAssociation", FilterOperator.Contains, " ");
			} else {
				this._associationFilter = null;
			}
			this._filter();
		},
		filterGlobally: function (oEvent) {
			var sQuery = oEvent.getParameter("query");
			this._oGlobalFilter = null;

			if (sQuery) {
				this._oGlobalFilter = new Filter([
					new Filter("URI", FilterOperator.Contains, sQuery),
					new Filter("name", FilterOperator.Contains, sQuery)
				], false);
			}

			this._filter();
		},
		clearAllFilters: function (oEvent) {
			var oTable = this.byId("table");

			var oUiModel = this.getView().getModel("ui");
			oUiModel.setProperty("/globalFilter", "");
			oUiModel.setProperty("/availabilityFilterOn", false);

			this._oGlobalFilter = null;
			this._filter();

			var aColumns = oTable.getColumns();
			for (var i = 0; i < aColumns.length; i++) {
				oTable.filter(aColumns[i], null);
			}
		},
		toggleAvailabilityFilter: function (oEvent) {
			this.byId("availability").filter(oEvent.getParameter("pressed") ? "X" : "");
		},

		formatAvailableToObjectState: function (bAvailable) {
			return bAvailable ? "Success" : "Error";
		}
	});
});