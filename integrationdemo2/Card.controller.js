sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (Controller, JSONModel, MessageToast) {
    "use strict";

    return Controller.extend("ns.integrationdemo2.Card", {

        onInit: function () {
            var oModel = new JSONModel({
                persons: [],
                loading: false,
                error: ""
            });

            this.getView().setModel(oModel, "northwind");

            oModel.attachRequestCompleted(function (oEvent) {
                oModel.setProperty("/loading", false);

                if (!oEvent.getParameter("success")) {
                    oModel.setProperty("/persons", []);
                    oModel.setProperty(
                        "/error",
                        "Request failed. Check the browser Network tab."
                    );
                    console.error("Request failed:", oEvent.getParameters());
                    return;
                }

                var oData = oModel.getData();
                var aPersons = Array.isArray(oData.value)
                    ? oData.value
                    : [];

                console.log("API response:", oData);
                console.log("Persons:", aPersons);

                oModel.setProperty("/persons", aPersons);
                oModel.setProperty(
                    "/error",
                    aPersons.length ? "" : "The API returned no persons."
                );
            });

            this._loadPersons();
        },

        _loadPersons: function () {
            var oModel = this.getView().getModel("northwind");

            oModel.setProperty("/loading", true);
            oModel.setProperty("/error", "");

            oModel.loadData(
                "https://services.odata.org/V3/OData/OData.svc/Persons?$format=json",
                null,
                true,
                "GET"
            );
        },

        onRefreshPress: function () {
            this._loadPersons();
            MessageToast.show("Refreshing persons...");
        }

    });
});