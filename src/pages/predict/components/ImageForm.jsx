import React, { useState } from "react";

const ImageForm = () => {
  const [inputImage, setInputImage] = useState();
  const [displayImage, setDisplayImage] = useState("");
  const [predictResult, setPredictResult] = useState("");
  const [serverError, setServerError] = useState("");
  const [isPredicting, setIsPredicting] = useState(false);

  const handleChange = (event) => {
    setServerError("");
    setPredictResult("");
    try {
      const file = event.target.files[0];
      setInputImage(file);
      setDisplayImage(URL.createObjectURL(file));
    } catch (error) {
      return;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if(displayImage.trim().length === 0){
      setServerError('Please provide image first')
      return
    }
    const apiPath = "http://localhost:5000";
    const formData = new FormData();
    formData.append("file", inputImage);
    // console.log(formData)
    setIsPredicting(true);
    const res = await fetch(`${apiPath}/predict`, {
      method: "POST",
      body: formData,
    });
    const resData = await res.json();
    if (!res.ok) {
      if (res.status === 400) {
        setServerError(resData);
      }
      setServerError("Internal Server Error");
    } else {
      setPredictResult(resData);
    }
    setIsPredicting(false);
  };

  return (
    <div className="flex flex-col place-items-center w-full">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col place-items-center lg:border p-10"
      >
        <h1 className="font-bold mb-5 text-lg ">Enter Your Image Here</h1>
        <span className="text-red-500 font-medium mb-2">
          Preferred image size is 224 x 224
        </span>
        <label htmlFor="imageinput">
          <div className="bg-black rounded-lg py-1 px-6 text-white font-bold">
            Choose File
          </div>
        </label>
        <div className="mt-5">
          <p>Your Image:</p>
          <input
            onChange={handleChange}
            hidden
            type="file"
            id="imageinput"
            name="imageinput"
            accept="image/png, image/jpeg"
          />
        </div>
        <div
          className="w-[80%] sm:w-[50%] md:w-[100%]  aspect-square rounded-md border-4 mt-2 bg-no-repeat bg-center bg-cover"
          style={{
            backgroundImage: `url(${
              displayImage
                ? displayImage
                : "images/noImage.png"
            })`,
          }}
          alt="predict-image"
        />
        <button
          disabled={isPredicting}
          type="submit"
          className="bg-black rounded-lg py-2 px-6 text-white font-bold mt-5"
        >
          Predict Now
        </button>
        {isPredicting && (
          <p className="text-center mt-2 font-medium">Predicting image, please wait...</p>
        )}
        {predictResult && (
          <p className="text-center mt-2 font-medium">{predictResult}</p>
        )}
        {serverError && (
          <p className="text-center mt-2 text-red-500 font-medium">
            {serverError}
          </p>
        )}
      </form>
    </div>
  );
};

export default ImageForm;
