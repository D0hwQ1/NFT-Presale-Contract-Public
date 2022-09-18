import { useCallback, useEffect, useMemo, useState } from "react";
import Caver from "caver-js";
import axios from "axios";
var delay = (ms: any) => new Promise(resolve => setTimeout(resolve, ms));

declare global {
    interface Window {
        klaytn: any;
    }
}

export function setKaikas() {
    const dlc = require(__dirname + "/../../contract/build/contracts/DLC.json");

    const { klaytn }: any = typeof window !== "undefined" ? window : new Caver(process.env.GATSBY_MODE == "test" ? "https://public-node-api.klaytnapi.com/v1/baobab" : "https://public-node-api.klaytnapi.com/v1/cypress");
    const [account, setAccount] = useState(null);
    const [caver, setCaver] = useState<any>(new Caver(klaytn));
    const [active, setActive] = useState(false);
    const [balance, setBalance] = useState<number>(0);
    const [curCount, setCurCount] = useState<any>(null);
    const [maxCount, setMaxCount] = useState<any>(null);
    const [AC, setAC] = useState<any>(null);
    const [maxAmount, setMaxAmount] = useState<any>(null);
    const [TM, setTM] = useState<any>(null);
    const [timer, setTimer] = useState<any>(null);
    const [price, setPrice] = useState<string>("");
    const [story, setStory] = useState<string>("");
    const [WL, setWL] = useState<any>("");
    const [wlLength, setWlLength] = useState<any>("");
    const [klay, setKlay] = useState<any>("");
    const [csvLength, setCsvLength] = useState<string>("");
    const [csvPresent, setCsvPresent] = useState<string>("");

    const contract = new caver.klay.Contract(dlc.abi, dlc.networks[process.env.GATSBY_MODE == "test" ? "1001" : "8217"].address);

    useEffect(() => {
        if (klaytn) {
            setCaver(new Caver(klaytn));
        }
    }, []);

    const activate = useCallback(async () => {
        if (klaytn) {
            try {
                await klaytn.enable();
            } catch (e) {
                throw e;
            }
            await new Promise(resolve => {
                setTimeout(resolve, 200);
            });
            await setAccountInfo();
            setActive(true);
        }
    }, [klaytn]);

    const setAccountInfo = useCallback(async () => {
        const account = klaytn.selectedAddress;
        setAccount(account);
    }, []);

    const getBalance = useCallback(async () => {
        await delay(200);
        const _balance = await caver.klay.getBalance(klaytn.selectedAddress);
        setBalance(caver.utils.fromPeb(caver.utils.toBN(_balance)));
    }, []);

    const getTokenCount = useCallback(async () => {
        const present: any = (await axios.get("/api/curCount")).data;
        const allNFT: any = (await axios.get("/api/maxCount")).data;
        setWlLength((await axios.get("/api/whiteAddress")).data);
        setAC((await axios.get("/api/airdrop")).data);

        try {
            setCurCount(parseInt(present));
        } catch (e) {
            setCurCount(-1);
        }

        try {
            setMaxCount(parseInt(allNFT));
        } catch {
            setMaxCount(-1);
        }
    }, []);

    const getTimer = async () => {
        const _price: any = (await axios.get("/api/price")).data;
        const time: any = (await axios.get("/api/time")).data;
        const presenttime: any = (await axios.get("/api/presenttime")).data;
        const maxAmount: any = (await axios.get("/api/maxAmount")).data;

        setTM(String(new Date(time)));
        setPrice(caver.utils.fromPeb(_price));
        setMaxAmount(maxAmount);

        var resTimer: any = new Date(parseInt(time));
        var present: any = new Date(parseInt(presenttime));

        const timezone: any = 9 + present.getTimezoneOffset() / 60;

        if (resTimer > present) {
            var day: any = resTimer.getDate() - present.getDate() < 1 ? 0 : resTimer.getDate() - present.getDate();
            var hours: any = new Date(resTimer.getTime() - present.getTime()).getHours() + timezone - 9 + day * 24;
            var minutes: any = new Date(resTimer.getTime() - present.getTime()).getMinutes();
            var seconds: any = new Date(resTimer.getTime() - present.getTime()).getSeconds();

            if (hours < 10) {
                hours = "0" + hours;
            }
            if (minutes < 10) {
                minutes = "0" + minutes;
            }
            if (seconds < 10) {
                seconds = "0" + seconds;
            }

            setTimer(hours + ":" + minutes + ":" + seconds);
        } else setTimer("00:00:00");
    };

    const getStory = async () => {
        setStory((await axios.get("/api/story")).data);
    };
    const getCsvLength = async () => {
        setCsvLength((await axios.get("/api/csv")).data);
        setCsvPresent((await axios.get("/api/csvPresent")).data);
    };
    const getWhiteList = async () => {
        setWL((await axios.get("/api/whiteList")).data.toString());
    };
    const getKlay = async () => {
        setKlay(caver.utils.fromPeb((await axios.get("/api/klay")).data.toString()));
    };

    const NFTBuy = async (account: any, amount: any) => {
        const _price: any = (await axios.get("/api/price")).data;

        try {
            await contract.methods.purchase(amount).send({
                from: account,
                gas: 5000000,
                value: caver.utils.toPeb(amount * parseInt(_price), "peb"),
            });

            return true;
        } catch (e: any) {
            console.log(e);
            const message = String(e).split(": ")[4];

            return message;
        }
    };
    const setList = async (account: any, amount: any) => {
        var list = (await axios.get("/api/minting", { params: { amount: amount, pw: "0C3406863A4652D891868A7B920F67C433BB2B6CE06CE708D8FE903C03966526" } }))
            .data;

        for (var i = 0; i < list[1].length; i++) list[1][i] = "https://ipfs.io/ipfs/" + list[1][i];

        var max = 100;

        try {
            if (amount > max) {
                var tmp = list[0].slice(0, max);
                var tmp2 = list[1].slice(0, max);
                var cnt = 0;
                var repeat = Math.floor(amount / max);
                amount % 100 == 0 ? (repeat -= 1) : repeat;

                await contract.methods.setList(tmp, tmp2).send({
                    from: account,
                    gas: 200000000,
                });
                await axios.get("/api/minting/success", {
                    params: { amount: tmp.length, pw: "0C3406863A4652D891868A7B920F67C433BB2B6CE06CE708D8FE903C03966526" },
                });

                for (var i = 0; i < repeat; i++) {
                    cnt += 1;
                    tmp = list[0].slice(cnt * 100, (cnt + 1) * max);
                    tmp2 = list[1].slice(cnt * 100, (cnt + 1) * max);

                    await contract.methods.setList(tmp, tmp2).send({
                        from: account,
                        gas: 200000000,
                    });
                    await axios.get("/api/minting/success", {
                        params: { amount: tmp.length, pw: "0C3406863A4652D891868A7B920F67C433BB2B6CE06CE708D8FE903C03966526" },
                    });
                }

                return true;
            } else {
                console.log(list[0], list[1]);
                await contract.methods.setList(list[0], list[1]).send({
                    from: account,
                    gas: 2000000,
                });

                await axios.get("/api/minting/success", { params: { amount: amount, pw: "0C3406863A4652D891868A7B920F67C433BB2B6CE06CE708D8FE903C03966526" } });

                return true;
            }
        } catch (e) {
            console.log(e);
            const message = String(e).split(": ")[4];

            return message;
        }
    };
    const Price = async (account: any, value: any) => {
        try {
            await contract.methods.setPrice(caver.utils.toPeb(value)).send({
                from: account,
                gas: 5000000,
            });

            return true;
        } catch (e: any) {
            console.log(e);
            const message = String(e).split(": ")[4];

            return message;
        }
    };
    const Time = async (account: any, value: any) => {
        try {
            await contract.methods.setTime(value).send({
                from: account,
                gas: 5000000,
            });

            return true;
        } catch (e: any) {
            console.log(e);
            const message = String(e).split(": ")[4];

            return message;
        }
    };
    const WhiteList = async (account: any, value: any) => {
        try {
            if (value == "true") {
                await contract.methods.setWhiteList(true).send({
                    from: account,
                    gas: 5000000,
                });
            } else {
                await contract.methods.setWhiteList(false).send({
                    from: account,
                    gas: 5000000,
                });
            }

            return true;
        } catch (e: any) {
            console.log(e);
            const message = String(e).split(": ")[4];

            return message;
        }
    };
    const WhiteAddress = async (account: any, address: any) => {
        var max = 200;

        try {
            if (address.length > max) {
                var repeat = Math.floor(address.length / max);
                for (var i = 0; i <= repeat; i++) {
                    var tmp = address.slice(i * 100, (i + 1) * max);

                    await contract.methods.setWhiteAddress(tmp).send({
                        from: account,
                        gas: 10000000,
                    });
                }

                return true;
            } else {
                await contract.methods.setWhiteAddress(address).send({
                    from: account,
                    gas: 10000000,
                });

                return true;
            }
        } catch (e: any) {
            console.log(e);
            return e;
        }
    };
    const resetWL = async (account: any) => {
        try {
            await contract.methods.resetWhiteAddress().send({
                from: account,
                gas: 5000000,
            });

            return true;
        } catch (e: any) {
            console.log(e);
            return e;
        }
    };
    const Withdraw = async (account: any, value: any) => {
        try {
            await contract.methods.withdraw(caver.utils.toPeb(value)).send({
                from: account,
                gas: 5000000,
            });

            return true;
        } catch (e: any) {
            console.log(e);
            const message = String(e).split(": ")[4];

            return message;
        }
    };
    const WithdrawAll = async (account: any) => {
        try {
            await contract.methods.withdrawAll().send({
                from: account,
                gas: 5000000,
            });

            return true;
        } catch (e: any) {
            console.log(e);
            const message = String(e).split(": ")[4];

            return message;
        }
    };
    const Airdrop = async (account: any, address: any, amount: any) => {
        try {
            await contract.methods.airdrop(address, amount).send({
                from: account,
                gas: 50000000 * amount,
            });

            return true;
        } catch (e: any) {
            console.log(e);
            const message = String(e).split(": ")[4];

            return message;
        }
    };
    const setAirdrop = async (account: any, amount: any) => {
        var list = (await axios.get("/api/minting", { params: { amount: amount, pw: "0C3406863A4652D891868A7B920F67C433BB2B6CE06CE708D8FE903C03966526" } }))
            .data;

        for (var i = 0; i < list[1].length; i++) list[1][i] = "https://ipfs.io/ipfs/" + list[1][i];

        var max = 100;

        try {
            if (amount > max) {
                var tmp = list[0].slice(0, max);
                var tmp2 = list[1].slice(0, max);
                var cnt = 0;
                var repeat = Math.floor(amount / max);
                amount % 100 == 0 ? (repeat -= 1) : repeat;

                await delay(1000);
                await contract.methods.setAirdrop(tmp, tmp2).send({
                    from: account,
                    gas: 200000000,
                });
                await delay(200);
                await axios.get("/api/minting/success", {
                    params: { amount: tmp.length, pw: "0C3406863A4652D891868A7B920F67C433BB2B6CE06CE708D8FE903C03966526" },
                });

                for (var i = 0; i < repeat; i++) {
                    cnt += 1;
                    tmp = list[0].slice(cnt * 100, (cnt + 1) * max);
                    tmp2 = list[1].slice(cnt * 100, (cnt + 1) * max);

                    await delay(1000);
                    await contract.methods.setAirdrop(tmp, tmp2).send({
                        from: account,
                        gas: 200000000,
                    });
                    await delay(200);
                    await axios.get("/api/minting/success", {
                        params: { amount: tmp.length, pw: "0C3406863A4652D891868A7B920F67C433BB2B6CE06CE708D8FE903C03966526" },
                    });
                }

                return true;
            } else {
                await contract.methods.setAirdrop(list[0], list[1]).send({
                    from: account,
                    gas: 200000000,
                });
                await axios.get("/api/minting/success", {
                    params: { amount: tmp.length, pw: "0C3406863A4652D891868A7B920F67C433BB2B6CE06CE708D8FE903C03966526" },
                });

                return true;
            }
        } catch (e: any) {
            console.log(e);
            const message = String(e).split(": ")[4];

            return message;
        }
    };
    const Amount = async (account: any, amount: any) => {
        try {
            await contract.methods.setAmount(amount).send({
                from: account,
                gas: 5000000,
            });

            return true;
        } catch (e: any) {
            console.log(e);
            const message = String(e).split(": ")[4];

            return message;
        }
    };

    const key = useMemo(
        () => ({
            klaytn,
            account,
            caver,
            active,
            activate,
            getBalance,
            balance,
            getTokenCount,
            curCount,
            maxCount,
            maxAmount,
            getTimer,
            TM,
            timer,
            price,
            getStory,
            story,
            getCsvLength,
            csvLength,
            csvPresent,
            getWhiteList,
            WL,
            wlLength,
            getKlay,
            klay,
            NFTBuy,
            setList,
            Price,
            Time,
            WhiteList,
            WhiteAddress,
            resetWL,
            Withdraw,
            WithdrawAll,
            Airdrop,
            setAirdrop,
            Amount,
            AC,
        }),
        [
            klaytn,
            account,
            caver,
            active,
            activate,
            getBalance,
            balance,
            getTokenCount,
            curCount,
            maxCount,
            maxAmount,
            getTimer,
            TM,
            timer,
            price,
            getStory,
            story,
            getCsvLength,
            csvLength,
            csvPresent,
            getWhiteList,
            WL,
            wlLength,
            getKlay,
            klay,
            NFTBuy,
            setList,
            Price,
            Time,
            WhiteList,
            WhiteAddress,
            resetWL,
            Withdraw,
            WithdrawAll,
            Airdrop,
            setAirdrop,
            Amount,
            AC,
        ]
    );

    return { ...key };
}
