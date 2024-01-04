import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./store";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const calculateTimeDiff = (startDate: string | undefined | null) => {
  if (startDate) {
    const timeDiff = Math.abs(
      new Date(Date.parse(startDate)).getTime() - Date.now()
    );

    const minDiff = Math.floor(timeDiff / (1000 * 60));
    const hoursDiff = Math.floor(timeDiff / (1000 * 3600));
    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
    const weeksDiff = Math.floor(timeDiff / (1000 * 3600 * 24 * 7));

    if (weeksDiff >= 1) {
      return `${weeksDiff}w`;
    } else if (daysDiff >= 1) {
      return `${daysDiff}d`;
    } else if (hoursDiff >= 1) {
      return `${hoursDiff}h`;
    } else {
      return `${minDiff}m`;
    }
  }
};
