import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { setKaikas } from "../klaytn/setKaikas";

const Timer = (props: any) => {
    const { getTokenCount, curCount, maxCount, maxAmount, getTimer, timer, NFTBuy, price, getBalance, balance } = setKaikas();
    const [text, setText] = useState<number>(0);

    useEffect(() => {
        getBalance();
    }, [props.account]);

    useEffect(() => {
        const time = setInterval(() => getTimer(), 250);
        return () => clearInterval(time);
    }, []);

    useEffect(() => {
        const token = setInterval(() => getTokenCount(), 250);
        return () => clearInterval(token);
    }, []);

    return (
        <>
            <div className="timer">{timer || "00:00:00"}</div>
            <div className="box">
                <div className="value">
                    <p>Left / Total</p>
                    <input value={curCount + " / " + maxCount} disabled={true} />
                </div>
                <div className="value">
                    <p>Price</p>
                    <input value={String(Number(price)) + " KLAY"} disabled={true} />
                </div>
                <div className="value">
                    <p>Quantity</p>
                    <input
                        type="number"
                        placeholder={"0"}
                        value={text > 0 ? text : ""}
                        onChange={(e: any) => {
                            if (maxAmount > curCount) {
                                if (e.target.value > curCount) setText(Number(curCount));
                                else setText(e.target.value);
                            } else if (curCount >= maxAmount) {
                                if (e.target.value > maxAmount) setText(maxAmount);
                                else setText(e.target.value);
                            }
                        }}
                    />
                </div>
            </div>
            <a className="pay">
                <img
                    src={
                        timer == "00:00:00" && curCount != "0"
                            ? require("../images/minting_Btn_bk.png").default
                            : require("../images/minting_Btn_grey.png").default
                    }
                    onClick={
                        timer == "00:00:00" && curCount != "0" && text != 0
                            ? async () => {
                                  await NFTBuy(props.account, text).then(res => {
                                      if (res == true) toast.success("Minting successful", { autoClose: 2000, position: "top-center" });
                                      else if (res != "true") {
                                          toast.error("Please refresh it", { autoClose: 2000, position: "top-center" });
                                      }
                                  });
                                  getBalance();
                              }
                            : () => {
                                  if (text == 0) toast.error("please enter the quantity to purchase", { autoClose: 2000, position: "top-center" });
                                  else if (curCount == "0") toast.error("Sold out.", { autoClose: 2000, position: "top-center" });
                                  else if (timer != "00:00:00") toast.error("Currently not available to mint", { autoClose: 2000, position: "top-center" });
                              }
                    }
                />
            </a>
            <div className="box">
                <div className="value" style={{ marginBottom: "6vh" }}>
                    <p>My Balance</p>
                    <input value={String(Number(balance).toFixed(5)) + " KLAY"} disabled={false} />
                </div>
            </div>
        </>
    );
};
export default Timer;
