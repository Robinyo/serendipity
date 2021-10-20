"use strict";
(self["webpackChunkfrontend"] = self["webpackChunkfrontend"] || []).push([["projects_party-lib_src_lib_party-lib_module_ts"],{

/***/ 9259:
/*!****************************************************************!*\
  !*** ./projects/party-lib/src/lib/adapters/contact.adapter.ts ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ContactAdapter": () => (/* binding */ ContactAdapter)
/* harmony export */ });
/* harmony import */ var _models_contact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../models/contact */ 2973);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 2316);
/* harmony import */ var utils_lib__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! utils-lib */ 6549);



class ContactAdapter {
    constructor(logger) {
        this.logger = logger;
        this.logger.info('ContactAdapter initialised');
    }
    adapt(item) {
        // this.logger.info('item: ' + JSON.stringify(item, null, 2));
        const contact = new _models_contact__WEBPACK_IMPORTED_MODULE_0__.Contact(item.party, item.name, item.sex, item.email, item.phoneNumber, item.photoUrl, item.electorate, item.dateOfBirth, item.placeOfBirth);
        // https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding
        contact.id = btoa(item.id);
        contact.photoUrl = 'http://localhost:30001/' + item.photoUrl;
        if (item.party.addresses && item.party.addresses.length) {
            contact.party.addresses = contact.party.addresses.concat(item.party.addresses);
        }
        if (item.party.roles && item.party.roles.length) {
            contact.party.roles = contact.party.roles.concat(item.party.roles);
            contact.organisation.id = btoa(contact.party.roles[0].reciprocalPartyId);
            contact.organisation.displayName = contact.party.roles[0].reciprocalPartyName;
            contact.organisation.email = contact.party.roles[0].reciprocalPartyEmail;
            contact.organisation.phoneNumber = contact.party.roles[0].reciprocalPartyPhoneNumber;
        }
        // this.logger.info('contact: ' + JSON.stringify(contact, null, 2));
        return contact;
    }
}
ContactAdapter.ɵfac = function ContactAdapter_Factory(t) { return new (t || ContactAdapter)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](utils_lib__WEBPACK_IMPORTED_MODULE_2__.LoggerService)); };
ContactAdapter.ɵprov = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({ token: ContactAdapter, factory: ContactAdapter.ɵfac, providedIn: 'root' });


/***/ }),

/***/ 212:
/*!******************************************************************************!*\
  !*** ./projects/party-lib/src/lib/components/contacts/contacts.component.ts ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ContactsComponent": () => (/* binding */ ContactsComponent)
/* harmony export */ });
/* harmony import */ var _angular_material_table__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/table */ 4302);
/* harmony import */ var serendipity_components_lib__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! serendipity-components-lib */ 2986);
/* harmony import */ var _models_contact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../models/contact */ 2973);
/* harmony import */ var _models_column_defs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../models/column-defs */ 355);
/* harmony import */ var _models_constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../models/constants */ 7578);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ 2316);
/* harmony import */ var _adapters_contact_adapter__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../adapters/contact.adapter */ 9259);
/* harmony import */ var _services_contacts_contacts_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../services/contacts/contacts.service */ 3074);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/button */ 781);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/icon */ 2529);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/common */ 4364);
/* harmony import */ var _angular_material_sort__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/sort */ 5381);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/router */ 1258);
/* harmony import */ var _angular_material_list__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/material/list */ 8417);
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/material/progress-spinner */ 181);

















