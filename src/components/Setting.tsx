import React, { useState, useEffect } from "react";

import { setKaikas } from "../klaytn/setKaikas";

const Setting = (props: any) => {
    const {
        setList,
        Price,
        Time,
        WhiteList,
        WhiteAddress,
        resetWL,
        Withdraw,
        WithdrawAll,
        Airdrop,
        Amount,
        getTimer,
        TM,
        price,
        maxAmount,
        getTokenCount,
        maxCount,
        getWhiteList,
        WL,
        wlLength,
        getKlay,
        klay,
        setAirdrop,
        AC,
    } = setKaikas();

    const [_price, setPrice] = useState<any>();
    const [time, setTime] = useState<any>();
    const [amount, setAmount] = useState<any>();
    const [whiteList, setWhiteList] = useState<any>();
    const [csv, setCsv] = useState<any>();
    const [withdraw, setWithdraw] = useState<any>();

    useEffect(() => {
        getTimer();
        getTokenCount();
        getWhiteList();
        getKlay();

        const token = setInterval(() => getTokenCount(), 1000);
        return () => clearInterval(token);
    }, []);

    return (
        <>
            <div className="setting">
                <div style={{ display: "flex" }}>
                    <span style={{ width: "12vw", marginLeft: "5vw" }}>Minting 개수 추가</span>
                    <input placeholder="250" onChange={(e: any) => setAmount(e.target.value)} />
                    <button
                        onClick={async () => {
                            await setList(props.account, amount);
                            location.reload();
                        }}
                    >
                        적용
                    </button>
                </div>
                <br />
                <div style={{ display: "flex" }}>
                    <span style={{ width: "12vw", marginLeft: "5vw" }}>Minting Price</span>
                    <input placeholder="55" onChange={(e: any) => setPrice(e.target.value)} />
                    <button
                        onClick={async () => {
                            await Price(props.account, _price);
                            location.reload();
                        }}
                    >
                        적용
                    </button>
                </div>
                <br />
                <div style={{ display: "flex" }}>
                    <span style={{ width: "12vw", marginLeft: "5vw" }}>Minting Time</span>
                    <input placeholder="2022-1-25 12:0:0" onChange={(e: any) => setTime(e.target.value)} />
                    <button
                        onClick={async () => {
                            await Time(props.account, new Date(String(time)).getTime());
                            location.reload();
                        }}
                    >
                        적용
                    </button>
                </div>
                <br />
                <div style={{ display: "flex" }}>
                    <span style={{ width: "12vw", marginLeft: "5vw" }}>한 트랜잭션 허용 개수</span>
                    <input placeholder="10" onChange={(e: any) => setAmount(e.target.value)} />
                    <button
                        onClick={async () => {
                            await Amount(props.account, amount);
                            location.reload();
                        }}
                    >
                        적용
                    </button>
                </div>
                <br />
                <div style={{ display: "flex" }}>
                    <span style={{ width: "12vw", marginLeft: "5vw" }}>WhiteList</span>
                    <input placeholder="true / false" onChange={(e: any) => setWhiteList(e.target.value)} />
                    <button
                        onClick={async () => {
                            await WhiteList(props.account, whiteList);
                            location.reload();
                        }}
                    >
                        적용
                    </button>
                </div>
                <br />
                <div style={{ display: "flex" }}>
                    <span style={{ width: "12vw", marginLeft: "5vw" }}>WhiteAddress</span>
                    <input style={{ fontSize: "1vw", width: "15vw" }} type="file" accept=".csv" onChange={(e: any) => setCsv(e.target.files[0])} />
                    <button
                        onClick={async () => {
                            var reader: any = new FileReader();
                            reader.onload = async function () {
                                var tmp = reader.result.replace(/\r/g, "").split("\n");
                                var address = [];
                                for (var i = 0; i < tmp.length; i++) {
                                    if (tmp[i] != "") address.push(tmp[i]);
                                }
                                await WhiteAddress(props.account, address);
                                // location.reload();
                            };
                            reader.readAsText(csv);
                        }}
                    >
                        적용
                    </button>
                    <button
                        style={{ marginLeft: "-50px", width: "5vw" }}
                        onClick={async () => {
                            await resetWL(props.account);
                            location.reload();
                        }}
                    >
                        리셋
                    </button>
                </div>
                <br />
                <div style={{ display: "flex" }}>
                    <span style={{ width: "12vw", marginLeft: "5vw" }}>Airdrop 개수</span>
                    <input placeholder="250" onChange={(e: any) => setAmount(e.target.value)} />
                    <button
                        onClick={async () => {
                            await setAirdrop(props.account, amount);
                            location.reload();
                        }}
                    >
                        적용
                    </button>
                </div>
                <br />
                <div style={{ display: "flex" }}>
                    <span style={{ width: "12vw", marginLeft: "5vw" }}>Airdrop</span>
                    <input style={{ fontSize: "1vw", width: "15vw" }} type="file" accept=".csv" onChange={(e: any) => setCsv(e.target.files[0])} />
                    <input style={{ width: "5vw" }} placeholder="수량 입력" onChange={(e: any) => setAmount(e.target.value)} />
                    <button
                        onClick={async () => {
                            var reader: any = new FileReader();
                            reader.onload = async function () {
                                var tmp = reader.result.replace(/\r/g, "").split("\n");
                                var address = [];
                                for (var i = 0; i < tmp.length; i++) {
                                    if (tmp[i] != "") address.push(tmp[i]);
                                }
                                await Airdrop(props.account, address, amount);
                            };
                            reader.readAsText(csv);
                        }}
                    >
                        보내기
                    </button>
                </div>
                <br />
                <div style={{ display: "flex" }}>
                    <span style={{ width: "12vw", marginLeft: "5vw" }}>Withdraw (klay)</span>
                    <input placeholder="10000" onChange={(e: any) => setWithdraw(e.target.value)} />
                    <button
                        onClick={async () => {
                            await Withdraw(props.account, withdraw);
                        }}
                    >
                        인출
                    </button>
                    <button
                        style={{ marginLeft: "-50px", width: "5vw" }}
                        onClick={async () => {
                            await WithdrawAll(props.account);
                        }}
                    >
                        모두 인출
                    </button>
                </div>
            </div>
            <div className="present">
                <h2 style={{ marginTop: "1vw" }}>현재 현황</h2>
                <p>
                    {"민팅 적용 개수 :"}
                    <span>{[maxCount]}</span>
                </p>
                <p>
                    {"Price :"}
                    <span>{[price]}</span>
                </p>
                <p>
                    {"Time :"}
                    <span>{[TM]}</span>
                </p>
                <p>
                    {"한번에 구매 가능한 개수 :"}
                    <span>{[maxAmount]}</span>
                </p>
                <p>
                    {"WhiteList :"}
                    <span>{[WL]}</span>
                </p>
                <p>
                    {"WhiteList 적용개수 :"}
                    <span>{[wlLength]}</span>
                </p>
                <p>
                    {"에어드랍 가능 개수 :"}
                    <span>{[AC]}</span>
                </p>
                <p>
                    {"인출 가능한 클레이 :"}
                    <span>{[klay]}</span>
                </p>
            </div>
        </>
    );
};
export default Setting;
