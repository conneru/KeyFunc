import { useEffect, useState } from "react";
import { User } from "../../types";
import { axiosInstance as axios } from "../../axiosInstance";
import { useAppSelector } from "../../hooks";

function SearchUsers() {
  const user = useAppSelector((state) => state.auth.User);
  const [query, setQuery] = useState<string>("");
  const [userList, setUserList] = useState<User[]>([]);

  const searchForUser = async (q: string) => {
    if (q.length) {
      const res = await axios({
        method: "POST",
        url: "/api/user/search",
        data: { UserId: user?.id, Query: q },
      });

      const data = await res.data;

      setUserList(res.data);
    } else {
      setUserList([]);
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          searchForUser(e.target.value);
        }}
      />
      {userList.map((u) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <div className="pfp-container">
            <img
              className="pfp"
              alt="ProfilePic"
              src={
                u?.profilePic ||
                "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg?w=1380"
              }
            ></img>
          </div>
          <div>{u.username}</div>
        </div>
      ))}
    </div>
  );
}

export default SearchUsers;