function ContactsComponent_ng_container_15_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementContainer"](0);
} }
function ContactsComponent_ng_container_17_ng_container_2_th_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "th", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
} if (rf & 2) {
    const column_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate1"](" ", column_r12.displayName, " ");
} }
function ContactsComponent_ng_container_17_ng_container_2_td_2_ng_container_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const row_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]().$implicit;
    const column_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]().$implicit;
    const ctx_r17 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate1"](" ", ctx_r17.getProperty(row_r16, column_r12.name), " ");
} }
const _c6 = function (a0) { return [a0]; };
function ContactsComponent_ng_container_17_ng_container_2_td_2_ng_template_2_a_0_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "a", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
} if (rf & 2) {
    const row_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"](2).$implicit;
    const column_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]().$implicit;
    const ctx_r22 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpureFunction1"](2, _c6, ctx_r22.getProperty(row_r16, column_r12.routerLink)));
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate1"](" ", ctx_r22.getProperty(row_r16, column_r12.name), " ");
} }
const _c7 = function (a1) { return ["/sales/accounts", a1]; };
function ContactsComponent_ng_container_17_ng_container_2_td_2_ng_template_2_a_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "a", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
} if (rf & 2) {
    const row_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"](2).$implicit;
    const column_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]().$implicit;
    const ctx_r23 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpureFunction1"](2, _c7, ctx_r23.getProperty(row_r16, column_r12.routerLink)));
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate1"](" ", ctx_r23.getProperty(row_r16, column_r12.name), " ");
} }
function ContactsComponent_ng_container_17_ng_container_2_td_2_ng_template_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](0, ContactsComponent_ng_container_17_ng_container_2_td_2_ng_template_2_a_0_Template, 2, 4, "a", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](1, ContactsComponent_ng_container_17_ng_container_2_td_2_ng_template_2_a_1_Template, 2, 4, "a", 27);
} if (rf & 2) {
    const column_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", column_r12.name === "party.displayName");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", column_r12.name === "organisation.displayName");
} }
function ContactsComponent_ng_container_17_ng_container_2_td_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "td", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](1, ContactsComponent_ng_container_17_ng_container_2_td_2_ng_container_1_Template, 2, 1, "ng-container", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](2, ContactsComponent_ng_container_17_ng_container_2_td_2_ng_template_2_Template, 2, 2, "ng-template", null, 26, _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
} if (rf & 2) {
    const _r18 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵreference"](3);
    const column_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", !column_r12.routerLink)("ngIfElse", _r18);
} }
function ContactsComponent_ng_container_17_ng_container_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementContainerStart"](0, 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](1, ContactsComponent_ng_container_17_ng_container_2_th_1_Template, 2, 1, "th", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](2, ContactsComponent_ng_container_17_ng_container_2_td_2_Template, 4, 2, "td", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const column_r12 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("matColumnDef", column_r12.name);
} }
function ContactsComponent_ng_container_17_th_4_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "th", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](1, "button", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](2, "mat-icon", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](3, "autorenew");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
} }
function ContactsComponent_ng_container_17_td_5_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](0, "td", 24);
} }
function ContactsComponent_ng_container_17_td_6_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](0, "td", 32);
} }
function ContactsComponent_ng_container_17_td_8_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "td", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](1, "sales-collection-footer", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵattribute"]("colspan", ctx_r8.footerColSpan);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("host", ctx_r8);
} }
function ContactsComponent_ng_container_17_tr_9_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](0, "tr", 34);
} }
function ContactsComponent_ng_container_17_tr_10_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](0, "tr", 35);
} }
function ContactsComponent_ng_container_17_tr_11_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](0, "tr", 36);
} }
const _c8 = function () { return ["footer"]; };
function ContactsComponent_ng_container_17_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](1, "table", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](2, ContactsComponent_ng_container_17_ng_container_2_Template, 3, 1, "ng-container", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementContainerStart"](3, 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](4, ContactsComponent_ng_container_17_th_4_Template, 4, 0, "th", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](5, ContactsComponent_ng_container_17_td_5_Template, 1, 0, "td", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](6, ContactsComponent_ng_container_17_td_6_Template, 1, 0, "td", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementContainerStart"](7, 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](8, ContactsComponent_ng_container_17_td_8_Template, 2, 2, "td", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](9, ContactsComponent_ng_container_17_tr_9_Template, 1, 0, "tr", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](10, ContactsComponent_ng_container_17_tr_10_Template, 1, 0, "tr", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](11, ContactsComponent_ng_container_17_tr_11_Template, 1, 0, "tr", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("hidden", !ctx_r1.items)("dataSource", ctx_r1.dataSource);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngForOf", ctx_r1.columnDefs);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("matHeaderRowDef", ctx_r1.displayedColumns)("matHeaderRowDefSticky", true);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("matRowDefColumns", ctx_r1.displayedColumns);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("matFooterRowDef", _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpureFunction0"](8, _c8))("matFooterRowDefSticky", true);
} }
function ContactsComponent_ng_template_18_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "div", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](1, "mat-spinner", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
} }
class ContactsComponent extends serendipity_components_lib__WEBPACK_IMPORTED_MODULE_6__.CollectionComponent {
    constructor(entityAdapter, entityService) {
        super({
            columnDefsFilename: _models_column_defs__WEBPACK_IMPORTED_MODULE_1__.CONTACTS_COLUMN_DEFS,
            desktopDeviceColumns: _models_constants__WEBPACK_IMPORTED_MODULE_2__.CONTACTS_COLUMNS_DESKTOP,
            mobileDeviceColumns: _models_constants__WEBPACK_IMPORTED_MODULE_2__.CONTACTS_COLUMNS_MOBILE,
            limit: 10
        });
        this.entityAdapter = entityAdapter;
        this.entityService = entityService;
    }
    subscribe() {
        this.logger.info('ContactsComponent: subscribe()');
        this.items.push(new _models_contact__WEBPACK_IMPORTED_MODULE_0__.Contact());
        this.dataSource = new _angular_material_table__WEBPACK_IMPORTED_MODULE_7__.MatTableDataSource(this.items);
        this.dataSource.data = this.items;
        this.dataSource.sortingDataAccessor = pathDataAccessor;
        this.dataSource.sort = this.sort;
    }
    /*
  
    protected subscribe() {
  
      this.logger.info('ContactsComponent: subscribe()');
  
      this.subscription = this.entityService.find(this.filter, this.offset, this.limit).subscribe(
  
        (response: any) => {
  
          this.logger.info('ContactsComponent: subscribe() success handler');
  
          this.count = response.body.page.totalElements;
  
          this.logger.info('count: ' + this.count);
  
          if (this.count > 0) {
  
            this.items = response.body._embedded.individualModels.map(
              ((item: any) => this.entityAdapter.adapt(item)));
  
          } else {
  
            // this.items = [];
            this.items.push(new Contact());
  
          }
  
          // this.logger.info('items: ' + JSON.stringify(this.items, null, 2));
  
          this.dataSource = new MatTableDataSource(this.items);
          this.dataSource.data = this.items;
          this.dataSource.sortingDataAccessor = pathDataAccessor;
          this.dataSource.sort = this.sort;
  
        }
  
      );
  
     }
  
     */
    //
    // Command Bar events
    //
    onNew() {
        this.logger.info('ContactsComponent: onNew()');
        this.router.navigate(['customers/contacts/new']);
    }
}
ContactsComponent.ɵfac = function ContactsComponent_Factory(t) { return new (t || ContactsComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdirectiveInject"](_adapters_contact_adapter__WEBPACK_IMPORTED_MODULE_3__.ContactAdapter), _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdirectiveInject"](_services_contacts_contacts_service__WEBPACK_IMPORTED_MODULE_4__.ContactsService)); };
ContactsComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineComponent"]({ type: ContactsComponent, selectors: [["lib-contacts"]], features: [_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵInheritDefinitionFeature"]], decls: 20, vars: 3, consts: function () { let i18n_0; if (typeof ngI18nClosureMode !== "undefined" && ngI18nClosureMode) {
        /**
         * @desc Contacts
         * @meaning Command Bar Item
         */
        const MSG_EXTERNAL_NEW$$__________________USERS_ROBFERGUSON_WORKSPACE_ROBINYO_SERENDIPITY_2_0_FRONTEND_PROJECTS_PARTY_LIB_SRC_LIB_COMPONENTS_CONTACTS_CONTACTS_COMPONENT_TS_1 = goog.getMsg(" NEW ");
        i18n_0 = MSG_EXTERNAL_NEW$$__________________USERS_ROBFERGUSON_WORKSPACE_ROBINYO_SERENDIPITY_2_0_FRONTEND_PROJECTS_PARTY_LIB_SRC_LIB_COMPONENTS_CONTACTS_CONTACTS_COMPONENT_TS_1;
    }
    else {
        i18n_0 = $localize `:Command Bar Item|Contacts@@NEW: NEW `;
    } let i18n_2; if (typeof ngI18nClosureMode !== "undefined" && ngI18nClosureMode) {
        /**
         * @desc Contacts
         * @meaning Command Bar Item
         */
        const MSG_EXTERNAL_RUN_REPORT$$__________________USERS_ROBFERGUSON_WORKSPACE_ROBINYO_SERENDIPITY_2_0_FRONTEND_PROJECTS_PARTY_LIB_SRC_LIB_COMPONENTS_CONTACTS_CONTACTS_COMPONENT_TS_3 = goog.getMsg(" RUN REPORT ");
        i18n_2 = MSG_EXTERNAL_RUN_REPORT$$__________________USERS_ROBFERGUSON_WORKSPACE_ROBINYO_SERENDIPITY_2_0_FRONTEND_PROJECTS_PARTY_LIB_SRC_LIB_COMPONENTS_CONTACTS_CONTACTS_COMPONENT_TS_3;
    }
    else {
        i18n_2 = $localize `:Command Bar Item|Contacts@@RUN_REPORT: RUN REPORT `;
    } let i18n_4; if (typeof ngI18nClosureMode !== "undefined" && ngI18nClosureMode) {
        /**
         * @desc Contacts
         * @meaning Activity Bar Title
         */
        const MSG_EXTERNAL_CONTACTS_TITLE$$__________________USERS_ROBFERGUSON_WORKSPACE_ROBINYO_SERENDIPITY_2_0_FRONTEND_PROJECTS_PARTY_LIB_SRC_LIB_COMPONENTS_CONTACTS_CONTACTS_COMPONENT_TS_5 = goog.getMsg(" Contacts ");
        i18n_4 = MSG_EXTERNAL_CONTACTS_TITLE$$__________________USERS_ROBFERGUSON_WORKSPACE_ROBINYO_SERENDIPITY_2_0_FRONTEND_PROJECTS_PARTY_LIB_SRC_LIB_COMPONENTS_CONTACTS_CONTACTS_COMPONENT_TS_5;
    }
    else {
        i18n_4 = $localize `:Activity Bar Title|Contacts@@CONTACTS_TITLE: Contacts `;
    } return [["mat-flat-button", "", 1, "default-command-bar-button"], i18n_0, ["mat-flat-button", "", "disabled", "", 1, "command-bar-button"], i18n_2, [1, "activity-bar-title"], i18n_4, [1, "content-container"], [4, "ngIf", "ngIfThen"], [1, "table-container"], [4, "ngIf"], ["skeleton", ""], ["mat-table", "", "matSort", "", "matSortStart", "desc", "matSortDisableClear", "", 1, "mat-elevation-z8", "crm-table", 3, "hidden", "dataSource"], [3, "matColumnDef", 4, "ngFor", "ngForOf"], ["matColumnDef", "id"], ["mat-header-cell", "", "class", "header-cell-id", 4, "matHeaderCellDef"], ["mat-cell", "", 4, "matCellDef"], ["mat-footer-cell", "", 4, "matFooterCellDef"], ["matColumnDef", "footer"], ["mat-header-row", "", 4, "matHeaderRowDef", "matHeaderRowDefSticky"], ["mat-row", "", 4, "matRowDef", "matRowDefColumns"], ["mat-footer-row", "", 4, "matFooterRowDef", "matFooterRowDefSticky"], [3, "matColumnDef"], ["mat-header-cell", "", "mat-sort-header", "", 4, "matHeaderCellDef"], ["mat-header-cell", "", "mat-sort-header", ""], ["mat-cell", ""], [4, "ngIf", "ngIfElse"], ["link", ""], [3, "routerLink", 4, "ngIf"], [3, "routerLink"], ["mat-header-cell", "", 1, "header-cell-id"], ["mat-icon-button", ""], ["matListIcon", "", 1, "header-icon"], ["mat-footer-cell", ""], [3, "host"], ["mat-header-row", ""], ["mat-row", ""], ["mat-footer-row", ""], [1, "crm-spinner-container"], ["color", "accent"]]; }, template: function ContactsComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "command-bar");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](1, "button", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](2, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](3, " add ");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](4, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵi18n"](5, 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](6, "button", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](7, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](8, " description ");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](9, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵi18n"](10, 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](11, "activity-bar");
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](12, "span", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵi18n"](13, 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](14, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](15, ContactsComponent_ng_container_15_Template, 1, 0, "ng-container", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](16, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](17, ContactsComponent_ng_container_17_Template, 12, 9, "ng-container", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](18, ContactsComponent_ng_template_18_Template, 2, 0, "ng-template", null, 10, _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplateRefExtractor"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    } if (rf & 2) {
        const _r2 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵreference"](19);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](15);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", !ctx.items)("ngIfThen", _r2);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", ctx.columnDefs);
    } }, directives: [serendipity_components_lib__WEBPACK_IMPORTED_MODULE_6__.CommandBarComponent, _angular_material_button__WEBPACK_IMPORTED_MODULE_8__.MatButton, _angular_material_icon__WEBPACK_IMPORTED_MODULE_9__.MatIcon, serendipity_components_lib__WEBPACK_IMPORTED_MODULE_6__.ActivityBarComponent, _angular_common__WEBPACK_IMPORTED_MODULE_10__.NgIf, _angular_material_table__WEBPACK_IMPORTED_MODULE_7__.MatTable, _angular_material_sort__WEBPACK_IMPORTED_MODULE_11__.MatSort, _angular_common__WEBPACK_IMPORTED_MODULE_10__.NgForOf, _angular_material_table__WEBPACK_IMPORTED_MODULE_7__.MatColumnDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_7__.MatHeaderCellDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_7__.MatCellDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_7__.MatFooterCellDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_7__.MatHeaderRowDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_7__.MatRowDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_7__.MatFooterRowDef, _angular_material_table__WEBPACK_IMPORTED_MODULE_7__.MatHeaderCell, _angular_material_sort__WEBPACK_IMPORTED_MODULE_11__.MatSortHeader, _angular_material_table__WEBPACK_IMPORTED_MODULE_7__.MatCell, _angular_router__WEBPACK_IMPORTED_MODULE_12__.RouterLinkWithHref, _angular_material_list__WEBPACK_IMPORTED_MODULE_13__.MatListIconCssMatStyler, _angular_material_table__WEBPACK_IMPORTED_MODULE_7__.MatFooterCell, serendipity_components_lib__WEBPACK_IMPORTED_MODULE_6__.CollectionFooterComponent, _angular_material_table__WEBPACK_IMPORTED_MODULE_7__.MatHeaderRow, _angular_material_table__WEBPACK_IMPORTED_MODULE_7__.MatRow, _angular_material_table__WEBPACK_IMPORTED_MODULE_7__.MatFooterRow, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_14__.MatSpinner], styles: [".default-command-bar-button[_ngcontent-%COMP%] {\n  background-color: rgba(0, 0, 0, 0.12);\n  margin-right: 8px;\n  min-width: 48px;\n  padding: 0 16px;\n}\n\n.command-bar-button[_ngcontent-%COMP%] {\n  background-color: darkgrey;\n  color: white;\n  margin-right: 8px;\n  min-width: 48px;\n  padding: 0 16px;\n}\n\n.activity-bar-title[_ngcontent-%COMP%] {\n  font-size: 1.6em;\n}\n\n.content-container[_ngcontent-%COMP%] {\n  height: calc(100vh - 216px);\n  width: 100%;\n  background: whitesmoke;\n}\n\n@media (max-width: 599px) {\n  .content-container[_ngcontent-%COMP%] {\n    height: calc(100vh - 140px);\n  }\n}\n\n.table-container[_ngcontent-%COMP%] {\n  height: calc(100vh - 248px);\n  margin-left: 32px;\n  margin-right: 32px;\n  overflow: auto;\n}\n\n@media (max-width: 599px) {\n  .table-container[_ngcontent-%COMP%] {\n    height: calc(100vh - 140px);\n    margin-left: 0;\n    margin-right: 0;\n  }\n}\n\n.header-toolbar[_ngcontent-%COMP%] {\n  background: #fafafa;\n}\n\n.header-title[_ngcontent-%COMP%] {\n  font-weight: bold;\n  padding: 0 16px 0 40px;\n}\n\n.header-icon[_ngcontent-%COMP%] {\n  margin: 0 12px 0 12px;\n}\n\nth.mat-header-cell[_ngcontent-%COMP%] {\n  padding-right: 16px;\n  white-space: nowrap;\n}\n\n.header-cell-id[_ngcontent-%COMP%] {\n  text-align: right;\n}\n\ntd.mat-cell[_ngcontent-%COMP%] {\n  padding-right: 16px;\n}\n\n.mat-cell[_ngcontent-%COMP%] {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.mat-column-party-displayName[_ngcontent-%COMP%] {\n  width: 280px;\n  max-width: 280px;\n}\n\n.mat-column-email[_ngcontent-%COMP%] {\n  width: 260px;\n  max-width: 240px;\n}\n\n.mat-column-organisation-displayName[_ngcontent-%COMP%] {\n  width: 200px;\n  max-width: 120px;\n}\n\n.mat-column-organisation-phoneNumber[_ngcontent-%COMP%] {\n  width: 140px;\n  max-width: 120px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRhY3RzLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BO0VBQ0UscUNBQUE7RUFDQSxpQkFKZ0M7RUFLaEMsZUFONkI7RUFPN0IsZUFBQTtBQU5GOztBQVNBO0VBQ0UsMEJBQUE7RUFDQSxZQUFBO0VBQ0EsaUJBWmdDO0VBYWhDLGVBZDZCO0VBZTdCLGVBQUE7QUFORjs7QUFTQTtFQUNFLGdCQXJCNkI7QUFlL0I7O0FBV0E7RUFHRSwyQkFBQTtFQUNBLFdBQUE7RUFRQSxzQkFBQTtBQWpCRjs7QUFXRTtFQU5GO0lBU0ksMkJBQUE7RUFWRjtBQUNGOztBQWtCQTtFQUlFLDJCQUFBO0VBRUEsaUJBVHFCO0VBVXJCLGtCQVZxQjtFQVdyQixjQUFBO0FBbkJGOztBQXVCRTtFQVpGO0lBZUksMkJBQUE7SUFFQSxjQW5Ca0I7SUFvQmxCLGVBcEJrQjtFQUhwQjtBQUNGOztBQWlDQTtFQUNFLG1CQUFBO0FBOUJGOztBQWdDQTtFQUNFLGlCQUFBO0VBQ0Esc0JBQUE7QUE3QkY7O0FBK0JBO0VBQ0UscUJBQUE7QUE1QkY7O0FBK0JBO0VBQ0UsbUJBQUE7RUFFQSxtQkFBQTtBQTdCRjs7QUFnQ0E7RUFDRSxpQkFBQTtBQTdCRjs7QUFnQ0E7RUFDRSxtQkFBQTtBQTdCRjs7QUFrQ0E7RUFDRSxnQkFBQTtFQUNBLHVCQUFBO0VBQ0EsbUJBQUE7QUEvQkY7O0FBa0NBO0VBQ0UsWUFBQTtFQUNBLGdCQUFBO0FBL0JGOztBQWtDQTtFQUNFLFlBQUE7RUFDQSxnQkFBQTtBQS9CRjs7QUFrQ0E7RUFDRSxZQUFBO0VBQ0EsZ0JBQUE7QUEvQkY7O0FBa0NBO0VBQ0UsWUFBQTtFQUNBLGdCQUFBO0FBL0JGIiwiZmlsZSI6ImNvbnRhY3RzLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiJG1hdC14c21hbGw6ICdtYXgtd2lkdGg6IDU5OXB4JztcblxuJGFjdGl2aXR5LWJhci10aXRsZS1mb250LXNpemU6IDEuNmVtICFkZWZhdWx0O1xuJGNvbW1hbmQtYmFyLWJ1dHRvbi1wYWRkaW5nOiAxNnB4ICFkZWZhdWx0O1xuJGNvbW1hbmQtYmFyLWJ1dHRvbi1taW4td2lkdGg6IDQ4cHggIWRlZmF1bHQ7XG4kY29tbWFuZC1iYXItYnV0dG9uLW1hcmdpbi1yaWdodDogOHB4ICFkZWZhdWx0O1xuXG4uZGVmYXVsdC1jb21tYW5kLWJhci1idXR0b24ge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuMTIpO1xuICBtYXJnaW4tcmlnaHQ6ICRjb21tYW5kLWJhci1idXR0b24tbWFyZ2luLXJpZ2h0O1xuICBtaW4td2lkdGg6ICRjb21tYW5kLWJhci1idXR0b24tbWluLXdpZHRoO1xuICBwYWRkaW5nOiAwICRjb21tYW5kLWJhci1idXR0b24tcGFkZGluZztcbn1cblxuLmNvbW1hbmQtYmFyLWJ1dHRvbiB7XG4gIGJhY2tncm91bmQtY29sb3I6IGRhcmtncmV5O1xuICBjb2xvcjogd2hpdGU7XG4gIG1hcmdpbi1yaWdodDogJGNvbW1hbmQtYmFyLWJ1dHRvbi1tYXJnaW4tcmlnaHQ7XG4gIG1pbi13aWR0aDogJGNvbW1hbmQtYmFyLWJ1dHRvbi1taW4td2lkdGg7XG4gIHBhZGRpbmc6IDAgJGNvbW1hbmQtYmFyLWJ1dHRvbi1wYWRkaW5nO1xufVxuXG4uYWN0aXZpdHktYmFyLXRpdGxlIHtcbiAgZm9udC1zaXplOiAkYWN0aXZpdHktYmFyLXRpdGxlLWZvbnQtc2l6ZTtcbn1cblxuLy8gdG9wLCByaWdodCwgYm90dG9tLCBhbmQgbGVmdFxuXG4uY29udGVudC1jb250YWluZXIge1xuICAvLyAkbWF0LXRvb2xiYXItaGVpZ2h0LWRlc2t0b3AgKyAkY3JtLWNvbW1hbmQtYmFyLWhlaWdodC1kZXNrdG9wICsgJGNybS12aWV3LWJhci1oZWlnaHQtZGVza3RvcFxuICAvLyA2NCArIDU2ICsgOTZcbiAgaGVpZ2h0OiBjYWxjKDEwMHZoIC0gMjE2cHgpO1xuICB3aWR0aDogMTAwJTtcblxuICBAbWVkaWEgKCRtYXQteHNtYWxsKSB7XG4gICAgLy8gJG1hdC10b29sYmFyLWhlaWdodC1tb2JpbGUgKyAkY3JtLWNvbW1hbmQtYmFyLWhlaWdodC1tb2JpbGUgKyAkY3JtLXZpZXctYmFyLWhlaWdodC1tb2JpbGVcbiAgICAvLyA1NiArIDAgKyA4NFxuICAgIGhlaWdodDogY2FsYygxMDB2aCAtIDE0MHB4KTtcbiAgfVxuXG4gIGJhY2tncm91bmQ6IHdoaXRlc21va2U7XG59XG5cbiR0YWJsZS1tYXJnaW4tZGVza3RvcDogMzJweDtcbiR0YWJsZS1tYXJnaW4tbW9iaWxlOiAwO1xuXG4udGFibGUtY29udGFpbmVyIHtcblxuICAvLyAkbWF0LXRvb2xiYXItaGVpZ2h0LWRlc2t0b3AgKyAkY3JtLWNvbW1hbmQtYmFyLWhlaWdodC1kZXNrdG9wICsgJGNybS12aWV3LWJhci1oZWlnaHQtZGVza3RvcFxuICAvLyA2NCArIDU2ICsgOTYgKyAzMlxuICBoZWlnaHQ6IGNhbGMoMTAwdmggLSAyNDhweCk7XG5cbiAgbWFyZ2luLWxlZnQ6ICR0YWJsZS1tYXJnaW4tZGVza3RvcDtcbiAgbWFyZ2luLXJpZ2h0OiAkdGFibGUtbWFyZ2luLWRlc2t0b3A7XG4gIG92ZXJmbG93OiBhdXRvO1xuXG4gIC8vIG1hcmdpbi10b3A6ICRtYXQtdG9vbGJhci1oZWlnaHQtZGVza3RvcCArICRjcm0tY29tbWFuZC1iYXItaGVpZ2h0LWRlc2t0b3A7XG5cbiAgQG1lZGlhICgkbWF0LXhzbWFsbCkge1xuICAgIC8vICRtYXQtdG9vbGJhci1oZWlnaHQtbW9iaWxlICsgJGNybS1jb21tYW5kLWJhci1oZWlnaHQtbW9iaWxlICsgJGNybS12aWV3LWJhci1oZWlnaHQtbW9iaWxlXG4gICAgLy8gNTYgKyAwICsgODQgKyAwXG4gICAgaGVpZ2h0OiBjYWxjKDEwMHZoIC0gMTQwcHgpO1xuXG4gICAgbWFyZ2luLWxlZnQ6ICR0YWJsZS1tYXJnaW4tbW9iaWxlO1xuICAgIG1hcmdpbi1yaWdodDogJHRhYmxlLW1hcmdpbi1tb2JpbGU7XG4gIH1cblxuICAvLyBiYWNrZ3JvdW5kLWNvbG9yOiBibGFjaztcbn1cblxuXG4vL1xuLy8gSGVhZGVyXG4vL1xuXG4uaGVhZGVyLXRvb2xiYXIge1xuICBiYWNrZ3JvdW5kOiAjZmFmYWZhO1xufVxuLmhlYWRlci10aXRsZSB7XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuICBwYWRkaW5nOiAwIDE2cHggMCA0MHB4O1xufVxuLmhlYWRlci1pY29uIHtcbiAgbWFyZ2luOiAwIDEycHggMCAxMnB4O1xufVxuXG50aC5tYXQtaGVhZGVyLWNlbGwge1xuICBwYWRkaW5nLXJpZ2h0OiAxNnB4O1xuICAvLyB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICB3aGl0ZS1zcGFjZTogbm93cmFwO1xufVxuXG4uaGVhZGVyLWNlbGwtaWQge1xuICB0ZXh0LWFsaWduOiByaWdodDtcbn1cblxudGQubWF0LWNlbGwge1xuICBwYWRkaW5nLXJpZ2h0OiAxNnB4O1xufVxuXG4vLyBDb2x1bW5zXG5cbi5tYXQtY2VsbCB7XG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO1xuICB3aGl0ZS1zcGFjZTogbm93cmFwO1xufVxuXG4ubWF0LWNvbHVtbi1wYXJ0eS1kaXNwbGF5TmFtZSB7XG4gIHdpZHRoOiAyODBweDtcbiAgbWF4LXdpZHRoOiAyODBweDtcbn1cblxuLm1hdC1jb2x1bW4tZW1haWwge1xuICB3aWR0aDogMjYwcHg7XG4gIG1heC13aWR0aDogMjQwcHg7XG59XG5cbi5tYXQtY29sdW1uLW9yZ2FuaXNhdGlvbi1kaXNwbGF5TmFtZSB7XG4gIHdpZHRoOiAyMDBweDtcbiAgbWF4LXdpZHRoOiAxMjBweDtcbn1cblxuLm1hdC1jb2x1bW4tb3JnYW5pc2F0aW9uLXBob25lTnVtYmVyIHtcbiAgd2lkdGg6IDE0MHB4O1xuICBtYXgtd2lkdGg6IDEyMHB4O1xufVxuIl19 */"] });
