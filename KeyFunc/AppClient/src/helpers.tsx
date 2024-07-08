import { Message, User, Chat } from "./types";

export const calculateTimeDiff = (startDate: string | undefined | null) => {
  if (startDate) {
    const timeDiff = Math.abs(
      new Date(Date.parse(startDate)).getTime() - Date.now()
    );

    const secDiff = Math.floor(timeDiff / 1000);
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
    } else if (minDiff >= 1) {
      return `${minDiff}m`;
    } else {
      return `${secDiff}s`;
    }
  }
};

export const addTimeCode = (curMsg: Message, nextMsg: Message | null) => {
  const fullOp: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  const shortOp: Intl.DateTimeFormatOptions = {
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
  };

  const fullFormatedDate = (date: Date) =>
    new Intl.DateTimeFormat(navigator.language, fullOp).format(date);

  const shortFormatedDate = (date: Date) =>
    new Intl.DateTimeFormat(navigator.language, shortOp).format(date);

  const formatDate = (timeDiff: number, date: Date) => {
    const hoursDiff = Math.floor(timeDiff / (1000 * 3600));
    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
    const minDiff = Math.floor(timeDiff / (1000 * 60));

    if (daysDiff >= 7) {
      return fullFormatedDate(date);
    } else if (hoursDiff >= 1) {
      return shortFormatedDate(date);
    }
  };

  if (curMsg.createdAt && !nextMsg) {
    const curMsgDate = new Date(Date.parse(curMsg?.createdAt));
    const timeDiff = Math.abs(curMsgDate.getTime() - Date.now());
    return formatDate(timeDiff, curMsgDate);
  } else if (curMsg.createdAt && nextMsg?.createdAt) {
    const curMsgDate = new Date(Date.parse(curMsg?.createdAt));
    const timeDiff = Math.abs(
      curMsgDate.getTime() - new Date(Date.parse(nextMsg.createdAt)).getTime()
    );

    return formatDate(timeDiff, curMsgDate);
  }
};

export const includePfp = (curMsg: Message, prevMsg: Message | null) => {
  if (
    curMsg.createdAt &&
    prevMsg?.createdAt &&
    curMsg?.user?.id &&
    prevMsg.user?.id
  ) {
    const timeDiff = Math.abs(
      new Date(Date.parse(curMsg.createdAt)).getTime() -
        new Date(Date.parse(prevMsg.createdAt)).getTime()
    );

    const hoursDiff = Math.floor(timeDiff / (1000 * 3600));

    if (curMsg.user.id === prevMsg.user?.id && hoursDiff < 1) {
      return false;
    }

    return true;
  }
  return true;
};

export const findOtherUsers = (user: User | null, chat: Chat) => {
  if (user) {
    const userList = chat.users?.filter((u) => u.id !== user.id);

    return userList;
  }
};

export const chatImageDisplay = (
  c: Chat,
  otherUsers: User[] | undefined,
  size: string
) => {
  if (c.image) {
    <span>
      <img src={c.image} alt={`${c.id}-icon`} />
    </span>;
  } else if (c.type === 1) {
    return (
      <>
        <span style={{ width: size, height: size }}>
          <img
            src={
              otherUsers?.[0].profilePic ||
              "https://i0.wp.com/digitalhealthskills.com/wp-content/uploads/2022/11/3da39-no-user-image-icon-27.png?fit=500%2C500&ssl=1"
            }
            alt={`${c.id}-icon`}
          />
        </span>
        <div className="group-chat-icon">
          <span style={{ width: size, height: size }}>
            <img
              src={
                otherUsers?.[1].profilePic ||
                "https://i0.wp.com/digitalhealthskills.com/wp-content/uploads/2022/11/3da39-no-user-image-icon-27.png?fit=500%2C500&ssl=1"
              }
              alt={`${c.id}-icon2`}
            />
          </span>
        </div>
      </>
    );
  } else {
    return (
      <span>
        <img
          src={
            otherUsers?.[0].profilePic ||
            "https://i0.wp.com/digitalhealthskills.com/wp-content/uploads/2022/11/3da39-no-user-image-icon-27.png?fit=500%2C500&ssl=1"
          }
          alt={`${c.id}-icon`}
        />
      </span>
    );
  }
};

export const calculateMinImageDimensions = (
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
) => {
  let width = originalWidth;
  let height = originalHeight;

  // Check if the width needs to be adjusted
  if (width > maxWidth) {
    const ratio = maxWidth / width;
    width = maxWidth;
    height *= ratio;
  }

  // Check if the height needs to be adjusted
  if (height > maxHeight) {
    const ratio = maxHeight / height;
    height = maxHeight;
    width *= ratio;
  }

  return { width, height };
};
