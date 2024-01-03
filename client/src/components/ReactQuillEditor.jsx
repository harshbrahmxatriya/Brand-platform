import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const ReactQuillWrapper = ({ description, setDescription }) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  const handleChange = (value) => {
    setDescription(value);
  };

  return (
    <div>
      <ReactQuill
        className="h-[140px] mb-10"
        value={description}
        modules={modules}
        formats={formats}
        onChange={handleChange}
      />
    </div>
  );
};

export default ReactQuillWrapper;
