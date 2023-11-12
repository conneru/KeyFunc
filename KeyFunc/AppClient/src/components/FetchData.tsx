import { useEffect, useState } from "react";
interface weather {
  summary: string;
}
function FetchData() {
  const [data, setData] = useState<weather[]>();

  useEffect(() => {
    fetch("weatherforecast")
      .then((r) => r.json())
      .then((r) => setData(r));
  }, []);

  return (
    <div>
      {data?.map((d: weather) => (
        <div>{d.summary}</div>
      ))}
    </div>
  );
}

export default FetchData;
