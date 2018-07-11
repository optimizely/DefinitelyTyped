declare module '@optimizely/optimizely-sdk' {
    import enums = require('@optimizely/optimizely-sdk/lib/utils/enums');

    export class config {
        datafile: object;
        errorHandler?: object;
        eventDispatcher?: object;
        logger?: object;
        logLevel?: enums.LOG_LEVEL.DEBUG | enums.LOG_LEVEL.ERROR | enums.LOG_LEVEL.INFO | enums.LOG_LEVEL.NOTSET | enums.LOG_LEVEL.WARNING;
        skipJSONValidation?: boolean;
        userProfileService?: object;
    }

    export class listeners {
        userId: string;
        attributes: object;
        logEvent: object;
    }
    
    export interface activate extends listeners{
        experiment: object,
        variation: object
    }

    export interface track extends listeners{
        eventKey: string,
        eventTags: object
    }

    export function createInstance(config: config): Optimizely;

    export class Optimizely {
        notificationCenter: notificationCenter;
        activate(experimentKey: string, userId: string, attributes?: object): string | null;
        track(eventKey: string, userId: string, attributes?: string, eventTags?: object): void;
        getVariation(experimentKey: string, userId: string, attributes?: object): string | null;
        setForcedVariation(experimentKey: string, userId: string, variationKey: string | null): boolean;
        getForcedVariation(experimentKey: string, userId: string): string | null;
        isFeatureEnabled(featureKey: string, userId: string, attributes?: object): boolean;
        getEnabledFeatures(userId: string, attributes: object): string[];
        getFeatureVariableBoolean(featureKey: string, variableKey: string, userId: string, attributes?: object): boolean | null;
        getFeatureVariableDouble(featureKey: string, variableKey: string, userId: string, attributes?: object): number | null;
        getFeatureVariableInteger(featureKey: string, variableKey: string, userId: string, attributes?: object): number | null;
        getFeatureVariableString(featureKey: string, variableKey: string, userId: string, attributes?: object): string | null;
    }
    export class notificationCenter {
        addNotificationListener(notificationType: string, callback: (notificationData: activate | track) => void): number;
        removeNotificationListener(listenerId: number): boolean;
        clearAllNotificationListeners(): void;
        clearNotificationListeners(notificationType: string): void;
    }  
}

declare module '@optimizely/optimizely-sdk/lib/utils/enums'{
    export enum LOG_LEVEL{
        NOTSET = 0,
        DEBUG = 1,
        INFO = 2,
        WARNING =  3,
        ERROR = 4,
    }
    export enum NOTIFICATION_TYPES { 
        ACTIVATE = 'ACTIVATE:experiment, user_id, attributes, variation, events',
        TRACK = 'TRACK:event_key, user_id, attributes, event_tags, event',
    }
}

declare module '@optimizely/optimizely-sdk/lib/plugins/event_dispatcher'{

}

declare module '@optimizely/optimizely-sdk/lib/plugins/error_handler'{
}

declare module '@optimizely/optimizely-sdk/lib/plugins/logger'{

}