// https://stackoverflow.com/questions/48891174/angular-material-2-datatable-sorting-with-nested-objects
function pathDataAccessor(item, path) {
    return path.split('.')
        .reduce((accumulator, key) => {
        return accumulator ? accumulator[key] : undefined;
    }, item);
}


/***/ }),

/***/ 355:
/*!**********************************************************!*\
  !*** ./projects/party-lib/src/lib/models/column-defs.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ACCOUNTS_COLUMN_DEFS": () => (/* binding */ ACCOUNTS_COLUMN_DEFS),
/* harmony export */   "ACTIVITIES_COLUMN_DEFS": () => (/* binding */ ACTIVITIES_COLUMN_DEFS),
/* harmony export */   "CONTACTS_COLUMN_DEFS": () => (/* binding */ CONTACTS_COLUMN_DEFS)
/* harmony export */ });
const ACCOUNTS_COLUMN_DEFS = 'accounts-column-defs';
const ACTIVITIES_COLUMN_DEFS = 'activities-column-defs';
const CONTACTS_COLUMN_DEFS = 'contacts-column-defs';


/***/ }),

/***/ 7578:
/*!********************************************************!*\
  !*** ./projects/party-lib/src/lib/models/constants.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ZERO": () => (/* binding */ ZERO),
/* harmony export */   "ACCOUNTS": () => (/* binding */ ACCOUNTS),
/* harmony export */   "CONTACTS": () => (/* binding */ CONTACTS),
/* harmony export */   "ACTIVITIES": () => (/* binding */ ACTIVITIES),
/* harmony export */   "MAT_XSMALL": () => (/* binding */ MAT_XSMALL),
/* harmony export */   "FAKE_ITEMS_LENGTH": () => (/* binding */ FAKE_ITEMS_LENGTH),
/* harmony export */   "NAVIGATION_BAR_HEIGHT_DESKTOP": () => (/* binding */ NAVIGATION_BAR_HEIGHT_DESKTOP),
/* harmony export */   "NAVIGATION_BAR_HEIGHT_MOBILE": () => (/* binding */ NAVIGATION_BAR_HEIGHT_MOBILE),
/* harmony export */   "COMMAND_BAR_HEIGHT_DESKTOP": () => (/* binding */ COMMAND_BAR_HEIGHT_DESKTOP),
/* harmony export */   "COMMAND_BAR_HEIGHT_MOBILE": () => (/* binding */ COMMAND_BAR_HEIGHT_MOBILE),
/* harmony export */   "COMMAND_BAR_SIDENAV_WIDTH": () => (/* binding */ COMMAND_BAR_SIDENAV_WIDTH),
/* harmony export */   "VIEW_BAR_HEIGHT_DESKTOP": () => (/* binding */ VIEW_BAR_HEIGHT_DESKTOP),
/* harmony export */   "VIEW_BAR_HEIGHT_MOBILE": () => (/* binding */ VIEW_BAR_HEIGHT_MOBILE),
/* harmony export */   "MARGIN_DESKTOP": () => (/* binding */ MARGIN_DESKTOP),
/* harmony export */   "MARGIN_MOBILE": () => (/* binding */ MARGIN_MOBILE),
/* harmony export */   "ALPHABET": () => (/* binding */ ALPHABET),
/* harmony export */   "ACCOUNTS_COLUMNS_DESKTOP": () => (/* binding */ ACCOUNTS_COLUMNS_DESKTOP),
/* harmony export */   "ACCOUNTS_COLUMNS_MOBILE": () => (/* binding */ ACCOUNTS_COLUMNS_MOBILE),
/* harmony export */   "ACTIVITIES_COLUMNS_DESKTOP": () => (/* binding */ ACTIVITIES_COLUMNS_DESKTOP),
/* harmony export */   "ACTIVITIES_COLUMNS_MOBILE": () => (/* binding */ ACTIVITIES_COLUMNS_MOBILE),
/* harmony export */   "CONTACTS_COLUMNS_DESKTOP": () => (/* binding */ CONTACTS_COLUMNS_DESKTOP),
/* harmony export */   "CONTACTS_COLUMNS_MOBILE": () => (/* binding */ CONTACTS_COLUMNS_MOBILE),
/* harmony export */   "MARGIN": () => (/* binding */ MARGIN),
/* harmony export */   "MARGIN_TOP": () => (/* binding */ MARGIN_TOP),
/* harmony export */   "MARGIN_RIGHT": () => (/* binding */ MARGIN_RIGHT),
/* harmony export */   "MARGIN_BOTTOM": () => (/* binding */ MARGIN_BOTTOM),
/* harmony export */   "MARGIN_LEFT": () => (/* binding */ MARGIN_LEFT)
/* harmony export */ });
// See: variables.scss
/*

// https://github.com/angular/material2/blob/master/src/lib/toolbar/toolbar.scss

$mat-toolbar-height-desktop: 64px !default;
$mat-toolbar-height-mobile: 56px !default;
$mat-toolbar-row-padding: 16px !default;

@media ($mat-xsmall) {
  @include mat-toolbar-height($mat-toolbar-height-mobile);
}

*/
// btoa(0) === 'MA=='
const ZERO = '/MA==';
const ACCOUNTS = 'sales/accounts';
const CONTACTS = 'sales/contacts';
const ACTIVITIES = 'sales/activities';
const MAT_XSMALL = '(max-width: 599px)';
const FAKE_ITEMS_LENGTH = 16;
// export const TOOLBAR_HEIGHT_DESKTOP = 64;
// export const TOOLBAR_HEIGHT_MOBILE  = 56;
const NAVIGATION_BAR_HEIGHT_DESKTOP = 64;
const NAVIGATION_BAR_HEIGHT_MOBILE = 56;
const COMMAND_BAR_HEIGHT_DESKTOP = 56;
const COMMAND_BAR_HEIGHT_MOBILE = 0; // 48, fxHide.xs
const COMMAND_BAR_SIDENAV_WIDTH = 200;
const VIEW_BAR_HEIGHT_DESKTOP = 96;
const VIEW_BAR_HEIGHT_MOBILE = 84;
const MARGIN_DESKTOP = 32;
const MARGIN_MOBILE = 0;
const ALPHABET = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
const ACCOUNTS_COLUMNS_DESKTOP = ['name', 'phoneNumber', 'individual.displayName', 'individual.email', 'id'];
const ACCOUNTS_COLUMNS_MOBILE = ['name', 'phoneNumber', 'id'];
const ACTIVITIES_COLUMNS_DESKTOP = ['type', 'subject', 'regarding', 'priority', 'startDate', 'dueDate', 'id'];
const ACTIVITIES_COLUMNS_MOBILE = ['type', 'subject', 'id'];
const CONTACTS_COLUMNS_DESKTOP = ['party.displayName', 'email', 'organisation.displayName', 'organisation.phoneNumber', 'id'];
const CONTACTS_COLUMNS_MOBILE = ['party.displayName', 'organisation.phoneNumber', 'id'];
//
// TODO
//
// top, right, bottom, and left
const MARGIN = 32;
const MARGIN_TOP = 32;
const MARGIN_RIGHT = 32;
const MARGIN_BOTTOM = 32;
const MARGIN_LEFT = 32;
/*

export const ALPHABET: string[] = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
  'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z' ];

*/


