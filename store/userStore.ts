import { defineStore } from "pinia";
import type { IRefferalUser, ITask, ITaskError, IUser } from "~/types/type";

interface UserState {
  user: IUser | null;
  refferals: IRefferalUser[] | null;
  tasksComp: ITask[] | null;
  tasksError: ITaskError[] | null;
  isCapcha: boolean;
}

export const useUserStore = defineStore("user", {
  state: (): UserState => ({
    user: null,
    refferals: [],
    tasksComp: [],
    tasksError: [],
    isCapcha: false,
  }),
  actions: {
    setUser(user: IUser) {
      this.user = user;
    },
    setRefferals(refferals: IRefferalUser[]) {
      this.refferals = refferals;
    },
    setTasksComp(tasksComp: ITask[]) {
      this.tasksComp = tasksComp;
    },
    setIsCapcha(isCapcha: boolean) {
      this.isCapcha = isCapcha;
    },
    setTasksError(tasksError: ITaskError[]) {
      this.tasksError = tasksError;
    },
  },
});
