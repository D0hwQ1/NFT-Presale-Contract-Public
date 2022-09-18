import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Layout from "../components/layout";
import SEO from "../components/seo";

import { setKaikas } from "../klaytn/setKaikas";

import Setting from "../components/Setting";
import Upload from "../components/Upload";

const Admin = () => {
    const { klaytn, activate, getBalance, account, balance, csvLength, csvPresent, getCsvLength } = setKaikas();
    const [auth, setAuth] = useState<boolean>(false);

    useEffect(() => {
        activate();
        getBalance();

        if (auth == false) {
            activate();
            if (
                klaytn.selectedAddress.toLowerCase() != "0xasdf".toLowerCase()
            ) {
                console.log(klaytn.selectedAddress.toLowerCase());
                setAuth(true);
            } else {
                return alert("어드민 지갑이 아닙니다.");
            }
        }

        if (klaytn) {
            if (klaytn.networkVersion.toString() !== "8217") {
                toast.error(`Wrong network! Please select to Cypress Mainnet`, {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }

            klaytn.on("accountsChanged", async () => {
                getBalance();
            });

            klaytn.on("networkChanged", async () => {
                if (klaytn.networkVersion.toString() !== "8217") {
                    toast.error(`Wrong network! Please select to Cypress Mainnet`, {
                        position: "top-center",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
                getBalance();
            });
        } else {
            toast.error("Please install Klaytn Wallet", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }

        const csv = setInterval(() => getCsvLength(), 1000);
        return () => clearInterval(csv);
    }, []);

    if (auth == false) return null;
    return auth == true ? (
        <Layout>
            <SEO title="Minting" />
            <ToastContainer />
            <div style={{ margin: "0", marginTop: "30px", marginBottom: "50px", marginLeft: "50px", fontSize: "3rem", borderBlock: "3px" }}>
                {"현재 csv 현황 : " + [csvPresent]} / {[csvLength]}
            </div>
            <Upload></Upload>
            <Setting account={account} balance={balance}></Setting>
        </Layout>
    ) : null;
};

export default Admin;
