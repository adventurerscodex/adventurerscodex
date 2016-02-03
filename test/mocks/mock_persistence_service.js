"use strict";

var mockLocalStorage = {};
//Don't store to local storage.
PersistenceService.storage = mockLocalStorage;
