import React from "react";

export default function Sorted_Group(props: {
  images: string[];
  imageGroup: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  setImageGroup: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const { images, imageGroup, setImages, setImageGroup } = props;

  const handleOnClick = (e: any, image: string) => {
    const filteredImageGroup = imageGroup.filter(
      (imageItem) => image !== imageItem
    );
    setImages((arr) => [...arr, image]);
    setImageGroup(filteredImageGroup);
  };

  const renderImages = (): JSX.Element[] => {
    return imageGroup.map((image: string, index) => {
      return (
        <ul className="Sorted_Textures" key={index}>
          <img
            src={process.env.PUBLIC_URL + `/resources/real/${image}.png`}
            onClick={(e) => handleOnClick(e, image)}
            className="textureImage"
          />
        </ul>
      );
    });
  };
  const renderedImages = renderImages();
  return (
    <div className={renderedImages.length > 0 ? "Sorted_Group" : ""}>
      {renderedImages}
    </div>
  );
}
