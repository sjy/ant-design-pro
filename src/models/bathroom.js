import { queryBathroom, removeBathroom, addBathroom } from '../services/api';

export default {
    namespace: 'bathroom',

    state: {
        levels: [],
        devices: [],
        bathrooms: [],
        loading: true,
    },

    effects: {
        *fetch({ payload }, { call, put }) {
            yield put({
                type: 'changeLoading',
                payload: true,
            });
            const response = yield call(queryBathroom, payload);
            yield put({
                type: 'save',
                payload: response,
                levelId: payload.level,
            });
            yield put({
                type: 'changeLoading',
                payload: false,
            });
        },
        *add({ payload, callback }, { call, put }) {
            yield put({
                type: 'changeLoading',
                payload: true,
            });
            const response = yield call(addBathroom, payload);
            yield put({
                type: 'save',
                payload: response,
            });
            yield put({
                type: 'changeLoading',
                payload: false,
            });

            if (callback) callback();
        },
        *remove({ payload, callback }, { call, put }) {
            yield put({
                type: 'changeLoading',
                payload: true,
            });
            const response = yield call(removeBathroom, payload);
            yield put({
                type: 'save',
                payload: response,
            });
            yield put({
                type: 'changeLoading',
                payload: false,
            });

            if (callback) callback();
        },
    },

    reducers: {
        save(state, action) {
            let bathrooms = [];
            let devices = [];
            if (action.payload.levelId) {
                bathrooms = action.payload.find(l => l.id === levelId).toilets;
                devices = bathrooms
                    .map(t =>
                        t.male.closets
                            .map(c => ({
                                ...c,
                                ...{ desc: t.name, levelId: levelId, key: t.id, type: 'male' },
                            }))
                            .concat(
                                t.female.closets.map(c => ({
                                    ...c,
                                    ...{ desc: t.name, levelId: levelId, key: t.id, type: 'female' },
                                }))
                            )
                    )
                    .reduce((t1, t2) => t1.concat(t2), []);
            }
            return {
                ...state,
                levels: action.payload,
                devices,
                bathrooms,
            };
        },
        changeLoading(state, action) {
            return {
                ...state,
                loading: action.payload,
            };
        },
    },
};
