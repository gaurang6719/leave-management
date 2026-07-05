import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  employees: [],
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  },
  currentEmployee: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    userStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchEmployeesSuccess: (state, action) => {
      state.loading = false;
      state.employees = action.payload.employees;
      state.pagination = action.payload.pagination;
      state.error = null;
    },
    fetchEmployeeByIdSuccess: (state, action) => {
      state.loading = false;
      state.currentEmployee = action.payload;
      state.error = null;
    },
    userActionSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    userFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearCurrentEmployee: (state) => {
      state.currentEmployee = null;
    },
  },
});

export const {
  userStart,
  fetchEmployeesSuccess,
  fetchEmployeeByIdSuccess,
  userActionSuccess,
  userFailure,
  clearCurrentEmployee,
} = userSlice.actions;

export default userSlice.reducer;