/***/ }),

/***/ 2973:
/*!******************************************************!*\
  !*** ./projects/party-lib/src/lib/models/contact.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Contact": () => (/* binding */ Contact)
/* harmony export */ });
/* harmony import */ var _individual__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./individual */ 5130);

// tslint:disable-next-line:no-empty-interface
// export interface Contact extends Individual {}
class Contact extends _individual__WEBPACK_IMPORTED_MODULE_0__.Individual {
}


/***/ }),

/***/ 3425:
/*!*************************************************************!*\
  !*** ./projects/party-lib/src/lib/models/individual-ref.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "IndividualRef": () => (/* binding */ IndividualRef)
/* harmony export */ });
class IndividualRef {
    constructor(id = '', displayName = '', email = '', phoneNumber = '') {
        this.id = id;
        this.displayName = displayName;
        this.email = email;
        this.phoneNumber = phoneNumber;
    }
}


/***/ }),

/***/ 5130:
/*!*********************************************************!*\
  !*** ./projects/party-lib/src/lib/models/individual.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Individual": () => (/* binding */ Individual)
/* harmony export */ });
/* harmony import */ var _name__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./name */ 2935);
/* harmony import */ var _organisation_ref__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./organisation-ref */ 9578);
/* harmony import */ var _party__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./party */ 5469);
/* harmony import */ var _types_party_type__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../types/party-type */ 1155);




