import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  leaves: [],
  stats: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  },
  loading: false,
  error: null,
};

const leaveSlice = createSlice({
  name: 'leaves',
  initialState,
  reducers: {
    leaveStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchLeavesSuccess: (state, action) => {
      state.loading = false;
      state.leaves = action.payload.leaves;
      state.pagination = action.payload.pagination;
      state.error = null;
    },
    fetchStatsSuccess: (state, action) => {
      state.loading = false;
      state.stats = action.payload;
      state.error = null;
    },
    leaveActionSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    leaveFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  leaveStart,
  fetchLeavesSuccess,
  fetchStatsSuccess,
  leaveActionSuccess,
  leaveFailure,
} = leaveSlice.actions;

export default leaveSlice.reducer;
