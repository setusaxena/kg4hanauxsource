sap.ui.define([
	"com/sap/kg4hana/kg4hanaui/controller/BaseController",
	"com/sap/kg4hana/kg4hanaui/model/formatter",
	"sap/suite/ui/commons/networkgraph/ActionButton",
	"sap/suite/ui/commons/networkgraph/Node",
	"sap/m/library",
	"sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel"
], function (BaseController, formatter, ActionButton, Node, mobileLibrary, Fragment, JSONModel) {
	"use strict";
	return BaseController.extend("com.sap.kg4hana.kg4hanaui.controller.Graph", {
		formatter: formatter,
		onInit: function () {
			this.oDataManager = this.getDataManager();
			//object match handler
			this.getRouter().getRoute("graph").attachPatternMatched(this._onObjectMatched, this);
			this.defaultMaxDepth = 3;
			this.defaultWithAssociation = true;
			this._addCustomControlsToToolbar();
		},

		_onObjectMatched: function (oEvent) {
			var sURI = oEvent.getParameter("arguments").URI;
			this._intializeGraphtPage(sURI);
		},

		_intializeGraphtPage: function (sURI, iMaxDepth, bWithAssociation) {
			var oGraphModel = this.oDataManager.onReadCDSStackByURI(sURI, iMaxDepth, bWithAssociation);
			this.getView().setModel(oGraphModel);
			//start with the main key URI for the page
			var STARTING_PROFILE = sURI;

			this._sTopSupervisor = STARTING_PROFILE;
			this._mExplored = [this._sTopSupervisor];
			//before layouting the intial set is increased to universal set

			this._graph = this.byId("graph");
			//Custom Label for Tables / CDS Views
			this._graph.setCustomLegendLabel({
				label: "CDS View",
				status: "Warning"
			});
			this._graph.setCustomLegendLabel({
				label: "ABAP Table",
				status: "Success"
			});

			//Custom Label for Associations / Joins
			this._graph.setCustomLegendLabel({
				label: "Association",
				status: "Standard",
				isNode: false
			});
			this._graph.setCustomLegendLabel({
				label: "Join",
				status: "Information",
				isNode: false
			});

			//this._setFilter();

			this._graph.attachEvent("beforeLayouting", function (oEvent) {

				//lets make the explored set as universal set
				if (this._graph.getNodes && (this._graph.getNodes().length !== this._mExplored.length)) {
					this._graph.getNodes().forEach(function (oNode) {
						this._mExplored.push(oNode.getKey());
					}.bind(this));
				}

				// nodes are not rendered yet (bOutput === false) so their invalidation triggers parent (graph) invalidation
				// which results in multiple unnecessary loading
				this._graph.preventInvalidation(true);
				this._graph.getNodes().forEach(function (oNode) {
					var oExpandButton, oDetailButton, oUpOneLevelButton,
						bIsLeaf = this._getCustomDataValue(oNode, "isLeaf"),
						sSupervisor;

					oNode.removeAllActionButtons();

					if (bIsLeaf) {
						// Lead Node - hide expand buttons
						oNode.setShowExpandButton(false);
					} else {
						if (this._mExplored.indexOf(oNode.getKey()) === -1) {
							// managers with team but not yet expanded
							// we create custom expand button with dynamic loading
							oNode.setShowExpandButton(false);

							// this renders icon marking collapse status
							oNode.setCollapsed(true);
							oExpandButton = new ActionButton({
								title: "Expand",
								icon: "sap-icon://sys-add",
								press: function () {
									oNode.setCollapsed(false);
									this._loadMore(oNode.getKey());
								}.bind(this)
							});
							oNode.addActionButton(oExpandButton);
						} else {
							// manager with already loaded data - default expand button
							oNode.setShowExpandButton(true);
						}
					}

					// add detail link -> custom popover
					oDetailButton = new ActionButton({
						title: "Detail",
						icon: "sap-icon://detail-view",
						press: function (oEvent) {
							this._openDetail(oNode, oEvent.getParameter("buttonElement"));
						}.bind(this)
					});
					oNode.addActionButton(oDetailButton);

					// if current user is root we can add 'up one level'
					if (oNode.getKey() === this._sTopSupervisor) {
						sSupervisor = this._getCustomDataValue(oNode, "supervisor");
						if (sSupervisor) {
							oUpOneLevelButton = new ActionButton({
								title: "Up one level",
								icon: "sap-icon://arrow-top",
								press: function () {
									var aSuperVisors = oNode.getCustomData().filter(function (oData) {
											return oData.getKey() === "supervisor";
										}),
										sSupervisor = aSuperVisors.length > 0 && aSuperVisors[0].getValue();

									this._loadMore(sSupervisor);
									this._sTopSupervisor = sSupervisor;
								}.bind(this)
							});
							oNode.addActionButton(oUpOneLevelButton);
						}
					}
				}, this);
				this._graph.preventInvalidation(false);
				//this._setFilter();
			}.bind(this));

		},

		_addCustomControlsToToolbar: function () {
			var oGraph = this.getView().byId("graph");
			var oToolbar = oGraph.getToolbar();
			var ButtonType = mobileLibrary.ButtonType;

			/*
			 * Refresh button - add to toolbar
			 */
			oToolbar.insertContent(new sap.m.Button({
				id: "btnRefreshMaxDepth",
				type: ButtonType.Transparent,
				icon: "sap-icon://refresh",
				press: this.refreshGraph.bind(oGraph)
			}), 0);

			/*
			 * Slider - add to toolbar
			 */
			oToolbar.insertContent(new sap.m.Slider({
				id: "defaultMaxDepthSlider",
				value: 3,
				mix: 0,
				max: 10,
				showAdvancedTooltip: true,
				showHandleTooltip: false,
				inputsAsTooltips: true,
				width: "250px",
				change: this.sliderMoved.bind(this)
			}), 0);

			/*
			 * Title for depth reset
			 */
			var searchDepthLabel = this.getResourceBundle().getText("searchDepth", ["3"]);
			oToolbar.insertContent(new sap.m.Label({
				id: "titleSearchDepth",
				text: searchDepthLabel
			}), 0);
		},

		sliderMoved: function (oEvent) {
			sap.ui.getCore().byId("btnRefreshMaxDepth").setVisible(true);
			var sliderValue = sap.ui.getCore().byId("defaultMaxDepthSlider").getValue();
			sap.ui.getCore().byId("titleSearchDepth").setText(this.getResourceBundle().getText("searchDepth", [sliderValue.toString()]));
		},

		refreshGraph: function () {
			//this.invalidate();
			sap.ui.getCore().byId("btnRefreshMaxDepth").setVisible(false);
		},

		onNavigateBack: function () {
			this.onNavBack();
		},

		// Below methods are borrowed from Graph Implementation sample code
		_setFilter: function () {
			var aNodesCond = [];
			var aLinesCond = [];
			var fnAddBossCondition = function (sBoss) {
				aNodesCond.push(new sap.ui.model.Filter({
					path: 'URI',
					operator: sap.ui.model.FilterOperator.EQ,
					value1: sBoss
				}));

				aNodesCond.push(new sap.ui.model.Filter({
					path: 'parent',
					operator: sap.ui.model.FilterOperator.EQ,
					value1: sBoss
				}));
			};

			var fnAddLineCondition = function (sLine) {
				aLinesCond.push(new sap.ui.model.Filter({
					path: "from",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: sLine
				}));
			};

			this._mExplored.forEach(function (oItem) {
				fnAddBossCondition(oItem);
				fnAddLineCondition(oItem);
			});

			this._graph.getBinding("nodes").filter(new sap.ui.model.Filter({
				filters: aNodesCond,
				and: false
			}));

			this._graph.getBinding("lines").filter(new sap.ui.model.Filter({
				filters: aLinesCond,
				and: false
			}));
		},
		_getCustomDataValue: function (oNode, sName) {
			var aItems = oNode.getCustomData().filter(function (oData) {
				return oData.getKey() === sName;
			});

			return aItems.length > 0 && aItems[0].getValue();
		},
		_openDetail: function (oNode, oButton) {
			var sTeamSize = this._getCustomDataValue(oNode, "team");

			if (!this._oQuickView) {
				Fragment.load({
					name: "com.sap.kg4hana.kg4hanaui.view.fragment.TooltipFragment",
					type: "XML"
				}).then(function (oFragment) {
					this._oQuickView = oFragment;
					this._oQuickView.setModel(new JSONModel({
						icon: this.formatter.formatGraphNodeIcon(this._getCustomDataValue(oNode, "type")),
						avatarColor: this.formatter.formatAvatarColor(this._getCustomDataValue(oNode, "type")),
						entityTypeDesc: this._getTitleForEntity(this._getCustomDataValue(oNode, "type")),
						title: oNode.getDescription(),
						name: this._getCustomDataValue(oNode, "name"),
						URI: this._getCustomDataValue(oNode, "URI"),
						lob: this._getCustomDataValue(oNode, "lob"),
						type: this._getCustomDataValue(oNode, "type"),
						description: this._getCustomDataValue(oNode, "description"),
						applicationArea: this._getCustomDataValue(oNode, "applicationArea"),
						businessDocURL: this._getCustomDataValue(oNode, "businessDocURL"),
						docURL: this._getCustomDataValue(oNode, "docURL")
					}));
					setTimeout(function () {
						this.getView().addDependent(this._oQuickView);
						this._oQuickView.openBy(oButton);
					}.bind(this), 0);
				}.bind(this));
			} else {
				this._oQuickView.setModel(new JSONModel({
					icon: this.formatter.formatGraphNodeIcon(this._getCustomDataValue(oNode, "type")),
					avatarColor: this.formatter.formatAvatarColor(this._getCustomDataValue(oNode, "type")),
					entityTypeDesc: this._getTitleForEntity(this._getCustomDataValue(oNode, "type")),
					title: oNode.getDescription(),
					name: this._getCustomDataValue(oNode, "name"),
					URI: this._getCustomDataValue(oNode, "URI"),
					lob: this._getCustomDataValue(oNode, "lob"),
					type: this._getCustomDataValue(oNode, "type"),
					description: this._getCustomDataValue(oNode, "description"),
					applicationArea: this._getCustomDataValue(oNode, "applicationArea"),
					businessDocURL: this._getCustomDataValue(oNode, "businessDocURL"),
					docURL: this._getCustomDataValue(oNode, "docURL")
				}));

				setTimeout(function () {
					this._oQuickView.openBy(oButton);
				}.bind(this), 0);
			}
		},
		
		_getTitleForEntity: function (entityType) {
			switch (entityType) {
			case "CDSView":
				 return this.getResourceBundle().getText("CDSView");
				break;
			case "ABAPTable":
				return this.getResourceBundle().getText("ABAPTable");
				break;
			default:
				return "Unkown Enity";
			}
		},
		
		_loadMore: function (sName) {
			this._graph.deselect();
			this._mExplored.push(sName);
			this._graph.destroyAllElements();
			this._setFilter();
		},
		onExit: function () {
			if (this._oQuickView) {
				this._oQuickView.destroy();
			}
		},
		suggest: function (oEvent) {
			var aSuggestionItems = [],
				aItems = this.getView().getModel().getData().nodes,
				aFilteredItems = [],
				sTerm = oEvent.getParameter("term");

			sTerm = sTerm ? sTerm : "";

			// //TODO check if sTerm is empty then return the whole tree again.
			// if(sTerm===""){
			// 	sTerm = "I_OPERATIONALACCTGDOCITEM";
			// }

			aFilteredItems = aItems.filter(function (oItem) {
				var sName = oItem.URI ? oItem.URI : "";
				return sName.toLowerCase().indexOf(sTerm.toLowerCase()) !== -1; //Sub string matches it
			});

			// 	aFilteredItems = aItems.filter(function (oItem) {
			// 	var sName = oItem.name ? oItem.name : "";
			// 	return sName.toLowerCase().indexOf(sTerm.toLowerCase()) !== -1;
			// });

			aFilteredItems.sort(function (oItem1, oItem2) {
				var sName = oItem1.URI ? oItem1.URI : "";
				return sName.localeCompare(oItem2.URI);
			}).forEach(function (oItem) {
				aSuggestionItems.push(new sap.m.SuggestionItem({
					key: oItem.URI,
					text: oItem.name
				}));
			});

			this._graph.setSearchSuggestionItems(aSuggestionItems);
			oEvent.bPreventDefault = true;
		},
		linePress: function (oEvent) {
			oEvent.bPreventDefault = true;
		},
		search: function (oEvent) {
			var sKey = oEvent.getParameter("key");

			if (sKey) {
				this._mExplored = [sKey];
				this._sTopSupervisor = sKey;
				this._graph.destroyAllElements();
				this._setFilter();

				oEvent.bPreventDefault = true;
			}

			//TODO implement clear button as oEvent info will have clearButtonPressed
			debugger;
		}
	});
});