const defaultName = new _name__WEBPACK_IMPORTED_MODULE_0__.Name('', '', '', '', '', '', '', '');
class Individual {
    constructor(party = new _party__WEBPACK_IMPORTED_MODULE_2__.Party(_types_party_type__WEBPACK_IMPORTED_MODULE_3__.PartyType.INDIVIDUAL), name = defaultName, sex = '', email = '', phoneNumber = '', photoUrl = '', electorate = '', dateOfBirth = '', placeOfBirth = '') {
        this.party = party;
        this.name = name;
        this.sex = sex;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.photoUrl = photoUrl;
        this.electorate = electorate;
        this.dateOfBirth = dateOfBirth;
        this.placeOfBirth = placeOfBirth;
        this.organisation = new _organisation_ref__WEBPACK_IMPORTED_MODULE_1__.OrganisationRef();
    }
}
// https://google.github.io/styleguide/jsoncstyleguide.xml


/***/ }),

/***/ 2935:
/*!***************************************************!*\
  !*** ./projects/party-lib/src/lib/models/name.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Name": () => (/* binding */ Name)
/* harmony export */ });
class Name {
    constructor(title = '', givenName = '', middleName = '', familyName = '', preferredName = '', initials = '', honorific = '', salutation = '') {
        this.title = title;
        this.givenName = givenName;
        this.middleName = middleName;
        this.familyName = familyName;
        this.preferredName = preferredName;
        this.initials = initials;
        this.honorific = honorific;
        this.salutation = salutation;
    }
}
/*

  private String title;         // name prefix
  private String givenName;
  private String preferredGivenName;
  private String middleName;    // otherNames
  private String familyName;
  private String preferredFamilyName;
  private String preferredName; // informalSalutation
  private String initials;
  private String honorific;     // name suffix
  private String salutation;    // formalSalutation

*/


