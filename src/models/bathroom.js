import { queryBathroom, removeBathroom, addBathroom} from '../services/api';

export default {
    namespace: 'bathroom',

    state: {
        levels: [
            {
                level: 1,
                id: '1',
                name: '',
                title: '一楼',
                description: '厕所很多',
                bathrooms: [{}],
            },
        ],
        bathrooms: [{}],
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
            return {
                ...state,
                levels: action.payload.levels,
                bathrooms: action.payload.bathrooms,
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
