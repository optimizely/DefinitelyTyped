import * as optimizely from '@optimizely/optimizely-sdk';
import defaultEventDispatcher = require('@optimizely/optimizely-sdk/lib/plugins/event_dispatcher');
import defaultErrorHandler = require('@optimizely/optimizely-sdk/lib/plugins/error_handler');
import optimizelyEnums = require('@optimizely/optimizely-sdk/lib/utils/enums');
//import defaultLogger = require('@optimizely/optimizely-sdk/lib/plugins/logger');

var datafile = {
  "accountId": "12345",
  "projectId": "23456",
  "revision": "6",
  "version": "2",
  "experiments": [
      {
          "key": "my_experiment",
          "id": "45678",
          "layerId": "34567",
          "status": "Running",
          "variations": [
              {
                  "id": "56789",
                  "key": "control"
              },
              {
                  "id": "67890",
                  "key": "treatment"
              }
          ],
          "trafficAllocation": [
              {
                  "entityId": "56789",
                  "endOfRange": 5000
              },
              {
                  "entityId": "67890",
                  "endOfRange": 10000
              }
          ],
          "audienceIds": [],
          "forcedVariations": {}
      }
  ],
  "events": [
      {
          "experimentIds": [
              "34567"
          ],
          "id": "56789",
          "key": "my_conversion"
      }
  ],
  "audiences": [],
  "attributes": [],
  "groups": []
}
// basic instance creation
var optly1 = optimizely.createInstance({ datafile: datafile });

// instance creation with skipping JSON validation
var optly2 = optimizely.createInstance({
  datafile: datafile,
  skipJSONValidation: true
});

// instance creation with event dispatcher
var optly3 = optimizely.createInstance({
  datafile: datafile,
  eventDispatcher: defaultEventDispatcher
});

// instance creation with logger
// basic logger instantiation
var defaultLogger = {
  log: function(message: any) {
    console.log(message);
  },
};

var optly4 = optimizely.createInstance({
  datafile: datafile,
  eventDispatcher: defaultEventDispatcher,
  logger: defaultLogger
});  

// instance creation with logger based on internal logLevel
var optly5 = optimizely.createInstance({
  datafile: datafile,
  logLevel: optimizelyEnums.LOG_LEVEL.WARNING,
});

// instance creation with an error handler
var optly6 = optimizely.createInstance({
  datafile: datafile,
  errorHandler: defaultErrorHandler,
});

// instance creation with user profile service
var userProfileService = {
  lookup: function(userId: any) {
    // perform user profile lookup
  },
  save: function(userProfileMap: any){
    // persist user profile
  }
};

var optly7 = optimizely.createInstance({
  datafile: datafile,
  userProfileService: userProfileService,
});

//// Error Handling for creating instances
// case1: no parameter
var optlyNoParam = optimizely.createInstance({}); // $ExpectError

// case2: invalid param
var optlyInvalidParam = optimizely.createInstance({foo: "foo"}); //$ExpectError


// notification center test cases

function onActivate(activateObject: any) {
  console.log('activate called for experiment %s', activateObject.experiment['key']);
}

function onTrack(trackObject: any) {
  console.log('track called for event %s', trackObject.eventKey);
}

let activateId = optly1.notificationCenter.addNotificationListener(
        optimizelyEnums.NOTIFICATION_TYPES.ACTIVATE,
        onActivate
    );

let trackId = optly1.notificationCenter.addNotificationListener(
       optimizelyEnums.NOTIFICATION_TYPES.TRACK,
       onTrack
    );


optly1.notificationCenter.removeNotificationListener(activateId);

optly1.notificationCenter.clearNotificationListeners(optimizelyEnums.NOTIFICATION_TYPES.TRACK);

optly1.notificationCenter.clearAllNotificationListeners();

// 
var userId = "12345";
var experimentationKey = 'my_experiment';

// activate tests
var attributes = { 'device': 'iphone', 'ad_source': 'my_campaign' };

var variation1 = optly1.activate(experimentationKey, userId);
var variation2 = optly1.activate(experimentationKey, userId, attributes);

// track tests
optly1.track("my_conversion", userId);

// variation tests
var experimentKey = 'my_experiment';
var userId = 'user123';

// getVariation test
var variation3 = optly1.getVariation(experimentKey, userId);

// setForcedVariation, getForcedVariation test
var forcedVariationKey:string | null = "treatment"
optly1.setForcedVariation(experimentKey, userId, forcedVariationKey);
forcedVariationKey = optly1.getForcedVariation(experimentKey, userId);
optly1.setForcedVariation(experimentKey, userId, null);

// isFeatureEnabled tests
const isSortingAlgoEnabled = optly1.isFeatureEnabled(
  'sorting_algorithm', 
  'user-1'
)


//// initialize variables needed for getFeatureVariable[String|Integer|Double|Boolean]
let sortingProperty: string | null = 'name'
let pageLimit: number | null = 10
if (isSortingAlgoEnabled) {
// If feature is enabled, fetch dynamic feature config value to toggle
// the property used to sort items. The value of the variable is determined by the
// value specified by the Feature Test or Feature Rollout that 'user-1' was assigned.
sortingProperty = optly1.getFeatureVariableString(
'sorting_algorithm', 
'sorting_propery', 
'user-1'
)
pageLimit = optly1.getFeatureVariableInteger(
'sorting_algorithm', 
'page_limit', 
'user-1'
)
}

// // Fetch products and pass the sorting property as well as the number of products to fetch
// const products = productProvider.get(sortingProperty, pageLimit)



