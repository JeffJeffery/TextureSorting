import React from "react";

export default function Unsorted_Textures(props: {
  images: string[];
  imageGroup: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  setImageGroup: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const { images, imageGroup, setImages, setImageGroup } = props;

  const handleOnClick = (e: any, image: string) => {
    if (imageGroup.length >= 9) {
      return;
    }
    const filteredImages = images.filter((imageItem) => image !== imageItem);
    setImages(filteredImages);
    setImageGroup((arr) => [...arr, image]);
  };

  const renderImages = (): JSX.Element[] => {
    return images.map((image: string, index) => {
      return (
        <ul className="Unsorted_Textures" key={index}>
          <img
            src={process.env.PUBLIC_URL + `/resources/real/${image}.png`}
            onClick={(e) => handleOnClick(e, image)}
            className="textureImage"
          />
        </ul>
      );
    });
  };
  return <div className="Unsorted_Group">{renderImages()}</div>;
}