/***/ }),

/***/ 9578:
/*!***************************************************************!*\
  !*** ./projects/party-lib/src/lib/models/organisation-ref.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "OrganisationRef": () => (/* binding */ OrganisationRef)
/* harmony export */ });
/* harmony import */ var _individual_ref__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./individual-ref */ 3425);

// tslint:disable-next-line:no-empty-interface
// export interface Contact extends Individual {}
class OrganisationRef extends _individual_ref__WEBPACK_IMPORTED_MODULE_0__.IndividualRef {
}


/***/ }),

/***/ 5469:
/*!****************************************************!*\
  !*** ./projects/party-lib/src/lib/models/party.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Party": () => (/* binding */ Party)
/* harmony export */ });
class Party {
    constructor(type = 'PARTY', displayName = '', addresses = [], roles = []) {
        this.type = type;
        this.displayName = displayName;
        this.addresses = addresses;
        this.roles = roles;
        this.legalType = '';
    }
}


/***/ }),

/***/ 3258:
/*!****************************************************************!*\
  !*** ./projects/party-lib/src/lib/party-lib-routing.module.ts ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PartyLibRoutingModule": () => (/* binding */ PartyLibRoutingModule)
/* harmony export */ });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ 1258);
/* harmony import */ var _components_contacts_contacts_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/contacts/contacts.component */ 212);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 2316);




