import { combineReducers } from 'redux';

// Import the reducer from each module here, and add it to the combined reducer
import staticContent from './staticcontent/reducer';
import dynamicContent from './dynamiccontent/reducer';

export default () =>
    combineReducers({
        staticContent,
        dynamicContent
    });
