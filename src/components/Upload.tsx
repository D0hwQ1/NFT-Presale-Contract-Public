import React, { useState } from "react";
import axios from "axios";

const Upload = () => {
    const [logo, setLogo] = useState<any>();
    const [img, setImg] = useState<any>();
    const [story, setStory] = useState<any>();
    const [csv, setCsv] = useState<any>();

    const onClickLogo = () => {
        const formData = new FormData();

        formData.append("file", logo);
        try {
            axios.post("/api/logo", formData);
            alert("변경이 완료되었습니다.");
        } catch (e) {
            console.log(e);
        }
    };
    const onClickImg = () => {
        const formData = new FormData();

        formData.append("file", img);
        try {
            axios.post("/api/image", formData);
            alert("변경이 완료되었습니다.");
        } catch (e) {
            console.log(e);
        }
    };
    const onClickStory = () => {
        const formData = new FormData();

        formData.append("file", story);
        try {
            axios.post("/api/story", formData);
            alert("변경이 완료되었습니다.");
        } catch (e) {
            console.log(e);
        }
    };
    const onClickCsv = () => {
        const formData = new FormData();

        formData.append("file", csv);
        try {
            axios.post("/api/csv", formData).then(res => {
                console.log(res);
            });
            alert("변경이 완료되었습니다.");
            location.reload();
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div className="upload">
            <div style={{ display: "flex", fontFamily: "sans-serif" }}>
                <span style={{ width: "12vw", marginLeft: "5vw" }}>Change Logo</span>
                <input accept="image/*" type="file" onChange={(e: any) => setLogo(e.target.files[0])} />
                <button onClick={onClickLogo}>업로드</button>
            </div>
            <br />
            <div style={{ display: "flex", fontFamily: "sans-serif" }}>
                <span style={{ width: "12vw", marginLeft: "5vw" }}>Change Img</span>
                <input accept="image/*" type="file" onChange={(e: any) => setImg(e.target.files[0])} />
                <button onClick={onClickImg}>업로드</button>
            </div>
            <br />
            <div style={{ display: "flex", fontFamily: "sans-serif" }}>
                <span style={{ width: "12vw", marginLeft: "5vw" }}>Change Story</span>
                <input accept=".txt" type="file" onChange={(e: any) => setStory(e.target.files[0])} />
                <button onClick={onClickStory}>업로드</button>
            </div>
            <br />
            <div style={{ display: "flex", fontFamily: "sans-serif" }}>
                <span style={{ width: "12vw", marginLeft: "5vw" }}>Change Metadata</span>
                <input type="file" accept=".csv" onChange={(e: any) => setCsv(e.target.files[0])} />
                <button onClick={onClickCsv}>업로드</button>
            </div>
        </div>
    );
};
export default Upload;
