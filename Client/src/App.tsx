import React, { useState, useEffect, useRef, FormEvent } from "react";
import axios from "axios";
import "./App.css";
import Instructions from "./components/Instructions";
import Sorted_Group from "./components/Sorted_Group";
import Unsorted_Textures from "./components/Unsorted_Textures";
import { allImages } from "./components/file_names";

const LOCAL_STORAGE_KEY_1: string = "ViSiProg.Group";
const allImagesLen = allImages.length;
const imageSet = [...allImages];

function App() {
  const [percent, setPercent] = useState<number>(
    ~~(((allImagesLen - imageSet.length) / allImagesLen) * 100)
  );

  const pickImages = (): string[] => {
    console.log("PickImages Run");
    if (allImagesLen > allImagesLen - imageSet.length + 1) {
      imageSet.sort(() => 0.5 - Math.random());
      const selected = imageSet.splice(0, 50);

      return selected;
    } else {
      allImages.sort(() => 0.5 - Math.random());
      const selected = allImages.slice(0, 50);
      return selected;
    }
  };

  const [imagesToShow, setImagesToShow] = useState<string[]>(pickImages);
  const [imageGroup, setimageGroup] = useState<string[]>([]);
  const [data, setData] = useState<{
    userName: string;
    submitionNumber: number;
    textureGroup: string[];
  }>({
    userName: "",
    submitionNumber: NaN,
    textureGroup: [],
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [submittedBool, setSubmittedBool] = useState(false);
  const [showUserHistoryBool, setShowUserHistoryBool] = useState(false);
  const [history, setHistory] = useState<
    {
      userName: string;
      submitionNumber: number;
      textureGroup: string;
    }[]
  >([]);

  const userNameRef = React.useRef() as React.MutableRefObject<
    HTMLInputElement
  >;

  useEffect(() => {
    const value = localStorage.getItem(LOCAL_STORAGE_KEY_1);
    if (typeof value === "string") {
      const stored_imageGroup = JSON.parse(value);
      if (stored_imageGroup.length > 0) {
        setimageGroup(stored_imageGroup);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_1, JSON.stringify(imageGroup));
  }, [imageGroup]);

  const handleShuffle = () => {
    console.log("total: ", allImages.length);
    console.log("not Done: ", imageSet.length);
    if (imageGroup.length != 9) {
      setErrorMessage("Please Create a Set of 9 Before Shuffling");
      setTimeout(() => setErrorMessage(""), 1500);
    } else {
      setImagesToShow(pickImages);
      setPercent(~~(((allImagesLen - imageSet.length) / allImagesLen) * 100));
    }
  };

  const handleSubmit = () => {
    if (data.userName === "") {
      setErrorMessage("Please Log In to Submit");
      setTimeout(() => setErrorMessage(""), 1500);
    } else if (imageGroup.length != 9) {
      setErrorMessage("Please Create a Set of 9 Before Submitting");
      setTimeout(() => setErrorMessage(""), 1500);
    } else if (percent < 50) {
      setErrorMessage(
        "Please Explore at Least 50% of the Database Before Submitting"
      );
      setTimeout(() => setErrorMessage(""), 1500);
    } else {
      imageGroup.map((image) => console.log(image));
      //console.log("POST DISCONNECTED");
      //make an axios call to do actually save the data
      axios
        .post(
          "https://qbj058sa0m.execute-api.us-east-2.amazonaws.com/prod/textureGroups",
          {
            userName: data.userName,
            submitionNumber: data.submitionNumber,
            textureGroup: JSON.stringify(imageGroup),
          }
        )
        .then((response) => {
          console.log(response);
        });
      setSubmittedBool(true);
      localStorage.setItem(LOCAL_STORAGE_KEY_1, JSON.stringify([]));
    }
  };

  const handleUserNameInput = (event: FormEvent) => {
    event.preventDefault();
    if (userNameRef.current.value === "") {
      return;
    }

    const name = userNameRef.current.value;

    const newData = {
      ...data,
      userName: name,
    };
    setData(newData);

    axios
      .get(
        "https://qbj058sa0m.execute-api.us-east-2.amazonaws.com/prod/textureGroups/" +
          userNameRef.current.value
      )
      .then((response) => {
        if (response.data.length > 0) {
          const newSubmtionNumber =
            response.data[response.data.length - 1].submitionNumber + 1;
          console.log("Found, next, SubNumber:", newSubmtionNumber);
          const newData = {
            ...data,
            userName: name,
            submitionNumber: newSubmtionNumber,
          };
          setData(newData);
        } else {
          const newSubmtionNumber = 0;
          console.log("NOT Found, next, SubNumber:", newSubmtionNumber);
          const newData = {
            ...data,
            userName: name,
            submitionNumber: newSubmtionNumber,
          };
          setData(newData);
        }
      });
  };

  const inputUserName = () => {
    if (data.userName === "") {
      return (
        <form>
          <input ref={userNameRef} className="inputUserName" />
          <button
            className="submitUserName"
            onClick={(e) => handleUserNameInput(e)}
          >
            Log In
          </button>
        </form>
      );
    } else if (showUserHistoryBool) {
      return (
        <div className="user">
          <h3 className="userName">Logged in as {data.userName}</h3>
          <button
            className="userButton"
            onClick={() => setShowUserHistoryBool(false)}
          >
            Make Submission
          </button>
        </div>
      );
    } else {
      return (
        <div className="user">
          <h3 className="userName">Logged in as {data.userName}</h3>
          <button className="userButton" onClick={handleUserHistory}>
            Submition History
          </button>
        </div>
      );
    }
  };

  const handleUserHistory = () => {
    axios
      .get(
        "https://qbj058sa0m.execute-api.us-east-2.amazonaws.com/prod/textureGroups/" +
          data.userName
      )
      .then((response) => {
        setShowUserHistoryBool(true);
        setHistory(response.data);
      });
  };

  const handleDelete = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number
  ) => {
    const name = history[index].userName;
    const numb = history[index].submitionNumber;
    const newHistory = [...history];
    newHistory.splice(index, 1);
    setHistory(newHistory);
    axios
      .delete(
        "https://qbj058sa0m.execute-api.us-east-2.amazonaws.com/prod/textureGroups/none",
        {
          data: {
            userName: name,
            submitionNumber: numb,
          },
        }
      )
      .then((response) => {
        console.log(response);
        handleUserHistory();
      });
  };

  const displayHistory = () => {
    return history.map((groups, index) => {
      return (
        <div className="History" key={index}>
          <div className="Sorted_Group_History">
            {JSON.parse(groups.textureGroup).map(
              (image: string, iIndex: number) => {
                return (
                  <ul className="Sorted_Textures" key={9 * index + iIndex}>
                    <img
                      src={
                        process.env.PUBLIC_URL + `/resources/real/${image}.png`
                      }
                      className="textureImage"
                    />
                  </ul>
                );
              }
            )}
          </div>
          <button
            className="Delete_Button"
            key={index}
            onClick={(e) => handleDelete(e, index)}
          >
            Delete
          </button>
        </div>
      );
    });
  };

  const displaySubmition = () => {
    return imageGroup.map((image: string, index) => {
      return (
        <ul className="Sorted_Textures" key={index}>
          <img
            src={process.env.PUBLIC_URL + `/resources/real/${image}.png`}
            className="textureImage"
          />
        </ul>
      );
    });
  };

  if (showUserHistoryBool) {
    const renderedImages = displayHistory();
    return (
      <div className="Page">
        <h1 className="Heading">ViSiProg Texture Sorting</h1>
        {inputUserName()}
        <h2 className="Instructions">Here are your previous submissions:</h2>
        {renderedImages}
      </div>
    );
  } else if (submittedBool) {
    const renderedImages = displaySubmition();
    return (
      <div className="Page">
        <h1 className="Heading">ViSiProg Texture Sorting</h1>
        {inputUserName()}
        <h2 className="Instructions">
          Thank you for Submitting! To submit another, please Refresh the page!
        </h2>
        <h2 className="Instructions">Your submission:</h2>
        <div className={renderedImages.length > 0 ? "Sorted_Group" : ""}>
          {renderedImages}
        </div>
      </div>
    );
  } else {
    return (
      <div className="Page">
        <h1 className="Heading">ViSiProg Texture Sorting</h1>
        {inputUserName()}
        <Instructions percent={percent} />
        <div className="Buttons">
          <button className="ShuffleButton" onClick={handleShuffle}>
            Shuffle{" "}
          </button>
          <button className="SubmitButton" onClick={handleSubmit}>
            Submit
          </button>
        </div>
        <div className="errorMessage">{errorMessage}</div>

        <div className="Textures">
          <Sorted_Group
            images={imagesToShow}
            imageGroup={imageGroup}
            setImages={setImagesToShow}
            setImageGroup={setimageGroup}
          />
          <Unsorted_Textures
            images={imagesToShow}
            imageGroup={imageGroup}
            setImages={setImagesToShow}
            setImageGroup={setimageGroup}
          />
        </div>
      </div>
    );
  }
}

export default App;