const routes = [
    {
        path: 'contacts',
        component: _components_contacts_contacts_component__WEBPACK_IMPORTED_MODULE_0__.ContactsComponent,
        // canActivate: [AuthGuard],
        runGuardsAndResolvers: 'always'
    }
    /*
    {
      path: 'contacts/new',
      component: ContactWizardComponent,
      canActivate: [AuthGuard],
      runGuardsAndResolvers: 'always'
    },
    {
      path: 'contacts/:id',
      component: ContactComponent,
      canActivate: [AuthGuard],
      canDeactivate: [CanDeactivateGuard],
      runGuardsAndResolvers: 'always'
    }
    */
];
class PartyLibRoutingModule {
}
PartyLibRoutingModule.ɵfac = function PartyLibRoutingModule_Factory(t) { return new (t || PartyLibRoutingModule)(); };
PartyLibRoutingModule.ɵmod = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineNgModule"]({ type: PartyLibRoutingModule });
PartyLibRoutingModule.ɵinj = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjector"]({ imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterModule.forChild(routes)], _angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterModule] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsetNgModuleScope"](PartyLibRoutingModule, { imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterModule], exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterModule] }); })();


/***/ }),

/***/ 3448:
/*!********************************************************!*\
  !*** ./projects/party-lib/src/lib/party-lib.module.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PartyLibModule": () => (/* binding */ PartyLibModule)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 4364);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common/http */ 3882);
/* harmony import */ var utils_lib__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! utils-lib */ 6549);
/* harmony import */ var serendipity_components_lib__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! serendipity-components-lib */ 2986);
/* harmony import */ var _components_contacts_contacts_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/contacts/contacts.component */ 212);
/* harmony import */ var _party_lib_routing_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./party-lib-routing.module */ 3258);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 2316);


//
// Utils lib
//


// import { UtilsLibModule } from 'utils-lib';
//
// Components - local
//

//
// PartyLibRoutingModule: https://angular.io/guide/router#routing-module-order
//



const components = [
    _components_contacts_contacts_component__WEBPACK_IMPORTED_MODULE_0__.ContactsComponent
];
class PartyLibModule {
    constructor(logger) {
        this.logger = logger;
        this.logger.info('Party Library initialised');
    }
}
PartyLibModule.ɵfac = function PartyLibModule_Factory(t) { return new (t || PartyLibModule)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](utils_lib__WEBPACK_IMPORTED_MODULE_3__.LoggerService)); };
PartyLibModule.ɵmod = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineNgModule"]({ type: PartyLibModule });
PartyLibModule.ɵinj = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjector"]({ imports: [[
            utils_lib__WEBPACK_IMPORTED_MODULE_3__.AngularMaterialModule,
            _angular_common__WEBPACK_IMPORTED_MODULE_4__.CommonModule,
            _angular_common_http__WEBPACK_IMPORTED_MODULE_5__.HttpClientModule,
            serendipity_components_lib__WEBPACK_IMPORTED_MODULE_6__.SerendipityComponentsLibModule,
            // See core.module.ts
            // UtilsLibModule,
            // https://angular.io/guide/router#routing-module-order
            _party_lib_routing_module__WEBPACK_IMPORTED_MODULE_1__.PartyLibRoutingModule
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵsetNgModuleScope"](PartyLibModule, { declarations: [_components_contacts_contacts_component__WEBPACK_IMPORTED_MODULE_0__.ContactsComponent], imports: [utils_lib__WEBPACK_IMPORTED_MODULE_3__.AngularMaterialModule,
        _angular_common__WEBPACK_IMPORTED_MODULE_4__.CommonModule,
        _angular_common_http__WEBPACK_IMPORTED_MODULE_5__.HttpClientModule,
        serendipity_components_lib__WEBPACK_IMPORTED_MODULE_6__.SerendipityComponentsLibModule,
        // See core.module.ts
        // UtilsLibModule,
        // https://angular.io/guide/router#routing-module-order
        _party_lib_routing_module__WEBPACK_IMPORTED_MODULE_1__.PartyLibRoutingModule], exports: [_components_contacts_contacts_component__WEBPACK_IMPORTED_MODULE_0__.ContactsComponent] }); })();


