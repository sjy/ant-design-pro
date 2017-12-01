import { queryBathroom, removeBathroom, addBathroom } from '../services/api';

export default {
    namespace: 'bathroom',

    state: {
        levels: [],
        devices: [],
        bathrooms: [],
        selectedLevel: null,
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
            let selectedLevel = null;
            if (action.levelId) {
                selectedLevel = action.payload.find(l => l.id === action.levelId);
                bathrooms = selectedLevel.toilets;
                devices = bathrooms
                    .map(t =>
                        t.position.male.closets
                            .map(c => ({
                                ...c,
                                ...{
                                    type: 'male',
                                    description: `${t.name}/男`,
                                    levelId: action.levelId,
                                    key: c.closetID,
                                    status: c.available ? 2 : 0,
                                },
                            }))
                            .concat(
                                t.position.female.closets.map(c => ({
                                    ...c,
                                    ...{
                                        type: 'female',
                                        description: `${t.name}/女`,
                                        levelId: action.levelId,
                                        key: c.closetID,
                                        status: c.available ? 2 : 0,
                                    },
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
                selectedLevel,
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
