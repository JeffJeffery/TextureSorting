import React from "react";

const Instructions = (props: { percent: number }) => {
  const { percent } = props;
  return (
    <div className="Instructions">
      <h2 className="Instructions">
        Instructions: Click on similar textures to create a 9 texture texture
        group. Clicking on textures in the texture group will remove them to
        make space for new textures. Click on shuffle to see new textures.{" "}
      </h2>
      <h2>You have seen {percent}% of the database</h2>
    </div>
  );
};

export default Instructions;
