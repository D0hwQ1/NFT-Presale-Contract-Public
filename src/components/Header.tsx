import React, { useEffect, useRef, useState } from "react"

import { prepare, request, getResult, getCardList } from 'klip-sdk';
import {setKaikas} from "../klaytn/setKaikas"

const Header = (props: any) => {
    const {activate, getStory, story} = setKaikas();

    useEffect(() => {
        getStory()
    }, [story])

    return (
        <>
            <button className="connect" style={props.account ? {background: "#AAAAAA"} : {cursor: "pointer"}} onClick={activate}>{props.account ? "Connected" : "Connect Wallet"}</button>
            <img src='/api/logo' style={{width: "20vw", marginTop: "-4vh", marginBottom: "1vh"}} />
            <div style={{textAlign: "center"}}>
                <img src='/api/image' style={{display: "inline-block", width: "15vw"}} />
                <div style={{display: "inline-block", fontSize: "0.8vw", fontFamily: "sans-serif", width: "25vw", marginTop: "-4vh", marginBottom: "-2vh", marginLeft: "1vw"}}>
                {story}
                </div>
            </div>
        </>
    )
}
export default Header
