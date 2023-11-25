import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../hooks";
import { RootState } from "../store";
import { fetchSingleUser } from "../features/userSlice";
import { User } from "../types";
interface weather {
  summary: string;
}
function FetchData() {
  const [data, setData] = useState<weather[]>();

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchSingleUser(1));
    // fetch("weatherforecast")
    //   .then((r) => r.json())
    //   .then((r) => setData(r));
  }, [dispatch]);

  const user: User | null = useAppSelector((state) => state.persist.User);
  console.log(user);
  const isLoading: boolean = useAppSelector((state) => state.persist.isLoading);
  const error: string | undefined = useAppSelector(
    (state) => state.persist.error
  );

  return (
    <div>
      <div>{user?.username}</div>
      {data?.map((d: weather) => (
        <div>{d.summary}</div>
      ))}
    </div>
  );
}

export default FetchData;
