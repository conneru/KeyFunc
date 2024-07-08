import { Carousel, Modal } from "react-bootstrap";
import "./CreatePostModal.css";

import {
  ChangeEventHandler,
  MouseEventHandler,
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  faBars,
  faCircleArrowLeft,
  faCircleArrowRight,
  faPhotoFilm,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { calculateMinImageDimensions } from "../../helpers";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { createPost } from "../../features/postSlice";
import { CreatePost, Tag } from "../../types";

import SortableList, { SortableItem } from "react-easy-sort";
import { arrayMoveImmutable } from "array-move";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import { JsxElement } from "typescript";

interface CreatePostProps {
  show: boolean;
  handleClose: Function;
}
function CreatePostModal({ show, handleClose }: CreatePostProps) {
  const [fileList, setFileList] = useState<File[]>([]);
  const fileSelector = useRef<HTMLInputElement>(null);
  const [imageList, setImageList] = useState<string[]>([]);
  const [description, setDescription] = useState<string>("");
  const [tags, setTags] = useState<Tag[][]>([]);
  const [testTags, setTest] = useState<JSX.Element[][]>([]);

  const divRef = useRef<HTMLDivElement>(null);

  const tagPeople = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
    idx: number
  ) => {
    let img = new Image();
    img.src = imageList[idx];
    const rect = e.currentTarget.getBoundingClientRect();

    const { width, height } = calculateMinImageDimensions(
      img.width,
      img.height,
      855,
      855
    );

    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    const leftPercent = (offsetX / rect.width) * 100;
    const topPercent = (offsetY / rect.height) * 100;

    function generateGuid() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          const r = (Math.random() * 16) | 0;
          const v = c === "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
    }

    const guid = generateGuid();

    const tag: Tag = {
      id: guid,
      imageId: 20,
      username: "wyattxchfdfdsdefsfderry",
      top: `${topPercent}`,
      left: `${leftPercent}`,
    };

    const ti = (
      <div
        ref={divRef}
        id={guid}
        className="tag"
        onChange={(e) => console.log("e.currentTarget.offsetWidth")}
        style={{
          left: `${leftPercent}%`,
          top: `${topPercent}%`,
          opacity: 1,
        }}
        key={guid}
      >
        <div className="arrow-up"></div>
        <div className="tag-username">{"wyattxchfdfdsdefsfderry"}</div>
      </div>
    );

    console.log(document.getElementById(guid));

    const newTags = tags.map((t, i) => (i === idx ? [...t, tag] : t));
    const newDivTags = testTags.map((t, i) => (i === idx ? [...t, ti] : t));

    setTags(newTags);
    setTest(newDivTags);
  };

  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.User);

  const onSortEnd = (oldIndex: number, newIndex: number) => {
    setTags((array) => arrayMoveImmutable(array, oldIndex, newIndex));
    setImageList((array) => arrayMoveImmutable(array, oldIndex, newIndex));
    setFileList((array) => arrayMoveImmutable(array, oldIndex, newIndex));
  };

  const closeModal = () => {
    handleClose();
    setTimeout(() => {
      clearModal();
    }, 200);
  };

  const clearModal = () => {
    setDescription("");
    setFileList([]);
    setImageList([]);
    setTags([]);
  };

  const sendPost = async () => {
    const newPost: CreatePost = {
      UserId: user?.id,
      FileList: fileList,
      Description: description,
      Tags: tags,
    };
    await dispatch(createPost(newPost));
  };

  const updateDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length < 2220) {
      setDescription(e.target.value);
    } else {
      setDescription(e.target.value.slice(0, 2200));
    }
  };

  const addImages = (files: FileList) => {
    for (const file of files) {
      if (file.type.startsWith("image/")) {
        setFileList((prevFiles) => [...prevFiles, file]);

        setImageList((prevImages) => [
          ...prevImages,
          URL.createObjectURL(file),
        ]);
        setTags((prevTags) => [...prevTags, []]);
        setTest((prevTags) => [...prevTags, []]);
      }
    }
  };

  const selectFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target as HTMLInputElement;
    if (fileInput.files) {
      addImages(fileInput.files);
    }
  };

  const dragNdrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e?.dataTransfer?.files;

    if (files) {
      addImages(files);
    }
  };

  useEffect(() => {}, [show]);

  return (
    <Modal
      show={show}
      onHide={() => {
        closeModal();
      }}
      className="create-modal"
      dialogClassName="create-modal image-carousel-modal"
    >
      <Modal.Header>
        Create new post
        {imageList.length ? (
          <div
            style={{
              position: "absolute",
              right: "16px",
              color: "rgb(0, 149, 246)",
              cursor: "pointer",
            }}
            onClick={sendPost}
          >
            Post
          </div>
        ) : null}
      </Modal.Header>

      <Modal.Body
        onDrop={dragNdrop}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={(e) => e.preventDefault()}
      >
        {imageList.length ? (
          <div style={{ display: "flex" }}>
            <div className="files">
              <Carousel
                interval={null}
                indicators={false}
                prevIcon={
                  <FontAwesomeIcon
                    icon={faCircleArrowLeft}
                    style={{ overflow: "hidden" }}
                  />
                }
                nextIcon={<FontAwesomeIcon icon={faCircleArrowRight} />}
                wrap={false}
              >
                {imageList.map((img, idx) => {
                  return (
                    <Carousel.Item key={idx + "draggedimg" + img.slice(0, 10)}>
                      <div style={{ position: "relative" }}>
                        <img
                          src={img}
                          alt="fglokwngkl"
                          className="createImg"
                          onClick={(e) => tagPeople(e, idx)}
                        />
                        {/* {tags[idx]?.map((e) => (
                          <div
                            id={e.id}
                            className="tag"
                            onChange={(e) =>
                              console.log(e.currentTarget.offsetWidth)
                            }
                            style={{
                              left: `${e.left}%`,
                              top: `${e.top}%`,
                              opacity: 1,
                              // display: "none",
                            }}
                            key={e.id}
                          >
                            <div className="arrow-up"></div>
                            <div className="tag-username">{e.username}</div>
                          </div>
                        ))} */}
                        {testTags[idx]?.map((t) => {
                          // console.log(divRef.current?.offsetWidth);
                          return t;
                        })}
                      </div>
                    </Carousel.Item>
                  );
                })}
              </Carousel>
            </div>
            <div
              style={{
                width: "342px",
                backgroundColor: "white",
                padding: "16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <div className="pfp-container">
                  <img
                    className="pfp"
                    alt="ProfilePic"
                    src={
                      user?.profilePic ||
                      "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg?w=1380"
                    }
                  ></img>
                </div>
                <div>{user?.username}</div>
              </div>
              <textarea
                value={description}
                onChange={updateDescription}
                style={{
                  width: "100%",
                  height: "168px",
                  border: "none",
                  outline: "none",
                  resize: "none",
                  overflowY: "scroll",

                  margin: "5px",
                }}
                placeholder="Write a caption..."
              ></textarea>
              <span
                style={{
                  color: "grey",
                  fontSize: "12px",
                  display: "flex",
                  justifyContent: "flex-end",
                  paddingBottom: "12px",
                  borderBottom: "1px solid #efefef",
                }}
              >
                {description?.length.toLocaleString()}/2,200
              </span>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div>Reorder Images</div>
                <SortableList
                  onSortEnd={onSortEnd}
                  className="list"
                  draggedItemClassName="dragged"
                >
                  {imageList.map((item, idx) => (
                    <SortableItem key={item}>
                      <div
                        className="item"
                        style={{ zIndex: 5001, display: "flex" }}
                      >
                        <div
                          key={item + "draggedimg"}
                          style={{
                            width: "100px",
                            height: "100px",
                            margin: "10px",
                            position: "relative",
                            backgroundColor: "#efefef",
                            cursor: "grab",
                          }}
                        >
                          <img
                            src={item}
                            alt="fglokwngkl"
                            className="createImg"
                            style={{
                              pointerEvents: "none",
                              width: "100%",
                              height: "100%",
                            }}
                          />
                          <div className="reorder-idx">
                            <div>{idx}</div>
                          </div>
                        </div>
                      </div>
                    </SortableItem>
                  ))}
                </SortableList>
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "855px",
              height: "855px",
            }}
          >
            <FontAwesomeIcon icon={faPhotoFilm} style={{ fontSize: "72px" }} />
            <div style={{ fontSize: "20px", marginTop: "20px" }}>
              Drag Photos Here
            </div>
            <input
              type="file"
              id="fileInput"
              style={{ display: "none" }}
              ref={fileSelector}
              onChange={selectFiles}
              multiple={true}
            />
            <button
              className="select-btn"
              onClick={() => fileSelector.current?.click()}
            >
              Select from computer
            </button>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default CreatePostModal;