/***/ }),

/***/ 3968:
/*!***************************************************************************************!*\
  !*** ./projects/party-lib/src/lib/services/abstract/collection/collection.service.ts ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CollectionService": () => (/* binding */ CollectionService)
/* harmony export */ });
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ 3882);
/* harmony import */ var utils_lib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! utils-lib */ 6549);


// import { HttpOptions } from '../../../models/http-options';
class CollectionService {
    constructor() {
        this.url = '';
        const injector = utils_lib__WEBPACK_IMPORTED_MODULE_0__.StaticInjectorService.getInjector();
        this.environmentService = injector.get(utils_lib__WEBPACK_IMPORTED_MODULE_0__.EnvironmentService);
        this.httpClient = injector.get(_angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpClient);
        this.logger = injector.get(utils_lib__WEBPACK_IMPORTED_MODULE_0__.LoggerService);
        this.config = this.environmentService.getConfig();
    }
    getUrlPrefix() {
        return this.config.serverScheme + '://' + this.config.serverHost + ':' + this.config.serverPort;
    }
    getHttpOptions(params = undefined) {
        // his.logger.info('CollectionService: getHttpOptions()');
        if (!this.httpOptions) {
            this.httpOptions = {
                headers: new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpHeaders({
                    'Content-Type': 'application/json'
                }),
                observe: 'response',
                params: undefined
            };
        }
        if (params) {
            this.httpOptions.params = params;
        }
        // this.logger.info('httpOptions: ' + JSON.stringify(this.httpOptions, null, 2));
        return this.httpOptions;
    }
}
// https://angular.io/guide/http#getting-error-details
// https://stackoverflow.com/questions/47761262/angular-4-5-httpclient-argument-of-type-string-is-not-assignable-to-body/47761516#47761516
/*

protected handleError(error: HttpErrorResponse) {

  if (error.error instanceof ErrorEvent) {

    // A client-side or network error occurred. Handle it accordingly.
    console.error('An error occurred:', error.error.message);

  } else {

    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong,
    console.error(
      `Backend returned code ${error.status}, ` +
      `body was: ${error.error}`);
  }

  // return an observable with a user-facing error message
  return throwError('Something bad happened; please try again later.');

}

*/
/*

protected handleError<T>(operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {

    // TODO: send the error to your remote logging infrastructure e.g., Sentry
    this.logger.error(error);

    // TODO: better job of transforming error for user consumption
    // this.logger.info(operation + ' failed: ' + error.message);

    // Let the app keep running by returning an empty result
    return of(result as T);
  };
}

*/
/*

  protected getHttpOptions(params: HttpParams = null) {

    this.logger.info('CollectionService: getHttpOptions()');

    if (!this.httpOptions) {

      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        params: null
      };

    }

    this.httpOptions.params = params;

    // this.logger.info(JSON.stringify(this.httpOptions));

    return this.httpOptions;
  }

*/
/*

  protected getHttpOptions(params: HttpParams) {

    this.logger.info('CollectionService: getHttpOptions()');

    if (!this.httpOptions) {

      const user: User = this.authService.getUser();

      if (typeof user === 'undefined') {
        this.logger.error('CollectionService getHttpOptions() - user is undefined');
        return this.httpOptions;
      }

      const token = user.username + ':' + user.password;

      this.logger.info('CollectionService getHttpOptions() - token: ' + token);

      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(token)
        }),
        params: null
      };

    }

    this.httpOptions.params = params;

    // this.logger.info(JSON.stringify(this.httpOptions));

    return this.httpOptions;
  }

*/


/***/ }),

/***/ 3074:
/*!**************************************************************************!*\
  !*** ./projects/party-lib/src/lib/services/contacts/contacts.service.ts ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ContactsService": () => (/* binding */ ContactsService)
/* harmony export */ });
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ 8636);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ 3927);
/* harmony import */ var _abstract_collection_collection_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../abstract/collection/collection.service */ 3968);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 2316);
/* harmony import */ var _adapters_contact_adapter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../adapters/contact.adapter */ 9259);




class ContactsService extends _abstract_collection_collection_service__WEBPACK_IMPORTED_MODULE_0__.CollectionService {
    constructor(adapter) {
        super();
        this.adapter = adapter;
        this.url = this.getUrlPrefix() + '/api/individuals/';
    }
    find(filter, offset = 0, limit = 100) {
        this.logger.info('ContactsService: find()');
        let url = this.url;
        let queryParams;
        if (filter.length) {
            url = this.getUrlPrefix() + '/api/individuals/search/findByFamilyNameStartsWith';
            queryParams = '?name=' + filter + '&page=' + offset + '&size=' + limit + '&sort=name.familyName&name.familyName.dir=asc';
        }
        else {
            queryParams = '?page=' + offset + '&size=' + limit + '&sort=name.familyName&name.familyName.dir=asc';
        }
        this.logger.info('url: ' + url);
        this.logger.info('queryParams: ' + queryParams);
        return this.httpClient.get(url + queryParams, this.getHttpOptions()).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.tap)(() => {
            this.logger.info('ContactsService: find() completed');
        }));
    }
    findById(id) {
        return this.httpClient.get(this.url + id).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.map)((item) => this.adapter.adapt(item)), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.tap)(() => {
            this.logger.info('ContactsService: findById() completed');
        }));
    }
    create(contact) {
        return this.httpClient.post(this.url, contact, this.getHttpOptions()).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.tap)(() => {
            this.logger.info('ContactsService: create() completed');
        }));
    }
    update(id, contact) {
        return this.httpClient.patch(this.url + id, contact, this.getHttpOptions()).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.tap)(() => {
            this.logger.info('ContactsService: update() completed');
        }));
    }
    delete(id) {
        return this.httpClient.delete(this.url + id).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.tap)(() => {
            this.logger.info('ContactsService: delete() completed');
        }));
    }
}
ContactsService.ɵfac = function ContactsService_Factory(t) { return new (t || ContactsService)(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵinject"](_adapters_contact_adapter__WEBPACK_IMPORTED_MODULE_1__.ContactAdapter)); };
ContactsService.ɵprov = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineInjectable"]({ token: ContactsService, factory: ContactsService.ɵfac, providedIn: 'root' });


/***/ }),

/***/ 1155:
/*!********************************************************!*\
  !*** ./projects/party-lib/src/lib/types/party-type.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PartyType": () => (/* binding */ PartyType)
/* harmony export */ });
var PartyType;
(function (PartyType) {
    PartyType["INDIVIDUAL"] = "INDIVIDUAL";
    PartyType["ORGANISATION"] = "ORGANISATION";
    PartyType["ORGANISATIONAL_UNIT"] = "ORGANISATIONAL_UNIT";
})(PartyType || (PartyType = {}));


/***/ })

}]);
//# sourceMappingURL=projects_party-lib_src_lib_party-lib_module_ts.js.map